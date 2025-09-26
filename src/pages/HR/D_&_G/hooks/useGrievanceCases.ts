import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../store/hook";
import { grievanceCasesService } from "../../../../services/GrievanceCasesService";
import { disciplinaryTypesService } from "../../../../services/DisciplinaryTypesService";
import {
  GrievanceCase,
  GrievanceCaseFormData,
  GrievanceCaseFormUpdate,
  GrievanceCaseSubmissionData,
} from "../../../../@types/grievanceCases.dto";
import { DisciplinaryType } from "../../../../@types/disciplinaryTypes.dto";
import { getErrorMessage } from "../../../../utils/common";
import { apiEmployees } from "../../../../services/CommonServices";

type DocumentTypeMode = "add" | "edit" | "view" | "approve";

interface UseGrievanceCasesProps {
  mode: DocumentTypeMode;
  systemId?: string;
  status?: string;
}

export const useGrievanceCases = ({
  mode,
  systemId,
  status,
}: UseGrievanceCasesProps) => {
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo, employeeName } = useAppSelector(
    (state) => state.auth.user
  );

  const [state, setState] = useState<{
    isLoading: boolean;
    grievanceCase: GrievanceCase | null;
    error: string | null;
  }>({
    isLoading: false,
    grievanceCase: null,
    error: null,
  });

  const [grievanceTypes, setGrievanceTypes] = useState<DisciplinaryType[]>([]);
  const [filteredGrievanceTypes, setFilteredGrievanceTypes] = useState<
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

  const [formData, setFormData] = useState<GrievanceCaseFormData>({
    caseCategory: "",
    gdCode: "",
    grievanceCaseDescription: "",
    caseRegisteredByNo: employeeNo || "",
    caseRegisteredByName: employeeName || "",
    employeeNo: "",
    nameOfIndicted: "",
    indictedEmployeeNo: "",
    incidentDate: getTodayDate(),
    dateRaised: getTodayDate(),
    sendGrievanceTo: "",
    copyGrievancyTo: "",
    status: "Open",
    witnesses: "",
    investigators: "",
    submitTo: "Individual Employee",
    natureOfGrievance: "",
    processType: "",
    complainantFeedback: "",
    complainantSatisfaction: "",
  });

  const isFieldDisabled =
    mode === "view" ||
    mode === "approve" ||
    (mode === "edit" && status !== "Open");

  // Save on blur functionality

  useEffect(() => {
    if (mode === "add" || mode === "edit") {
      fetchGrievanceTypes();
      fetchEmployeeOptions();
    }
    if (systemId) {
      fetchGrievanceCase();
      // Always fetch employee options when viewing/editing existing cases
      fetchEmployeeOptions();
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

  // Debug: Monitor filteredGrievanceTypes changes
  useEffect(() => {
    console.log("filteredGrievanceTypes updated:", filteredGrievanceTypes);
  }, [filteredGrievanceTypes]);

  // Debug: Monitor formData.caseCategory changes
  useEffect(() => {
    console.log("formData.caseCategory updated:", formData.caseCategory);
  }, [formData.caseCategory]);

  const fetchGrievanceCase = async () => {
    if (!systemId) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await grievanceCasesService.getGrievanceCase(
        companyId,
        systemId
      );
      setState((prev) => ({ ...prev, grievanceCase: data, isLoading: false }));

      // Populate form data with fetched data
      setFormData({
        caseCategory: data.caseCategory || "",
        gdCode: data.gdCode || "",
        grievanceCaseDescription: data.disciplinaryCaseDescription || "",
        caseRegisteredByNo: data.caseRegisteredByNo || "",
        caseRegisteredByName: data.caseRegisteredByName || "",
        employeeNo: data.employeeNo || "",
        nameOfIndicted: data.indictedEmployeeNo || "",
        incidentDate: data.incidentDate || "",
        dateRaised: data.dateRaised || "",
        sendGrievanceTo: data.sendGrievanceTo || "",
        copyGrievancyTo: data.copyGrievancyTo || "",
        status: data.status || "Open",
        witnesses: data.witnesses || "",
        investigators: data.investigators || "",
        submitTo: data.submitTo || "Individual Employee",
        natureOfGrievance: data.natureOfGrievance || "",
        processType: data.processType || "",
        complainantFeedback: data.complainantFeedback || "",
        complainantSatisfaction: data.complainantSatisfaction || "",
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
        isLoading: false,
      }));
      toast.error(`Error fetching Grievance Case: ${getErrorMessage(error)}`);
    }
  };

  const fetchGrievanceTypes = async () => {
    try {
      // Filter at API level to only get grievance types
      const filterQuery = `$filter=type eq 'Grievance'`;
      const data = await disciplinaryTypesService.getDisciplinaryTypes(
        companyId,
        filterQuery
      );
      console.log("Fetched grievance types:", data);
      setGrievanceTypes(data);
      setFilteredGrievanceTypes(data);
    } catch (error) {
      console.error("Error fetching grievance types:", error);
    }
  };

  const fetchEmployeeOptions = async () => {
    try {
      const response = await apiEmployees(companyId);
      const data = response.data.value || response.data;
      console.log("Fetched employee data:", data);
      const options = data.map((emp: any) => ({
        label: `${emp.No} - ${emp.FirstName} ${emp.LastName}`,
        value: emp.No,
      }));
      console.log("Employee options:", options);
      setEmployeeOptions(options);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (
    field: keyof GrievanceCaseFormData,
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

    // Filter grievance types when category changes
    if (field === "caseCategory") {
      filterGrievanceTypesByCategory(actualValue);
    }

    // Auto-populate G/D Code when Case Description is selected
    if (field === "grievanceCaseDescription") {
      // Extract the actual value if it's an object (from react-select)
      const actualValue = typeof value === "object" ? value.value : value;
      const selectedType = filteredGrievanceTypes.find(
        (type) => type.description === actualValue
      );
      if (selectedType) {
        setFormData((prev) => ({
          ...prev,
          gdCode: selectedType.code,
        }));
      }
    }

    // Clear conditional fields when Nature of Grievance changes
    if (field === "natureOfGrievance") {
      setFormData((prev) => ({
        ...prev,
        nameOfIndicted: "",
        indictedEmployeeNo: "",
        sendGrievanceTo: "",
      }));
    }

    // Auto-populate indictedEmployeeNo when nameOfIndicted changes
    if (field === "nameOfIndicted") {
      const actualValue = typeof value === "object" ? value.value : value;
      setFormData((prev) => ({
        ...prev,
        indictedEmployeeNo: actualValue,
      }));
    }
  };

  const filterGrievanceTypesByCategory = (category: string) => {
    console.log("Filtering by category:", category);
    console.log("Available grievance types:", grievanceTypes);

    // Log all disciplinaryCategory values for debugging
    grievanceTypes.forEach((type, index) => {
      console.log(`Type ${index}:`, {
        code: type.code,
        description: type.description,
        disciplinaryCategory: type.disciplinaryCategory,
      });
    });

    if (!category || category === "Select Category") {
      setFilteredGrievanceTypes(grievanceTypes);
    } else {
      const filtered = grievanceTypes.filter(
        (type) => type.disciplinaryCategory === category
      );

      console.log("Filtered types by disciplinaryCategory:", filtered);
      console.log("Setting filteredGrievanceTypes to:", filtered);
      setFilteredGrievanceTypes(filtered);
    }

    // Clear Case Description and G/D Code when category changes
    setFormData((prev) => ({
      ...prev,
      grievanceCaseDescription: "",
      gdCode: "",
    }));
  };

  const createGrievanceCase = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Exclude read-only fields and employeeNo from submission
      const {
        status,
        complainantSatisfaction,
        caseRegisteredByName,
        nameOfIndicted,
        grievanceCaseDescription,
        employeeNo, // Exclude employeeNo as it's not expected by the API
        ...submissionData
      } = formData;

      const response = await grievanceCasesService.createGrievanceCase(
        companyId,
        submissionData as GrievanceCaseSubmissionData
      );

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Grievance Case created successfully!");

      // Navigate to the details page
      navigate(`/grievance-case-details/${response.data.systemId}`);
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error(`Error creating Grievance Case: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const updateGrievanceCase = async () => {
    if (!systemId || !state.grievanceCase) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const updateData: GrievanceCaseFormUpdate = {
        ...formData,
        systemId,
      };

      await grievanceCasesService.updateGrievanceCase(
        companyId,
        updateData,
        systemId,
        state.grievanceCase["@odata.etag"] || ""
      );

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Grievance Case updated successfully!");

      // Refresh the data
      await fetchGrievanceCase();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error(`Error updating Grievance Case: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const handleSaveOnBlur = async (
    fieldName?: string | React.FocusEvent<HTMLInputElement>,
    newValue?: any
  ) => {
    if (
      mode === "edit" &&
      status === "Open" &&
      systemId &&
      state.grievanceCase
    ) {
      try {
        // If a specific field is provided, only update that field
        let updateData: any = { systemId: state.grievanceCase.systemId };

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
          if (actualFieldName === "grievanceCaseDescription") {
            console.log("Case Description selected, saving G/D Code instead");
            const gdCodeValue = formData.gdCode;
            if (gdCodeValue) {
              updateData["gdCode"] = gdCodeValue;
              await grievanceCasesService.updateGrievanceCase(
                companyId,
                updateData,
                systemId,
                "*"
              );
              toast.success("G/D Code updated successfully");
            }
            return;
          }

          // Handle special case: when Name of Indicted is selected, save indictedEmployeeNo instead
          if (actualFieldName === "nameOfIndicted") {
            console.log(
              "Name of Indicted selected, saving indictedEmployeeNo instead"
            );
            const indictedEmployeeNoValue = formData.nameOfIndicted;
            if (indictedEmployeeNoValue) {
              updateData["indictedEmployeeNo"] = indictedEmployeeNoValue;
              await grievanceCasesService.updateGrievanceCase(
                companyId,
                updateData,
                systemId,
                "*"
              );
              toast.success("Indicted Employee No updated successfully");
            }
            return;
          }

          const fieldValue =
            newValue !== undefined
              ? newValue
              : formData[actualFieldName as keyof GrievanceCaseFormData];

          console.log(
            `handleSaveOnBlur - Updating field ${actualFieldName} with value:`,
            fieldValue
          );

          updateData[actualFieldName] = fieldValue;

          // Update the grievance case with just this field
          await grievanceCasesService.updateGrievanceCase(
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

  const getFormFields = () => {
    console.log(
      "getFormFields - formData.caseCategory:",
      formData.caseCategory
    );
    const basicFields = [
      {
        label: "No",
        type: "text",
        value: state.grievanceCase?.no || "",
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
        label: "Grievance Category",
        type: "select",
        value: (() => {
          console.log("Grievance Category field value:", formData.caseCategory);
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
            formData.grievanceCaseDescription
          );
          // Return object format for HeaderMui component
          if (
            formData.grievanceCaseDescription &&
            formData.grievanceCaseDescription !== ""
          ) {
            return {
              label: formData.grievanceCaseDescription,
              value: formData.grievanceCaseDescription,
            };
          }
          return { label: "Select...", value: "" };
        })(),
        disabled: isFieldDisabled,
        id: "grievanceCaseDescription",
        options: [
          { label: "Select...", value: "" },
          ...filteredGrievanceTypes.map((type) => ({
            label: type.description,
            value: type.description,
          })),
        ],
        onChange: (value: any) => {
          console.log("Case Description onChange - received value:", value);
          handleInputChange("grievanceCaseDescription", value);
        },
        onBlur: () => handleSaveOnBlur("grievanceCaseDescription"),
      },
      {
        label: "G/D Code",
        type: "text",
        value: formData.gdCode || "",
        disabled: true,
        id: "gdCode",
      },
      {
        label: "Nature of Grievance",
        type: "select",
        value: (() => {
          console.log(
            "Nature of Grievance field value:",
            formData.natureOfGrievance
          );
          // Return object format for HeaderMui component
          if (formData.natureOfGrievance && formData.natureOfGrievance !== "") {
            return {
              label: formData.natureOfGrievance,
              value: formData.natureOfGrievance,
            };
          }
          return { label: "Select Nature of Grievance", value: "" };
        })(),
        disabled: isFieldDisabled,
        id: "natureOfGrievance",
        options: [
          { label: "Select Nature of Grievance", value: "" },
          { label: "Person", value: "Person" },
          { label: "Process", value: "Process" },
        ],
        onChange: (value: any) => {
          console.log("Nature of Grievance onChange - received value:", value);
          handleInputChange("natureOfGrievance", value);
        },
        onBlur: () => handleSaveOnBlur("natureOfGrievance"),
      },
      {
        label: "Copy Grievancy To",
        type: "select",
        value: (() => {
          console.log(
            "Copy Grievancy To field value:",
            formData.copyGrievancyTo
          );
          // Return object format for HeaderMui component
          if (formData.copyGrievancyTo && formData.copyGrievancyTo !== "") {
            // Find the employee option that matches the selected value
            const selectedEmployee = employeeOptions.find(
              (emp) => emp.value === formData.copyGrievancyTo
            );
            if (selectedEmployee) {
              return selectedEmployee;
            }
          }
          return { label: "Select...", value: "" };
        })(),
        disabled: isFieldDisabled,
        id: "copyGrievancyTo",
        options: [
          { label: "Select...", value: "" },
          ...employeeOptions.filter(
            (emp) => emp.value !== formData.nameOfIndicted
          ),
        ],
        onChange: (value: any) => {
          console.log("Copy Grievancy To onChange - received value:", value);
          handleInputChange("copyGrievancyTo", value);
        },
        onBlur: () => handleSaveOnBlur("copyGrievancyTo"),
      },
      // Show Name of Indicted only if Nature of Grievance is "Person"
      ...(formData.natureOfGrievance === "Person"
        ? [
            {
              label: "Name of Indicted",
              type: "select",
              value: (() => {
                console.log(
                  "Name of Indicted field value:",
                  formData.nameOfIndicted
                );
                // Return object format for HeaderMui component
                if (formData.nameOfIndicted && formData.nameOfIndicted !== "") {
                  // Find the employee option that matches the selected value
                  const selectedEmployee = employeeOptions.find(
                    (emp) => emp.value === formData.nameOfIndicted
                  );
                  if (selectedEmployee) {
                    return selectedEmployee;
                  }
                }
                return { label: "Select...", value: "" };
              })(),
              disabled: isFieldDisabled,
              id: "nameOfIndicted",
              options: [
                { label: "Select...", value: "" },
                ...employeeOptions.filter(
                  (emp) => emp.value !== formData.copyGrievancyTo
                ),
              ],
              onChange: (value: any) => {
                console.log(
                  "Name of Indicted onChange - received value:",
                  value
                );
                handleInputChange("nameOfIndicted", value);
              },
              onBlur: () => handleSaveOnBlur("nameOfIndicted"),
            },
          ]
        : []),
      // Show Process Type only if Nature of Grievance is "Process"
      ...(formData.natureOfGrievance === "Process"
        ? [
            {
              label: "Process Type",
              type: "select",
              value: (() => {
                // Convert string value to object format for React-Select
                if (formData.processType) {
                  return {
                    label: formData.processType,
                    value: formData.processType,
                  };
                }
                return null;
              })(),
              disabled: isFieldDisabled,
              id: "processType",
              options: [
                { label: "Select Process Type", value: "" },
                {
                  label: "Job Description and Responsibilities",
                  value: "Job Description and Responsibilities",
                },
                {
                  label: "Renumeration and Benefits",
                  value: "Renumeration and Benefits",
                },
                {
                  label: "Work Environment and Culture",
                  value: "Work Environment and Culture",
                },
                {
                  label: "Work Enablers and Gear",
                  value: "Work Enablers and Gear",
                },
                {
                  label: "Safety and Security Concerns",
                  value: "Safety and Security Concerns",
                },
                {
                  label: "AOB - Please provide details in Issue Description",
                  value: "AOB - Please provide details in Issue Description",
                },
              ],
              onChange: (value: string) => {
                handleInputChange("processType", value);
              },
              onBlur: () => handleSaveOnBlur("processType"),
            },
          ]
        : []),
      {
        label: "Send Grievance To",
        type: "select",
        value: (() => {
          console.log(
            "Send Grievance To field value:",
            formData.sendGrievanceTo
          );
          // Return object format for HeaderMui component
          if (formData.sendGrievanceTo && formData.sendGrievanceTo !== "") {
            // Find the employee option that matches the selected value
            const selectedEmployee = employeeOptions.find(
              (emp) => emp.value === formData.sendGrievanceTo
            );
            if (selectedEmployee) {
              return selectedEmployee;
            }
          }
          return { label: "Select...", value: "" };
        })(),
        disabled: isFieldDisabled,
        id: "sendGrievanceTo",
        options: [{ label: "Select...", value: "" }, ...employeeOptions],
        onChange: (value: any) => {
          console.log("Send Grievance To onChange - received value:", value);
          handleInputChange("sendGrievanceTo", value);
        },
        onBlur: () => handleSaveOnBlur("sendGrievanceTo"),
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
        value: state.grievanceCase?.status || "Open",
        disabled: true,
        id: "docStatus",
      },
    ];

    return [basicFields];
  };

  return {
    state,
    formData,
    createGrievanceCase,
    updateGrievanceCase,
    getFormFields,
    handleInputChange,
    handleSaveOnBlur,
  };
};
