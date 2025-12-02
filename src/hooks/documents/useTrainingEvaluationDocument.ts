import { useState, useCallback } from "react";
import { trainingEvaluationService } from "../../services/TrainingEvaluationService";
import { TrainingEvaluationFormData } from "../../@types/trainingEvaluation.dto";
import { useAppSelector } from "../../store/hook";
import { quickUpdate } from "../../helpers/quickUpdate";
import { toast } from "react-toastify";

export interface TrainingEvaluationDocumentState {
  isLoading: boolean;
  trainingEvaluations: any[];
  isSubmitting: boolean;
  // Section visibility states
  showCourseContent: boolean;
  showTrainerEvaluation: boolean;
  showFacilities: boolean;
  showOverallReview: boolean;
}

export const useTrainingEvaluationDocument = ({
  mode,
}: {
  mode: "add" | "detail";
}) => {
  const { companyId } = useAppSelector((state) => state.auth.session);

  const [formData, setFormData] = useState<TrainingEvaluationFormData>({
    systemId: "",
    no: "",
    employeeNo: "",
    employeeName: "",
    trainingType: "",
    trainingPlan: "",
    actualStartDate: "",
    actualEndDate: "",
    expectedEvaluationDate: "",
    status: "Open",
    qualityAndEfficiencyOfContent: "",
    qualityAndEfficiencyOfVisualAids: "",
    appropriatenessAndEfficiencyOfPracticalSessions: "",
    extentOfBalanceBetweenTheoreticalAndPracticalPartsOfTheCourse: "",
    amountOfTimeSpentOnEachSkillAndModule: "",
    participantInvolvementAndPeerFeedback: "",
    overallLengthAndPaceOfTheClass: "",
    logicalSequenceOfTheCourse: "",
    relevanceOfTheCourseToMyJobFunction: "",
    overallCourseContentRating: "",
    trainerExplainedOutcomesOfCourse: "",
    trainerShowedContentMasteryKnowledgeOfMaterial: "",
    trainerExplainedMaterialAndGiveInstructions: "",
    trainerUsedTimeEffectively: "",
    trainerQuestionedParticipantsToStimulateDiscussionAndVerifyLearning: "",
    trainerMadeEffectiveUseOfLearningAidsToEnhanceLearning: "",
    trainerHandledAllOutstandingIssuesEffectively: "",
    overallRatingOfTrainer: "",
    comfortOfTheTrainingFacility: "",
    convenienceOfTrainingLocation: "",
    qualityOfRefreshmentsProvided: "",
    generalComments: "",
    generalComments2: "",
    overallTrainingRating: "",
    "@odata.etag": "",
  });

  const [state, setState] = useState<TrainingEvaluationDocumentState>({
    isLoading: false,
    trainingEvaluations: [],
    isSubmitting: false,
    showCourseContent: true,
    showTrainerEvaluation: true,
    showFacilities: true,
    showOverallReview: true,
  });

  // Handle input changes
  const handleInputChange = useCallback(
    (field: keyof TrainingEvaluationFormData, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Handle field updates
  // Handle field updates with auto-save
  const handleFieldUpdate = useCallback(
    async (field: keyof TrainingEvaluationFormData, value: any) => {
      // Update local state immediately
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Auto-save if we're in detail mode and have a systemId
      if (mode === "detail" && formData.systemId) {
        try {
          // Create a wrapper function that matches the expected signature
          const updateWrapper = async (
            companyId: string,
            _method: "PATCH",
            data: any,
            id: string,
            etag: string
          ) => {
            return trainingEvaluationService.updateTrainingEvaluation(
              companyId,
              id,
              data,
              etag
            );
          };

          await quickUpdate({
            companyId,
            id: formData.systemId,
            apiService: updateWrapper,
            data: { [field]: value },
            successMessage: `${field} updated successfully`,
            errorMessage: `Error updating ${field}`,
            onSucesss: () => {
              // Optionally refresh the document data
              // populateDocument(formData.systemId);
            },
            onError: (error) => {
              console.error(`Error auto-saving ${field}:`, error);
            },
          });
        } catch (error) {
          console.error(`Error auto-saving ${field}:`, error);
          toast.error(`Error saving ${field}`);
        }
      }
    },
    [mode, formData.systemId, companyId]
  );

  // Populate document data
  const populateDocument = useCallback(
    async (id?: string) => {
      if (mode === "detail" && id) {
        setState((prev) => ({ ...prev, isLoading: true }));
        try {
          const response =
            await trainingEvaluationService.getTrainingEvaluation(
              companyId,
              id
            );
          setFormData({
            ...response,
            no: String(response.no || ""),
          });
        } catch (error) {
          console.error("Error fetching training evaluation:", error);
        } finally {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    },
    [mode, companyId]
  );

  // Create training evaluation
  const createTrainingEvaluation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await trainingEvaluationService.createTrainingEvaluation(
        companyId,
        formData
      );
      return response;
    } catch (error) {
      console.error("Error creating training evaluation:", error);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [formData]);

  // Update training evaluation
  const updateTrainingEvaluation = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      if (!formData.systemId) {
        throw new Error("System ID is required for update");
      }
      const response = await trainingEvaluationService.updateTrainingEvaluation(
        companyId,
        formData.systemId,
        formData
      );
      return response;
    } catch (error) {
      console.error("Error updating training evaluation:", error);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [formData]);

  // Submit evaluation to HOD
  const submitEvaluationToHOD = useCallback(async () => {
    setState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      // Basic validation before submission
      if (!formData.no) {
        throw new Error("Document Number is required for submission");
      }
      if (!formData.employeeNo) {
        throw new Error("Employee Number is required for submission");
      }
      if (!formData.trainingPlan) {
        throw new Error("Training Plan is required for submission");
      }

      const noValue = String(formData.no);
      console.log(
        "Submitting with no value:",
        noValue,
        "Type:",
        typeof noValue
      );

      const response = await trainingEvaluationService.submitEvaluationToHOD(
        companyId,
        { no: noValue }
      );
      // Update the status to indicate submission
      setFormData((prev) => ({ ...prev, status: "Submitted" }));
      toast.success("Training evaluation submitted to HOD successfully!");
      return response;
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error("Failed to submit training evaluation to HOD");
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [formData.no, formData.employeeNo, formData.trainingPlan, companyId]);

  // Get form fields for HeaderMui
  const getFormFields = useCallback(() => {
    const basicFields = [
      {
        name: "employeeNo",
        label: "Employee No.",
        type: "text",
        value: formData.employeeNo,
        onChange: (value: any) => handleInputChange("employeeNo", value),
        required: true,
        disabled: mode === "detail",
      },
      {
        name: "employeeName",
        label: "Employee Name",
        type: "text",
        value: formData.employeeName,
        onChange: (value: any) => handleInputChange("employeeName", value),
        required: true,
        disabled: mode === "detail",
      },
      {
        name: "trainingType",
        label: "Training Type",
        type: "text",
        value: formData.trainingType,
        onChange: (value: any) => handleInputChange("trainingType", value),
        required: true,
        disabled: mode === "detail",
      },
      {
        name: "trainingPlan",
        label: "Training Plan",
        type: "text",
        value: formData.trainingPlan,
        onChange: (value: any) => handleInputChange("trainingPlan", value),
        required: true,
        disabled: mode === "detail",
      },
      {
        name: "status",
        label: "Status",
        type: "text",
        value: formData.status,
        onChange: (value: any) => handleFieldUpdate("status", value),
        required: false,
        disabled: true,
      },
    ];

    const editableFields: any[] = [];

    return [basicFields, editableFields];
  }, [formData, mode, handleInputChange, handleFieldUpdate]);

  // Section toggle functions
  const toggleCourseContent = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showCourseContent: !prev.showCourseContent,
    }));
  }, []);

  const toggleTrainerEvaluation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showTrainerEvaluation: !prev.showTrainerEvaluation,
    }));
  }, []);

  const toggleFacilities = useCallback(() => {
    setState((prev) => ({ ...prev, showFacilities: !prev.showFacilities }));
  }, []);

  const toggleOverallReview = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showOverallReview: !prev.showOverallReview,
    }));
  }, []);

  return {
    formData,
    setFormData,
    state,
    setState,
    handleInputChange,
    handleFieldUpdate,
    getFormFields,
    toggleCourseContent,
    toggleTrainerEvaluation,
    toggleFacilities,
    toggleOverallReview,
    populateDocument,
    createTrainingEvaluation,
    updateTrainingEvaluation,
    submitEvaluationToHOD,
  };
};
