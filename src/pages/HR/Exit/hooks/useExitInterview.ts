import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../store/hook";
import { exitInterviewService } from "../../../../services/ExitInterviewService";
import {
  ExitInterviewFormData,
  ExitInterviewFormUpdate,
  ExitInterview,
} from "../../../../@types/exitInterview.dto";
import { getErrorMessage } from "../../../../utils/common";

type DocumentTypeMode = "add" | "edit" | "view" | "approval";

const initialFormData: ExitInterviewFormData = {
  date: new Date().toISOString().split("T")[0],
  employeeNo: "",
  employeeName: "",
  status: "Open",
  organizationUnitName: "",
  organizationUnit: "",
  jobTitle: "",
  supervisorNo: "",
  supervisorName: "",
  durationOfService: "",
  anotherPosition: false,
  personalReasons: false,
  relocation: false,
  returnToSchool: false,
  others: false,
  attendance: false,
  violationOfCompanyPolicy: false,
  layOff: false,
  reorganization: false,
  positionEliminated: false,
  otherInvoultary: false,
  primaryReasonForLeaving: "",
  mostSatisfyingAboutJob: "",
  mostFrustratingAboutJob: "",
  romCouldPreventLeaving: "",
  positionCompatibleWithSkills: "",
  possibilityForAdvancement: "",
  trainingDevelopmentOffered: "",
  greatestChallengeInPosition: "",
  suggestionsForImprovement: "",
  motivatedToReachPeakPerformance: "",
  relationshipWithTeamAndSupervisor: "",
  improveStaffMoraleRetention: "",
  workingConditionsSuitable: "",
  payComparedToWorkload: "",
  additionalComments: "",
  generalEmployeeComments: "",
  generalInterviewerComments: "",
};

