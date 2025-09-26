import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../store/hook";
import { disciplinaryCasesService } from "../../../../services/DisciplinaryCasesService";
import { disciplinaryTypesService } from "../../../../services/DisciplinaryTypesService";
import {
  DisciplinaryCase,
  DisciplinaryCaseFormData,
  DisciplinaryCaseFormUpdate,
} from "../../../../@types/disciplinaryCases.dto";
import { DisciplinaryType } from "../../../../@types/disciplinaryTypes.dto";
import { getErrorMessage } from "../../../../utils/common";
import { apiEmployees } from "../../../../services/CommonServices";

type DocumentTypeMode = "add" | "edit" | "view" | "approve";

interface UseDisciplinaryCasesProps {
  mode: DocumentTypeMode;
  systemId?: string;
}

export const useDisciplinaryCases = ({
  mode,
  systemId,
}: UseDisciplinaryCasesProps) => {
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo, employeeName } = useAppSelector(
    (state) => state.auth.user
  );

  const [state, setState] = useState<{
    isLoading: boolean;
    disciplinaryCase: DisciplinaryCase | null;
    error: string | null;
  }>({
    isLoading: false,
    disciplinaryCase: null,
    error: null,
  });

  const [disciplinaryTypes, setDisciplinaryTypes] = useState<
    DisciplinaryType[]
  >([]);
  const [filteredDisciplinaryTypes, setFilteredDisciplinaryTypes] = useState<
    DisciplinaryType[]
  >([]);
  const [employeeOptions, setEmployeeOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [formData, setFormData] = useState<DisciplinaryCaseFormData>({
    caseCategory: "",
    gdCode: "",
    disciplinaryCaseDescription: "",
    caseRegisteredByNo: employeeNo || "",
    caseRegisteredByName: employeeName || "",
    employeeNo: "",
    nameOfIndicted: "",
    incidentDate: new Date().toISOString().split("T")[0],
    dateRaised: new Date().toISOString().split("T")[0],
    sendGrievanceTo: "",
    copyGrievancyTo: "",
    status: "Open",
    witnesses: "",
    investigators: "",
    submitTo: "Individual Employee",
  });

  const isFieldDisabled = mode === "view" || mode === "approve";

  useEffect(() => {
    if (mode === "add") {
      fetchDisciplinaryTypes();
      fetchEmployeeOptions();
    } else if (systemId) {
      fetchDisciplinaryCase();
    }
  }, [mode, systemId, companyId]);

  const fetchDisciplinaryCase = async () => {
    if (!systemId) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await disciplinaryCasesService.getDisciplinaryCase(
        companyId,
        systemId
      );
      setState((prev) => ({
        ...prev,
        disciplinaryCase: data,
        isLoading: false,
      }));

      // Populate form data with fetched data
      setFormData({
        caseCategory: data.caseCategory || "",
        gdCode: data.gdCode || "",
        disciplinaryCaseDescription: data.disciplinaryCaseDescription || "",
        caseRegisteredByNo: data.caseRegisteredByNo || "",
        caseRegisteredByName: data.caseRegisteredByName || "",
        employeeNo: data.employeeNo || "",
        nameOfIndicted: data.nameOfIndicted || "",
        incidentDate: data.incidentDate || "",
        dateRaised: data.dateRaised || "",
        sendGrievanceTo: data.sendGrievanceTo || "",
        copyGrievancyTo: data.copyGrievancyTo || "",
        status: data.status || "Open",
        witnesses: data.witnesses || "",
        investigators: data.investigators || "",
        submitTo: data.submitTo || "Individual Employee",
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
        isLoading: false,
      }));
      toast.error(
        `Error fetching Disciplinary Case: ${getErrorMessage(error)}`
      );
    }
  };

  const fetchDisciplinaryTypes = async () => {
    try {
      // Filter at API level to only get disciplinary types
      const filterQuery = `$filter=type eq 'Disciplinary'`;
      const data = await disciplinaryTypesService.getDisciplinaryTypes(
        companyId,
        filterQuery
      );
      setDisciplinaryTypes(data);
      setFilteredDisciplinaryTypes(data);
    } catch (error) {
      console.error("Error fetching disciplinary types:", error);
    }
  };

  const fetchEmployeeOptions = async () => {
    try {
      const response = await apiEmployees(companyId);
      const data = response.data.value || response.data;
      const options = data.map((emp: any) => ({
        label: `${emp.No} - ${emp.FirstName} ${emp.LastName}`,
        value: emp.No,
      }));
      setEmployeeOptions(options);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (
    field: keyof DisciplinaryCaseFormData,
    value: any
  ) => {
    const actualValue = typeof value === "object" ? value.value : value;

    setFormData((prev) => ({
      ...prev,
      [field]: actualValue,
    }));

    // Filter disciplinary types when category changes
    if (field === "caseCategory") {
      filterDisciplinaryTypesByCategory(actualValue);
    }

    // Auto-populate G/D Code when Case Description is selected
    if (field === "disciplinaryCaseDescription") {
      const actualValue = typeof value === "object" ? value.value : value;
      const selectedType = filteredDisciplinaryTypes.find(
        (type) => type.description === actualValue
      );
      if (selectedType) {
        setFormData((prev) => ({
          ...prev,
          gdCode: selectedType.code,
        }));
      }
    }
  };

  const filterDisciplinaryTypesByCategory = (category: string) => {
    if (!category || category === "Select Category") {
      // Show all disciplinary types when no category is selected
      setFilteredDisciplinaryTypes(disciplinaryTypes);
    } else {
      // Filter by category (disciplinary types are already filtered at API level)
      const filtered = disciplinaryTypes.filter(
        (type) => type.disciplinaryCategory === category
      );
      setFilteredDisciplinaryTypes(filtered);
    }

    // Clear Case Description and G/D Code when category changes
    setFormData((prev) => ({
      ...prev,
      disciplinaryCaseDescription: "",
      gdCode: "",
    }));
  };

  const createDisciplinaryCase = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Exclude read-only fields from submission
      const {
        status,
        caseRegisteredByName,
        nameOfIndicted,
        ...submissionData
      } = formData;

      const response = await disciplinaryCasesService.createDisciplinaryCase(
        companyId,
        submissionData
      );

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Disciplinary Case created successfully!");

      // Navigate to the details page
      navigate(`/disciplinary-case-details/${response.data.systemId}`);
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error(
        `Error creating Disciplinary Case: ${getErrorMessage(error)}`
      );
      throw error;
    }
  };

  const updateDisciplinaryCase = async () => {
    if (!systemId || !state.disciplinaryCase) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const updateData: DisciplinaryCaseFormUpdate = {
        ...formData,
        systemId,
      };

      await disciplinaryCasesService.updateDisciplinaryCase(
        companyId,
        updateData,
        systemId,
        state.disciplinaryCase["@odata.etag"] || ""
      );

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Disciplinary Case updated successfully!");

      // Refresh the data
      await fetchDisciplinaryCase();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error(
        `Error updating Disciplinary Case: ${getErrorMessage(error)}`
      );
      throw error;
    }
  };

  const getFormFields = () => {
    const basicFields = [
      {
        label: "No",
        type: "text",
        value: state.disciplinaryCase?.no || "",
        disabled: true,
        id: "no",
      },
      {
        label: "Case Registered By No",
        type: "text",
        value: formData.caseRegisteredByNo || "",
        disabled: true,
        id: "caseRegisteredByNo",
      },
      {
        label: "Case Registered By Name",
        type: "text",
        value: formData.caseRegisteredByName || "",
        disabled: true,
        id: "caseRegisteredByName",
      },
      {
        label: "Disciplinary Category",
        type: "select",
        value: formData.caseCategory
          ? { label: formData.caseCategory, value: formData.caseCategory }
          : { label: "Select Category", value: "Select Category" },
        disabled: isFieldDisabled,
        id: "caseCategory",
        options: [
          { label: "Select Category", value: "Select Category" },
          { label: "Minor", value: "Minor" },
          { label: "Serious", value: "Serious" },
          { label: "Gross", value: "Gross" },
        ],
        onChange: (value: any) => {
          handleInputChange("caseCategory", value);
        },
      },
      {
        label: "Case Description",
        type: "select",
        value: formData.disciplinaryCaseDescription
          ? {
              label: formData.disciplinaryCaseDescription,
              value: formData.disciplinaryCaseDescription,
            }
          : { label: "Select...", value: "" },
        disabled: isFieldDisabled,
        id: "disciplinaryCaseDescription",
        options: [
          { label: "Select...", value: "" },
          ...filteredDisciplinaryTypes.map((type) => ({
            label: type.description,
            value: type.description,
          })),
        ],
        onChange: (value: any) => {
          handleInputChange("disciplinaryCaseDescription", value);
        },
      },
      {
        label: "G/D Code",
        type: "text",
        value: formData.gdCode || "",
        disabled: true,
        id: "gdCode",
      },
      {
        label: "Employee No",
        type: "select",
        value: formData.employeeNo
          ? {
              label: formData.employeeNo,
              value: formData.employeeNo,
            }
          : { label: "Select...", value: "" },
        disabled: isFieldDisabled,
        id: "employeeNo",
        options: [{ label: "Select...", value: "" }, ...employeeOptions],
        onChange: (value: any) => {
          handleInputChange("employeeNo", value);
        },
      },
      {
        label: "Name of Indicted",
        type: "text",
        value: formData.nameOfIndicted || "",
        disabled: true,
        id: "nameOfIndicted",
      },
      {
        label: "Witnesses",
        type: "text",
        value: formData.witnesses || "",
        disabled: isFieldDisabled,
        id: "witnesses",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange("witnesses", e.target.value);
        },
      },
      {
        label: "Investigators",
        type: "text",
        value: formData.investigators || "",
        disabled: isFieldDisabled,
        id: "investigators",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange("investigators", e.target.value);
        },
      },
      {
        label: "Incident Date",
        type: "date",
        value: formData.incidentDate || "",
        disabled: isFieldDisabled,
        id: "incidentDate",
        onChange: (_: Date[], dateStr: string) => {
          handleInputChange("incidentDate", dateStr);
        },
      },
      {
        label: "Date Raised",
        type: "date",
        value: formData.dateRaised || "",
        disabled: isFieldDisabled,
        id: "dateRaised",
        onChange: (_: Date[], dateStr: string) => {
          handleInputChange("dateRaised", dateStr);
        },
      },
      {
        label: "Status",
        type: "text",
        value: "Open",
        disabled: true,
        id: "docStatus",
      },
    ];

    return [basicFields];
  };

  return {
    state,
    formData,
    createDisciplinaryCase,
    updateDisciplinaryCase,
    getFormFields,
    handleInputChange,
  };
};
