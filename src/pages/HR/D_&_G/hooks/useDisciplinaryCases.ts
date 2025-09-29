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
  DisciplinaryCaseSubmissionData,
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

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState<DisciplinaryCaseFormData>({
    caseCategory: "",
    gdCode: "",
    disciplinaryCaseDescription: "",
    caseRegisteredByNo: employeeNo || "",
    caseRegisteredByName: employeeName || "",
    employeeNo: "",
    indictedEmployeeNo: "",
    indictedEmployeeName: "",
    incidentDate: getTodayDate(),
    dateRaised: getTodayDate(),
    sendGrievanceTo: "",
    copyGrievancyTo: "",
    status: "Open",
    submitTo: "Individual Employee",
  });

  const isFieldDisabled = mode === "view" || mode === "approve";

  // Save on blur functionality
  const handleSaveOnBlur = async (
    fieldName?: string | React.FocusEvent<HTMLInputElement>,
    newValue?: any
  ) => {
    if (mode === "edit" && systemId && state.disciplinaryCase) {
      try {
        // If a specific field is provided, only update that field
        let updateData: any = { systemId: state.disciplinaryCase.systemId };

        // Handle both string fieldName and FocusEvent
        let actualFieldName: string | undefined;
        if (typeof fieldName === "string") {
          actualFieldName = fieldName;
        } else if (fieldName && "target" in fieldName) {
          // Extract field name from the input element's id
          actualFieldName = (fieldName.target as HTMLInputElement).id;
        }

        if (actualFieldName) {
          // Handle special case: when Case Description is selected, save the G/D Code instead
          if (actualFieldName === "disciplinaryCaseDescription") {
            console.log("Case Description selected, saving G/D Code instead");
            const gdCodeValue = formData.gdCode;
            if (gdCodeValue) {
              updateData["gdCode"] = gdCodeValue;
              await disciplinaryCasesService.updateDisciplinaryCase(
                companyId,
                updateData,
                systemId,
                "*"
              );
              toast.success("G/D Code updated successfully");
            }
            return;
          }

          // Handle special case: when Indicted Employee No is selected, save both indictedEmployeeNo and indictedEmployeeName
          if (actualFieldName === "indictedEmployeeNo") {
            console.log(
              "Indicted Employee No selected, saving indictedEmployeeNo and indictedEmployeeName"
            );
            const indictedEmployeeNoValue = formData.indictedEmployeeNo;
            const indictedEmployeeNameValue = formData.indictedEmployeeName;
            if (indictedEmployeeNoValue) {
              updateData["indictedEmployeeNo"] = indictedEmployeeNoValue;
              updateData["indictedEmployeeName"] = indictedEmployeeNameValue;
              await disciplinaryCasesService.updateDisciplinaryCase(
                companyId,
                updateData,
                systemId,
                "*"
              );
              toast.success(
                "Indicted Employee information updated successfully"
              );
            }
            return;
          }

          const fieldValue =
            newValue !== undefined
              ? newValue
              : formData[actualFieldName as keyof DisciplinaryCaseFormData];

          console.log(
            `handleSaveOnBlur - Updating field ${actualFieldName} with value:`,
            fieldValue
          );

          updateData[actualFieldName] = fieldValue;

          // Update the disciplinary case with just this field
          await disciplinaryCasesService.updateDisciplinaryCase(
            companyId,
            updateData,
            systemId,
            "*"
          );

          const fieldLabel = actualFieldName
            ? actualFieldName
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())
            : "Field";
          toast.success(`${fieldLabel} updated successfully`);
        }
      } catch (error) {
        console.error("handleSaveOnBlur - Error:", error);
        toast.error(`Error updating field: ${getErrorMessage(error)}`);
      }
    }
  };

  useEffect(() => {
    if (mode === "add") {
      fetchDisciplinaryTypes();
      fetchEmployeeOptions();
    } else if (systemId) {
      fetchDisciplinaryCase();
      fetchEmployeeOptions(); // Always fetch employee options when viewing/editing
    }
  }, [mode, systemId, companyId]);

  // Ensure Date Raised defaults to today's date in add mode
  useEffect(() => {
    if (
      mode === "add" &&
      (!formData.dateRaised || formData.dateRaised === "")
    ) {
      setFormData((prev) => ({
        ...prev,
        dateRaised: getTodayDate(),
      }));
    }
  }, [mode, formData.dateRaised]);

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

      // Wait for employee options to be loaded before populating form data
      if (employeeOptions.length === 0) {
        await fetchEmployeeOptions();
      }

      // Populate form data with fetched data
      setFormData({
        caseCategory: data.caseCategory || "",
        gdCode: data.gdCode || "",
        disciplinaryCaseDescription: data.disciplinaryCaseDescription || "",
        caseRegisteredByNo: data.caseRegisteredByNo || "",
        caseRegisteredByName: data.caseRegisteredByName || "",
        employeeNo: data.indictedEmployeeNo || "", // Use indictedEmployeeNo for employeeNo field
        indictedEmployeeNo: data.indictedEmployeeNo || "",
        indictedEmployeeName: data.indictedEmployeeName || "",
        incidentDate: data.incidentDate || "",
        dateRaised: data.dateRaised || "",
        sendGrievanceTo: data.sendGrievanceTo || "",
        copyGrievancyTo: data.copyGrievancyTo || "",
        status: data.status || "Open",
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
    // Extract the actual value if it's an object (for form data storage)
    const actualValue = typeof value === "object" ? value.value : value;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: actualValue,
      };
      console.log(
        `handleInputChange - updated formData.${field}:`,
        newData[field]
      );
      return newData;
    });

    // Filter disciplinary types when category changes
    if (field === "caseCategory") {
      filterDisciplinaryTypesByCategory(actualValue);
    }

    // Auto-populate G/D Code when Case Description is selected
    if (field === "disciplinaryCaseDescription") {
      // Extract the actual value if it's an object (from react-select)
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

    // Auto-populate indictedEmployeeNo and indictedEmployeeName when employeeNo changes
    if (field === "employeeNo") {
      const actualValue = typeof value === "object" ? value.value : value;
      const selectedEmployee = employeeOptions.find(
        (emp) => emp.value === actualValue
      );
      setFormData((prev) => ({
        ...prev,
        employeeNo: actualValue, // Keep the original field for internal use
        indictedEmployeeNo: actualValue,
        indictedEmployeeName: selectedEmployee
          ? selectedEmployee.label.split(" - ").slice(1).join(" - ")
          : "",
      }));
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
        indictedEmployeeNo,
        indictedEmployeeName,
        copyGrievancyTo,
        disciplinaryCaseDescription,
        ...submissionData
      } = formData;

      const response = await disciplinaryCasesService.createDisciplinaryCase(
        companyId,
        submissionData as DisciplinaryCaseSubmissionData
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
        value: (() => {
          console.log(
            "Disciplinary Category field value:",
            formData.caseCategory
          );
          // Return object format for HeaderMui component
          if (formData.caseCategory && formData.caseCategory !== "") {
            return {
              label: formData.caseCategory,
              value: formData.caseCategory,
            };
          }
          return { label: "Select Category", value: "Select Category" };
        })(),
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
        onBlur: () => handleSaveOnBlur("caseCategory"),
      },
      {
        label: "Case Description",
        type: "select",
        value: (() => {
          console.log(
            "Case Description field value:",
            formData.disciplinaryCaseDescription
          );
          // Return object format for HeaderMui component
          if (
            formData.disciplinaryCaseDescription &&
            formData.disciplinaryCaseDescription !== ""
          ) {
            return {
              label: formData.disciplinaryCaseDescription,
              value: formData.disciplinaryCaseDescription,
            };
          }
          return { label: "Select...", value: "" };
        })(),
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
          console.log("Case Description onChange - received value:", value);
          handleInputChange("disciplinaryCaseDescription", value);
        },
        onBlur: () => handleSaveOnBlur("disciplinaryCaseDescription"),
      },
      {
        label: "G/D Code",
        type: "text",
        value: formData.gdCode || "",
        disabled: true,
        id: "gdCode",
      },
      {
        label: "Indicted Employee No.",
        type: "select",
        value: (() => {
          console.log("Indicted Employee No field value:", formData.employeeNo);
          console.log("Available employee options:", employeeOptions);
          // Return object format for HeaderMui component
          if (formData.employeeNo && formData.employeeNo !== "") {
            // Find the employee option that matches the selected value
            const selectedEmployee = employeeOptions.find(
              (emp) => emp.value === formData.employeeNo
            );
            console.log("Found selected employee:", selectedEmployee);
            if (selectedEmployee) {
              return selectedEmployee;
            }
          }
          return { label: "Select...", value: "" };
        })(),
        disabled: isFieldDisabled,
        id: "indictedEmployeeNo",
        options: [{ label: "Select...", value: "" }, ...employeeOptions],
        onChange: (value: any) => {
          console.log("Indicted Employee No onChange - received value:", value);
          handleInputChange("employeeNo", value);
        },
        onBlur: () => handleSaveOnBlur("indictedEmployeeNo"),
      },
      {
        label: "Indicted Employee Name",
        type: "text",
        value: formData.indictedEmployeeName || "",
        disabled: true,
        id: "indictedEmployeeName",
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
        onBlur: () => handleSaveOnBlur("incidentDate"),
      },
      {
        label: "Date Raised",
        type: "date",
        value: formData.dateRaised || (mode === "add" ? getTodayDate() : ""),
        disabled: isFieldDisabled,
        id: "dateRaised",
        onChange: (_: Date[], dateStr: string) => {
          handleInputChange("dateRaised", dateStr);
        },
        onBlur: () => handleSaveOnBlur("dateRaised"),
      },
      {
        label: "Status",
        type: "text",
        value: state.disciplinaryCase?.status || "Open",
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
    handleSaveOnBlur,
  };
};