export const useExitInterview = ({ mode }: { mode: DocumentTypeMode }) => {
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo, employeeName } = useAppSelector(
    (state) => state.auth.user
  );

  const [formData, setFormData] =
    useState<ExitInterviewFormData>(initialFormData);
  const [state, setState] = useState({
    isLoading: false,
    exitInterview: null as ExitInterview | null,
    etag: "",
  });

  const isFieldDisabled =
    mode === "approval" || state.exitInterview?.status === "Submitted";

  const handleInputChange = (
    field: keyof ExitInterviewFormData,
    value: string | boolean
  ) => {
    // Prevent changes if status is Submitted
    if (state.exitInterview?.status === "Submitted") {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const populateDocument = async (systemId?: string) => {
    if (mode === "add") {
      setFormData(initialFormData);
      return;
    }

    if (!systemId) {
      toast.error("System ID is required");
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await exitInterviewService.getExitInterview(
        companyId,
        systemId
      );
      setState((prev) => ({
        ...prev,
        exitInterview: response,
        etag: response["@odata.etag"],
      }));
      setFormData(response);
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const submitExitInterview = async () => {
    // Check for required fields
    if (!formData.date) {
      toast.error("Please fill all required fields");
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const payload: any = {
        date: formData.date,
        employeeNo: employeeNo || "",
        durationOfService: formData.durationOfService || "",
        anotherPosition: formData.anotherPosition,
        personalReasons: formData.personalReasons,
        relocation: formData.relocation,
        returnToSchool: formData.returnToSchool,
        others: formData.others,
        attendance: formData.attendance,
        violationOfCompanyPolicy: formData.violationOfCompanyPolicy,
        layOff: formData.layOff,
        reorganization: formData.reorganization,
        positionEliminated: formData.positionEliminated,
        otherInvoultary: formData.otherInvoultary,
        primaryReasonForLeaving: formData.primaryReasonForLeaving,
        mostSatisfyingAboutJob: formData.mostSatisfyingAboutJob,
        mostFrustratingAboutJob: formData.mostFrustratingAboutJob,
        romCouldPreventLeaving: formData.romCouldPreventLeaving,
        positionCompatibleWithSkills: formData.positionCompatibleWithSkills,
        possibilityForAdvancement: formData.possibilityForAdvancement,
        trainingDevelopmentOffered: formData.trainingDevelopmentOffered,
        greatestChallengeInPosition: formData.greatestChallengeInPosition,
        suggestionsForImprovement: formData.suggestionsForImprovement,
        motivatedToReachPeakPerformance:
          formData.motivatedToReachPeakPerformance,
        relationshipWithTeamAndSupervisor:
          formData.relationshipWithTeamAndSupervisor,
        improveStaffMoraleRetention: formData.improveStaffMoraleRetention,
        workingConditionsSuitable: formData.workingConditionsSuitable,
        payComparedToWorkload: formData.payComparedToWorkload,
        additionalComments: formData.additionalComments,
        generalEmployeeComments: formData.generalEmployeeComments,
        generalInterviewerComments: formData.generalInterviewerComments,
        // Only include organization unit fields if they have values to prevent API errors
        ...(formData.organizationUnitName &&
        formData.organizationUnitName.trim() !== ""
          ? { organizationUnitName: formData.organizationUnitName }
          : {}),
        ...(formData.organizationUnit && formData.organizationUnit.trim() !== ""
          ? { organizationUnit: formData.organizationUnit }
          : {}),
      };

      // Remove any potential organization unit code fields that might be empty
      // This prevents the "Organization Units does not exist. Code=''" error
      Object.keys(payload).forEach((key) => {
        if (
          key.toLowerCase().includes("organization") &&
          key.toLowerCase().includes("code")
        ) {
          if (!payload[key] || payload[key] === "") {
            delete payload[key];
          }
        }
      });

      const response = await exitInterviewService.createExitInterview(
        companyId,
        payload
      );
      toast.success("Exit interview created successfully");
      navigate(`/exit-interview-details/${response.data.systemId}`);
      return true;
    } catch (error) {
      toast.error(`Error creating exit interview: ${getErrorMessage(error)}`);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateExitInterview = async (systemId: string) => {
    // Prevent updates if status is Submitted
    if (state.exitInterview?.status === "Submitted") {
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const payload: ExitInterviewFormUpdate = {
        systemId: systemId,
        date: formData.date,
        durationOfService: formData.durationOfService || "",
        anotherPosition: formData.anotherPosition,
        personalReasons: formData.personalReasons,
        relocation: formData.relocation,
        returnToSchool: formData.returnToSchool,
        others: formData.others,
        attendance: formData.attendance,
        violationOfCompanyPolicy: formData.violationOfCompanyPolicy,
        layOff: formData.layOff,
        reorganization: formData.reorganization,
        positionEliminated: formData.positionEliminated,
        otherInvoultary: formData.otherInvoultary,
        primaryReasonForLeaving: formData.primaryReasonForLeaving,
        mostSatisfyingAboutJob: formData.mostSatisfyingAboutJob,
        mostFrustratingAboutJob: formData.mostFrustratingAboutJob,
        romCouldPreventLeaving: formData.romCouldPreventLeaving,
        positionCompatibleWithSkills: formData.positionCompatibleWithSkills,
        possibilityForAdvancement: formData.possibilityForAdvancement,
        trainingDevelopmentOffered: formData.trainingDevelopmentOffered,
        greatestChallengeInPosition: formData.greatestChallengeInPosition,
        suggestionsForImprovement: formData.suggestionsForImprovement,
        motivatedToReachPeakPerformance:
          formData.motivatedToReachPeakPerformance,
        relationshipWithTeamAndSupervisor:
          formData.relationshipWithTeamAndSupervisor,
        improveStaffMoraleRetention: formData.improveStaffMoraleRetention,
        workingConditionsSuitable: formData.workingConditionsSuitable,
        payComparedToWorkload: formData.payComparedToWorkload,
        additionalComments: formData.additionalComments,
        generalEmployeeComments: formData.generalEmployeeComments,
        generalInterviewerComments: formData.generalInterviewerComments,
      };

      const response = await exitInterviewService.updateExitInterview(
        companyId,
        payload,
        systemId,
        state.etag || "*"
      );

      // Update the etag after successful update
      if (response.data && response.data["@odata.etag"]) {
        setState((prev) => ({
          ...prev,
          etag: response.data["@odata.etag"],
        }));
      }

      toast.success("Exit interview updated successfully");
      return true;
    } catch (error) {
      toast.error(`Error updating exit interview: ${getErrorMessage(error)}`);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const deleteExitInterview = async (systemId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await exitInterviewService.deleteExitInterview(companyId, systemId);
      toast.success("Exit interview deleted successfully");
      navigate("/exit-interviews");
      return true;
    } catch (error) {
      toast.error(`Error deleting exit interview: ${getErrorMessage(error)}`);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const sendExitInterviewForApproval = async (
    documentNo: string,
    senderEmailAddress: string
  ) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await exitInterviewService.sendExitInterviewForApproval(companyId, {
        no: documentNo,
        senderEmailAddress,
      });
      toast.success("Exit interview sent for approval successfully");
      return true;
    } catch (error) {
      toast.error(`Error sending for approval: ${getErrorMessage(error)}`);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const cancelExitInterviewApproval = async (documentNo: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await exitInterviewService.cancelExitInterviewApproval(companyId, {
        no: documentNo,
      });
      toast.success("Exit interview approval cancelled successfully");
      return true;
    } catch (error) {
      toast.error(`Error cancelling approval: ${getErrorMessage(error)}`);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const validateRequiredFields = (
    setValidationErrors?: (errors: Set<string>) => void
  ) => {
    const requiredFields = [
      { field: "primaryReasonForLeaving", label: "Primary reason for leaving" },
      { field: "mostSatisfyingAboutJob", label: "Most satisfying about job" },
      { field: "mostFrustratingAboutJob", label: "Most frustrating about job" },
      { field: "romCouldPreventLeaving", label: "ROM could prevent leaving" },
      {
        field: "positionCompatibleWithSkills",
        label: "Position compatible with skills",
      },
      {
        field: "possibilityForAdvancement",
        label: "Possibility for advancement",
      },
      {
        field: "trainingDevelopmentOffered",
        label: "Training/development offered",
      },
      {
        field: "greatestChallengeInPosition",
        label: "Greatest challenge in position",
      },
      {
        field: "suggestionsForImprovement",
        label: "Suggestions for improvement",
      },
      {
        field: "motivatedToReachPeakPerformance",
        label: "Motivated to reach peak performance",
      },
      {
        field: "relationshipWithTeamAndSupervisor",
        label: "Relationship with team and supervisor",
      },
      {
        field: "improveStaffMoraleRetention",
        label: "Improve staff morale and retention",
      },
      {
        field: "workingConditionsSuitable",
        label: "Working conditions suitable",
      },
      {
        field: "payComparedToWorkload",
        label: "Pay compared to workload",
      },
      {
        field: "additionalComments",
        label: "Additional comments",
      },
    ];

    const emptyFields = requiredFields.filter(({ field }) => {
      const value = formData[field as keyof ExitInterviewFormData];
      return !value || (typeof value === "string" && value.trim() === "");
    });

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(({ label }) => label).join(", ");
      const emptyFieldNames = emptyFields.map(({ field }) => field);

      // Set validation errors for visual feedback
      if (setValidationErrors) {
        setValidationErrors(new Set(emptyFieldNames));
      }

      toast.error(
        `Please fill in the following required fields: ${fieldNames}`
      );
      return false;
    }

    return true;
  };

  const submitInterview = async (no: string) => {
    // Prevent submission if already submitted
    if (state.exitInterview?.status === "Submitted") {
      toast.info("Exit interview has already been submitted");
      return false;
    }

    // Validate required fields before submission
    if (!validateRequiredFields()) {
      return false;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await exitInterviewService.submitExitInterview(companyId, { no });
      toast.success("Exit interview submitted successfully");
      return true;
    } catch (error) {
      toast.error(`Error submitting exit interview: ${getErrorMessage(error)}`);
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const printExitInterview = async (systemId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      if (!formData.no) {
        toast.error("Exit Interview No is required for printing");
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const response = await exitInterviewService.printExitInterview(
        companyId,
        formData.no
      );

      if (response.data && response.data.value) {
        try {
          const base64String = response.data.value;

          // Validate base64 string
          if (base64String.length === 0) {
            throw new Error("Base64 string is empty");
          }

          // Check if it's valid base64
          try {
            atob(base64String);
          } catch (e) {
            throw new Error("Invalid base64 string");
          }

          const byteCharacters = atob(base64String);

          // Check if it's actually a PDF (should start with %PDF)
          if (
            byteCharacters.length < 4 ||
            byteCharacters.substring(0, 4) !== "%PDF"
          ) {
            console.warn("Warning: Data doesn't start with PDF signature");
          }

          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `exit_interview_${formData.no || systemId}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);

          toast.success("Exit Interview downloaded successfully");
        } catch (error) {
          console.error("Error converting PDF:", error);
          toast.error("Failed to convert PDF response");
        }
      } else {
        console.error("No value in response data:", response.data);
        toast.error("No PDF data received from server");
      }
    } catch (error) {
      console.error("Error printing Exit Interview:", error);
      toast.error(`Error printing Exit Interview: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const getFormFields = () => {
    const basicFields = [
      {
        label: "Employee No",
        type: "text",
        value: employeeNo || "",
        disabled: true,
        id: "employeeNo",
      },
      {
        label: "Employee Name",
        type: "text",
        value: employeeName || "",
        disabled: true,
        id: "employeeName",
      },
      {
        label: "Job Title",
        type: "text",
        value: formData.jobTitle || "",
        disabled: true,
        id: "jobTitle",
      },
      {
        label: "Duration of Service",
        type: "text",
        value: formData.durationOfService || "",
        disabled: true,
        id: "durationOfService",
      },
      {
        label: "Interview Date",
        type: "date",
        value: formData.date || "",
        id: "interviewDate",
        disabled: isFieldDisabled,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange("date", e.target.value);
        },
        required: true,
      },
      {
        label: "Status",
        type: "text",
        value: state.exitInterview?.status || "",
        disabled: true,
        id: "docStatus",
      },
    ];

    return [basicFields];
  };

  return {
    formData,
    setFormData,
    state,
    populateDocument,
    submitExitInterview,
    submitInterview,
    updateExitInterview,
    deleteExitInterview,
    sendExitInterviewForApproval,
    cancelExitInterviewApproval,
    getFormFields,
    handleInputChange,
    isFieldDisabled,
    validateRequiredFields,
    printExitInterview,
  };
};
