import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../store/hook";
import { exitClearanceService } from "../../../../services/ExitClearanceService";
import { exitClearanceOrgPropertyService } from "../../../../services/ExitClearanceOrgPropertyService";
import {
  ExitClearance,
  ExitClearanceFormData,
  ExitClearanceFormUpdate,
} from "../../../../@types/exitClearance.dto";
import { ExitClearanceOrgProperty } from "../../../../@types/exitClearanceOrgProperty.dto";
import { getErrorMessage } from "../../../../utils/common";
import { apiEmployees } from "../../../../services/CommonServices";
import { faLocationsService } from "../../../../services/FALocationsService";
import Swal from "sweetalert2";

type DocumentTypeMode = "add" | "edit" | "view" | "approve";

interface UseExitClearanceProps {
  mode: DocumentTypeMode;
  systemId?: string;
}

export const useExitClearance = ({ mode, systemId }: UseExitClearanceProps) => {
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo, employeeName } = useAppSelector(
    (state) => state.auth.user
  );

  const [state, setState] = useState<{
    isLoading: boolean;
    exitClearance: ExitClearance | null;
    error: string | null;
  }>({
    isLoading: false,
    exitClearance: null,
    error: null,
  });

  const [orgProperties, setOrgProperties] = useState<
    ExitClearanceOrgProperty[]
  >([]);

  const [locationOptions, setLocationOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [formData, setFormData] = useState<ExitClearanceFormData>({
    no: "",
    employeeNo: employeeNo || "",
    employeeName: employeeName || "",
    status: "Open",
    organizationUnitName: "",
    date: new Date().toISOString().split("T")[0],
    employmentDate: "",
    endDateOfServices: "",
    exitType: "",
    handoverDate: new Date().toISOString().split("T")[0],
    operationalSite: "",
    timeSheetForTheLastPeriod: "",
    informationRequiringPasswords: "",
    pendingActivitiesAndFuturePlan: "",
    officialDocumentsHandedIn: "",
    handoverReportSubmitted: "",
    housingLoan: "",
    personalLoan: "",
    hasLoan: false,
    loanAmount: "",
    hasSalaryAdvance: false,
    salaryAdvanceAmount: "",
    outstandingAccountabilities: "",
    interestAdjusted: "",
    takoverCommitmentEmployer: "",
    commitmentFrmAnother: "",
    payOutright: "",
    creditRiskManager: "",
    financeManager: "",
    financeManagerName: "",
    ictEquipReturned: "",
    deletionEmail: "",
    allSystemLoginDeleted: "",
    biometricAccessDeactivated: "",
    anyOtherSpecify: "",
    identityCard: "",
    medicalCard: "",
    resignationAcceptance: "",
    otherStrategy: "",
    hrOfficerNo: "",
    hrOfficerName: "",
    // Additional fields from the API
    admin: "",
    adminName: "",
    adminStage: "",
    supervisorVerification: "",
    // Head of Department fields
    headOfDepartmentNo: "",
    headOfDepartmentName: "",
    headOfDepartmentStage: "",
    headOfDepartmentComments: "",
    // HR Manager fields
    hrManagerNo: "",
    hrManagerName: "",
    hrManagerStage: "",
    hrManagerFinalComments: "",
  });

  const isFieldDisabled =
    mode === "view" ||
    mode === "approve" ||
    formData.status === "Pending Approval" ||
    formData.status === "Approved";

  useEffect(() => {
    if (mode === "edit" || mode === "view" || mode === "approve") {
      if (systemId) {
        populateDocumentDetail(systemId);
      }
    }
    if (mode === "add") {
      populateEmployeeData();
    }
    // Fetch locations for all modes
    populateLocationData();
  }, [mode, systemId]);

  const populateLocationData = async () => {
    try {
      const locations = await faLocationsService.getFALocations(companyId);
      const locationOpts = locations.map((location) => ({
        label: `${location.code} - ${location.name}`,
        value: location.code,
      }));
      setLocationOptions(locationOpts);
    } catch (error) {
      toast.error(`Error loading FA Locations: ${getErrorMessage(error)}`);
    }
  };

  const populateEmployeeData = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const filterQuery = `$filter=No eq '${employeeNo}'`;
      const response = await apiEmployees(companyId, filterQuery);

      if (response.data.value.length > 0) {
        const employee = response.data.value[0];
        setFormData((prev) => ({
          ...prev,
          positionCode: employee.Position || "",
          positionName: employee.JobTitle || "",
          orgarnizationUnit: employee.Org_Unit || "",
          organizationUnitName: employee.Org_Unit || "",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
      }));
      toast.error(`Error loading employee data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const populateDocumentDetail = async (systemId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const data = await exitClearanceService.getExitClearance(
        companyId,
        systemId
      );

      setState((prev) => ({ ...prev, exitClearance: data }));

      // Set organizational properties if they exist in the expanded data
      if (data.exitClearanceOrgProperties) {
        // Convert handover field from string to boolean if needed
        const processedOrgProperties = data.exitClearanceOrgProperties.map(
          (property) => ({
            ...property,
            handover:
              typeof property.handover === "string"
                ? property.handover === "Yes" || property.handover === "true"
                : property.handover,
          })
        );
        setOrgProperties(processedOrgProperties);
      }

      // Helper function to convert boolean to YES/NO string
      const booleanToString = (value: any): string => {
        console.log("booleanToString called with:", {
          value,
          type: typeof value,
        });
        if (value === true) return "YES";
        if (value === false) return "NO";
        console.log("booleanToString returning original value:", value);
        return value || "";
      };

      // Map API response to form data
      setFormData({
        no: data.no,
        employeeNo: data.employeeNo,
        employeeName: data.employeeName,
        date: data.date,
        employmentDate: data.employmentDate || data.date, // Use employmentDate from API or fallback to date
        status: data.status,
        approvalDocumentType: data.approvalDocumentType,
        orgarnizationUnit: data.orgarnizationUnit,
        organizationUnitName: data.organizationUnitName,
        positionCode: data.positionCode,
        positionName: data.positionName,
        endDateOfServices: data.endDateOfServices,
        exitType: data.exitType,
        handoverDate:
          data.handoverDate && data.handoverDate !== "0001-01-01"
            ? data.handoverDate
            : "",
        operationalSite: data.operationalSite,
        timeSheetForTheLastPeriod: booleanToString(
          data.timeSheetForTheLastPeriod
        ),
        informationRequiringPasswords: data.informationRequiringPasswords,
        pendingActivitiesAndFuturePlan: data.pendingActivitiesAndFuturePlan,
        shortcutDimension1Code: data.shortcutDimension1Code,
        shortcutDimension2Code: data.shortcutDimension2Code,
        departmentCode: data.departmentCode,
        officialDocumentsHandedIn: booleanToString(
          data.officialDocumentsHandedIn
        ),
        handoverReportSubmitted: booleanToString(data.handoverReportSubmitted),
        supervisorNo: data.supervisorNo,
        supervisorName: data.supervisorName,
        housingLoan: data.housingLoan,
        personalLoan: data.personalLoan,
        hasLoan: data.hasLoan,
        hasSalaryAdvance: data.hasSalaryAdvance,
        salaryAdvanceAmount: data.salaryAdvanceAmount,
        loanAmount: data.loanAmount,
        outstandingAccountabilities: data.outstandingAccountabilities,
        interestAdjusted: booleanToString(data.interestAdjusted),
        takoverCommitmentEmployer: booleanToString(
          data.takoverCommitmentEmployer
        ),
        commitmentFrmAnother: booleanToString(data.commitmentFrmAnother),
        payOutright: booleanToString(data.payOutright),
        creditRiskManager: data.creditRiskManager,
        financeManager: data.financeManager,
        financeManagerName: data.financeManagerName,
        ictEquipReturned: booleanToString(data.ictEquipReturned),
        deletionEmail: booleanToString(data.deletionEmail),
        allSystemLoginDeleted: booleanToString(data.allSystemLoginDeleted),
        biometricAccessDeactivated: booleanToString(
          data.biometricAccessDeactivated
        ),
        anyOtherSpecify: data.anyOtherSpecify,
        ictManagerNo: data.ictManagerNo,
        ictManagerName: data.ictManagerName,
        identityCard: booleanToString(data.identityCard),
        medicalCard: booleanToString(data.medicalCard),
        resignationAcceptance: booleanToString(data.resignationAcceptance),
        computationSheet: data.computationSheet,
        otherStrategy: data.otherStrategy,
        supervisorStage: data.supervisorStage,
        financeStage: data.financeStage,
        ictStage: data.ictStage,
        creditStage: data.creditStage,
        hrOfficerStage: data.hrOfficerStage,
        adminStage: data.adminStage,
        hrOfficerNo: data.hrOfficerNo,
        hrOfficerName: data.hrOfficerName,
        // Additional fields from the API
        admin: data.admin || "",
        adminName: data.adminName || "",
        supervisorVerification: (() => {
          console.log("API supervisorVerification data:", {
            value: data.supervisorVerification,
            type: typeof data.supervisorVerification,
          });
          return booleanToString(data.supervisorVerification);
        })(),
        // Head of Department fields
        headOfDepartmentNo: data.headOfDepartmentNo || "",
        headOfDepartmentName: data.headOfDepartmentName || "",
        headOfDepartmentStage: data.headOfDepartmentStage || "",
        headOfDepartmentComments: data.headOfDepartmentComments || "",
        // HR Manager fields
        hrManagerNo: data.hrManagerNo || "",
        hrManagerName: data.hrManagerName || "",
        hrManagerStage: data.hrManagerStage || "",
        hrManagerFinalComments: data.hrManagerFinalComments || "",
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
      }));
      toast.error(`Error loading Exit Clearance: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleInputChange = (
    field: keyof ExitClearanceFormData,
    value: any
  ) => {
    console.log(
      `DEBUG - handleInputChange called for ${field} with value:`,
      value
    );
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log(`DEBUG - Updated formData for ${field}:`, newData[field]);
      return newData;
    });
  };

  const cleanFormDataForSubmission = (data: ExitClearanceFormData) => {
    const cleanedData = { ...data };

    // Remove read-only fields that should not be sent to the API
    delete (cleanedData as any).employmentDate; // This field is populated from API and is read-only

    // Fields that might be numeric in the backend but are defined as strings in the interface
    const potentialNumericFields = [
      "housingLoan",
      "personalLoan",
      "vehicleLoan",
      "advances",
      "interestAdjusted",
      "takoverCommitmentEmployer",
      "commitmentFrmAnother",
      "payOutright",
    ];

    // Fields that are boolean in the backend but are sent as YES/NO strings
    const booleanFields = [
      "officialDocumentsHandedIn",
      "handoverReportSubmitted",
      "interestAdjusted",
      "takoverCommitmentEmployer",
      "commitmentFrmAnother",
      "payOutright",
      "ictEquipReturned",
      "deletionEmail",
      "allSystemLoginDeleted",
      "biometricAccessDeactivated",
      "identityCard",
      "medicalCard",
      "resignationAcceptance",
      "timeSheetForTheLastPeriod",
      "supervisorVerification",
    ];

    // Fields that are read-only and should be excluded from create payload
    const readOnlyFields = [
      "no",
      "employeeName",
      "status",
      "orgarnizationUnit",
      "organizationUnitName",
      "positionCode",
      "positionName",
      "approvalDocumentType",
      "shortcutDimension1Code",
      "shortcutDimension2Code",
      "departmentCode",
      "supervisorNo",
      "supervisorName",
      "creditRiskManager",
      "ictManagerNo",
      "computationSheet",
      "otherStrategy",
      "supervisorStage",
      "financeStage",
      "ictStage",
      "creditStage",
      "hrOfficerStage",
      "hrOfficerNo",
      "hrOfficerName",
      "financeManager",
      "financeManagerName",
      "admin",
      "adminName",
      "headOfDepartmentNo",
      "headOfDepartmentName",
      "headOfDepartmentStage",
      "hrManagerNo",
      "hrManagerName",
      "hrManagerStage",
      "hasLoan",
      "hasSalaryAdvance",
      "loanAmount",
      "salaryAdvanceAmount",
    ];

    // Remove read-only fields from the payload
    readOnlyFields.forEach((field) => {
      delete (cleanedData as any)[field];
    });

    // Convert empty strings to null for optional fields and handle potential numeric fields
    Object.keys(cleanedData).forEach((key) => {
      const value = cleanedData[key as keyof ExitClearanceFormData];

      if (value === "") {
        (cleanedData as any)[key] = null;
      } else if (
        potentialNumericFields.includes(key) &&
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        // Try to convert to number if it's a potential numeric field
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          (cleanedData as any)[key] = numValue;
        }
      } else if (
        booleanFields.includes(key) &&
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        // Convert YES/NO strings to boolean values
        if (value === "YES") {
          (cleanedData as any)[key] = true;
        } else if (value === "NO") {
          (cleanedData as any)[key] = false;
        }
      } else if (booleanFields.includes(key) && typeof value === "boolean") {
        // Keep boolean values as they are
        (cleanedData as any)[key] = value;
      }
    });

    // Special handling for date fields to ensure they're properly formatted for the backend
    // Date fields should be null if empty, not empty strings
    const dateFields = ["handoverDate", "date", "endDateOfServices"];
    dateFields.forEach((field) => {
      const value = cleanedData[field as keyof ExitClearanceFormData];
      if (value === "" || value === null || value === undefined) {
        (cleanedData as any)[field] = null;
      }
    });

    return cleanedData;
  };

  const createExitClearance = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Add a small delay to ensure form data is current
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Validate required fields before submission
      const requiredFields = [
        { field: "employeeNo", label: "Employee No" },
        { field: "endDateOfServices", label: "End of services with ROM" },
        { field: "handoverDate", label: "Handover Date" },
        { field: "exitType", label: "Exit Type" },
        { field: "operationalSite", label: "Operational Site" },
      ];

      const missingFields = requiredFields.filter(({ field }) => {
        let value = formData[field as keyof ExitClearanceFormData];

        // Debug: Log the value for endDateOfServices specifically
        if (field === "endDateOfServices") {
          console.log(
            `DEBUG - endDateOfServices value:`,
            value,
            "Type:",
            typeof value
          );
          console.log(
            `DEBUG - formData.endDateOfServices:`,
            formData.endDateOfServices
          );
        }

        const isEmpty =
          !value || value === "" || value === null || value === undefined;
        return isEmpty;
      });

      if (missingFields.length > 0) {
        const missingFieldLabels = missingFields
          .map(({ label }) => label)
          .join(", ");
        toast.error(
          `Please fill in the following required fields: ${missingFieldLabels}`
        );
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const cleanedData = cleanFormDataForSubmission(formData);

      const response = await exitClearanceService.createExitClearance(
        companyId,
        cleanedData
      );
      toast.success("Exit Clearance created successfully");
      navigate(`/exit-clearance-details/${response.data.systemId}`);
      return response.data;
    } catch (error) {
      console.error("Exit Clearance creation error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(`Error creating Exit Clearance: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateExitClearance = async () => {
    if (!state.exitClearance) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const cleanedData = cleanFormDataForSubmission(formData);
      const updateData: ExitClearanceFormUpdate = {
        ...cleanedData,
        systemId: state.exitClearance.systemId,
      };

      const response = await exitClearanceService.updateExitClearance(
        companyId,
        updateData,
        state.exitClearance.systemId,
        state.exitClearance["@odata.etag"]
      );

      setState((prev) => ({ ...prev, exitClearance: response.data }));
      toast.success("Exit Clearance updated successfully");
      return response.data;
    } catch (error) {
      toast.error(`Error updating Exit Clearance: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const deleteExitClearance = async () => {
    if (!state.exitClearance) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await exitClearanceService.deleteExitClearance(
        companyId,
        state.exitClearance.systemId
      );
      toast.success("Exit Clearance deleted successfully");
      navigate("/exit-clearance-form");
    } catch (error) {
      toast.error(`Error deleting Exit Clearance: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const sendForApproval = async () => {
    if (!state.exitClearance) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await exitClearanceService.sendExitClearanceForApproval(companyId, {
        no: state.exitClearance.no,
        senderEmailAddress: "", // This should be populated with actual email
      });
      toast.success("Exit Clearance sent for approval successfully");
      await populateDocumentDetail(state.exitClearance.systemId);
    } catch (error) {
      toast.error(`Error sending for approval: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const cancelApproval = async () => {
    if (!state.exitClearance) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await exitClearanceService.cancelExitClearanceApproval(companyId, {
        no: state.exitClearance.no,
      });
      toast.success("Approval request cancelled successfully");
      await populateDocumentDetail(state.exitClearance.systemId);
    } catch (error) {
      toast.error(`Error cancelling approval: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const submitHandover = async (no: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to submit this Exit Clearance?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, submit it!",
        cancelButtonText: "No, cancel!",
      });
      if (result.isConfirmed) {
        setState((prev) => ({ ...prev, isLoading: true }));
        await exitClearanceService.submitExitClearance(companyId, { no });
        toast.success("Exit Clearance submitted successfully");
        return true;
      }
    } catch (error) {
      toast.error(`Error submitting Exit Clearance: ${getErrorMessage(error)}`);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSaveOnBlur = async (
    fieldName?: string | React.FocusEvent<HTMLInputElement>,
    newValue?: any
  ) => {
    if (mode === "edit" || mode === "approve" || mode === "view") {
      try {
        // If a specific field is provided, only update that field
        let updateData: any = { systemId: state.exitClearance!.systemId };

        // Handle both string fieldName and FocusEvent
        let actualFieldName: string | undefined;
        if (typeof fieldName === "string") {
          actualFieldName = fieldName;
        } else if (fieldName && "target" in fieldName) {
          // Extract field name from the input element's id
          actualFieldName = (fieldName.target as HTMLInputElement).id;
        }

        if (actualFieldName) {
          // Only update the specific field that was changed
          // Use the new value if provided, otherwise get from form data
          const fieldValue =
            newValue !== undefined
              ? newValue
              : formData[actualFieldName as keyof ExitClearanceFormData];
          console.log(
            `handleSaveOnBlur - Updating field ${actualFieldName} with value:`,
            fieldValue
          );
          console.log(
            `handleSaveOnBlur - Using newValue: ${
              newValue !== undefined
            }, formData value: ${
              formData[actualFieldName as keyof ExitClearanceFormData]
            }`
          );
          console.log("handleSaveOnBlur - Field details:", {
            actualFieldName,
            newValue,
            formDataValue:
              formData[actualFieldName as keyof ExitClearanceFormData],
            finalFieldValue: fieldValue,
          });

          // Handle special cases for different field types
          if (
            actualFieldName === "handoverDate" ||
            actualFieldName === "date" ||
            actualFieldName === "endDateOfServices"
          ) {
            const finalValue = fieldValue || null;
            updateData[actualFieldName] = finalValue;
          } else if (
            [
              "officialDocumentsHandedIn",
              "handoverReportSubmitted",
              "interestAdjusted",
              "takoverCommitmentEmployer",
              "commitmentFrmAnother",
              "payOutright",
              "ictEquipReturned",
              "deletionEmail",
              "allSystemLoginDeleted",
              "biometricAccessDeactivated",
              "identityCard",
              "medicalCard",
              "resignationAcceptance",
              "timeSheetForTheLastPeriod",
              "supervisorVerification",
            ].includes(actualFieldName)
          ) {
            // Handle boolean fields - support both boolean and string values
            if (typeof fieldValue === "boolean") {
              updateData[actualFieldName] = fieldValue;
            } else {
              const convertedValue =
                fieldValue === "YES"
                  ? true
                  : fieldValue === "NO"
                  ? false
                  : null;
              console.log(`Boolean conversion for ${actualFieldName}:`, {
                fieldValue,
                type: typeof fieldValue,
                convertedValue,
              });
              updateData[actualFieldName] = convertedValue;
            }
          } else {
            updateData[actualFieldName] = fieldValue;
          }
        } else {
          // Fallback to updating all fields (original behavior)
          const cleanedData = cleanFormDataForSubmission(formData);
          updateData = {
            ...cleanedData,
            systemId: state.exitClearance!.systemId,
          };
        }

        const response = await exitClearanceService.updateExitClearance(
          companyId,
          updateData,
          state.exitClearance!.systemId,
          state.exitClearance!["@odata.etag"]
        );

        // Update only the etag to prevent full reload
        setState((prev) => ({
          ...prev,
          exitClearance: {
            ...prev.exitClearance!,
            "@odata.etag": response.data["@odata.etag"],
          },
        }));

        console.log("Field updated successfully");

        // Create a mapping for user-friendly field names
        const fieldLabels: { [key: string]: string } = {
          endDateOfServices: "End of services with ROM",
          exitType: "Exit Type",
          handoverDate: "Handover Date",
          operationalSite: "Operational Site",
          date: "Date",
          organizationUnitName: "Organization Unit Name",
          identityCard: "Identity Card",
          medicalCard: "Health Insurance card",
          timeSheetForTheLastPeriod: "Time sheet for the last period",
          informationRequiringPasswords: "Information Requiring Passwords",
          pendingActivitiesAndFuturePlan: "Pending Activities and Future Plan",
          loan: "Loan",
          advances: "Salary Advances",
          outstandingAccountabilities: "Outstanding Accountabilities",
        };

        const fieldLabel = actualFieldName
          ? fieldLabels[actualFieldName] || actualFieldName
          : "Field";
        toast.success(`${fieldLabel} updated successfully`);
      } catch (error) {
        console.error("handleSaveOnBlur - Error:", error);
        toast.error(`Error updating field: ${getErrorMessage(error)}`);
      }
    }
  };

  const getFormFields = () => {
    const basicFields = [
      {
        label: "No",
        type: "text",
        value: state.exitClearance?.no || "",
        disabled: true,
        id: "no",
      },
      {
        label: "Employee No",
        type: "text",
        value: formData.employeeNo || "",
        disabled: true,
        id: "employeeNo",
      },
      {
        label: "Employee Name",
        type: "text",
        value: formData.employeeName || "",
        disabled: true,
        id: "employeeName",
      },
      // Only show "1st Appointment in ROM" field on details page (not add mode)
      ...(mode !== "add" && formData.employmentDate
        ? [
            {
              label: "1st Appointment in ROM",
              type: "date",
              value: formData.employmentDate || "",
              disabled: true, // This field is populated from API and not editable
              id: "employmentDate",
              onChange: (_: Date[], dateStr: string) => {
                handleInputChange("employmentDate", dateStr);
                handleSaveOnBlur("employmentDate", dateStr);
              },
            },
          ]
        : []),
      {
        label: "Status",
        type: "text",
        value: state.exitClearance?.status || "Open",
        disabled: true,
        id: "docStatus",
      },

      {
        label: "Organization Unit Name",
        type: "text",
        value:
          state.exitClearance?.organizationUnitName ||
          formData.organizationUnitName,
        disabled: isFieldDisabled,
        id: "organizationUnitName",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange("organizationUnitName", e.target.value);
        },
        onBlur: () => handleSaveOnBlur("organizationUnitName"),
      },
      {
        label: "End of services with ROM *",
        type: "date",
        value: formData.endDateOfServices || "",
        id: "endDateOfServices",
        disabled: isFieldDisabled,
        onChange: (_: Date[], dateStr: string) => {
          handleInputChange("endDateOfServices", dateStr);
          handleSaveOnBlur("endDateOfServices", dateStr);
        },
        required: true,
      },
      {
        label: "Exit Type *",
        type: "select",
        value: formData.exitType
          ? { label: formData.exitType, value: formData.exitType }
          : null,
        id: "exitType",
        disabled: isFieldDisabled,
        onChange: (selectedOption: any) => {
          const newValue = selectedOption?.value || "";
          handleInputChange("exitType", newValue);
        },
        onBlur: () => {
          // For select fields, we'll use a timeout to ensure the state has updated
          setTimeout(() => {
            handleSaveOnBlur("exitType", formData.exitType);
          }, 0);
        },
        options: [
          { label: "Resignation", value: "Resignation" },
          { label: "Termination", value: "Termination" },
          { label: "Retirement", value: "Retirement" },
          { label: "Retrenchment", value: "Retrenchment" },
          { label: "Dismissal", value: "Dismissal" },
          { label: "NonRenewal", value: "NonRenewal" },
        ],
        required: true,
      },
      {
        label: "Handover Date *",
        type: "date",
        value: formData.handoverDate || "",
        id: "handoverDate",
        disabled: isFieldDisabled,
        onChange: (_: Date[], dateStr: string) => {
          handleInputChange("handoverDate", dateStr);
          handleSaveOnBlur("handoverDate", dateStr);
        },
        required: true,
      },
      {
        label: "Operational Site *",
        type: "select",
        value: formData.operationalSite
          ? locationOptions.find(
              (opt) => opt.value === formData.operationalSite
            ) || null
          : null,
        id: "operationalSite",
        disabled: isFieldDisabled,
        onChange: (selectedOption: any) => {
          handleInputChange("operationalSite", selectedOption?.value || "");
        },
        onBlur: () => handleSaveOnBlur("operationalSite"),
        options: locationOptions,
        required: true,
      },
    ];

    return [basicFields];
  };

  // Organizational Property functions
  const createOrgProperty = async (data: any) => {
    try {
      const response =
        await exitClearanceOrgPropertyService.createExitClearanceOrgProperty(
          companyId,
          data
        );
      toast.success("Organizational property added successfully");
      // Refresh the document to get updated data
      if (systemId) {
        await populateDocumentDetail(systemId);
      }
      return response;
    } catch (error) {
      toast.error(
        `Error adding organizational property: ${getErrorMessage(error)}`
      );
      throw error;
    }
  };

  const updateOrgProperty = async (
    systemId: string,
    data: any,
    etag: string
  ) => {
    try {
      const response =
        await exitClearanceOrgPropertyService.updateExitClearanceOrgProperty(
          companyId,
          data,
          systemId,
          etag
        );
      toast.success("Organizational property updated successfully");
      // // Refresh the document to get updated data
      // if (systemId) {
      //   await populateDocumentDetail(systemId);
      // }
      return response;
    } catch (error) {
      toast.error(
        `Error updating organizational property: ${getErrorMessage(error)}`
      );
      throw error;
    }
  };

  const deleteOrgProperty = async (systemId: string) => {
    try {
      await exitClearanceOrgPropertyService.deleteExitClearanceOrgProperty(
        companyId,
        systemId
      );
      toast.success("Organizational property deleted successfully");
      // Refresh the document to get updated data
      if (systemId) {
        await populateDocumentDetail(systemId);
      }
    } catch (error) {
      toast.error(
        `Error deleting organizational property: ${getErrorMessage(error)}`
      );
      throw error;
    }
  };

  // Update local org properties state
  const updateLocalOrgProperty = (propertyCode: string, handover: boolean) => {
    setOrgProperties((prev) =>
      prev.map((property) =>
        property.propertyCode === propertyCode
          ? { ...property, handover }
          : property
      )
    );
  };

  return {
    state,
    formData,
    setFormData,
    handleInputChange,
    createExitClearance,
    updateExitClearance,
    deleteExitClearance,
    sendForApproval,
    cancelApproval,
    submitHandover,
    handleSaveOnBlur,
    getFormFields,
    isFieldDisabled,
    locationOptions,
    // Organizational Property functions
    orgProperties,
    createOrgProperty,
    updateOrgProperty,
    deleteOrgProperty,
    updateLocalOrgProperty,
  };
};
