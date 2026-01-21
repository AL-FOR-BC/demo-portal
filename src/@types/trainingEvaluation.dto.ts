export interface TrainingEvaluation {
  systemId?: string;
  no?: string;
  employeeNo: string;
  employeeName?: string;
  trainingType?: string;
  trainingPlan?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  expectedEvaluationDate?: string;
  status?: string;

  // Course Content fields
  qualityAndEfficiencyOfContent?: string;
  qualityAndEfficiencyOfVisualAids?: string;
  appropriatenessAndEfficiencyOfPracticalSessions?: string;
  extentOfBalanceBetweenTheoreticalAndPracticalPartsOfTheCourse?: string;
  amountOfTimeSpentOnEachSkillAndModule?: string;
  participantInvolvementAndPeerFeedback?: string;
  overallLengthAndPaceOfTheClass?: string;
  logicalSequenceOfTheCourse?: string;
  relevanceOfTheCourseToMyJobFunction?: string;
  overallCourseContentRating?: string;

  // Trainer Evaluation fields
  trainerExplainedOutcomesOfCourse?: string;
  trainerShowedContentMasteryKnowledgeOfMaterial?: string;
  trainerExplainedMaterialAndGiveInstructions?: string;
  trainerUsedTimeEffectively?: string;
  trainerQuestionedParticipantsToStimulateDiscussionAndVerifyLearning?: string;
  trainerMadeEffectiveUseOfLearningAidsToEnhanceLearning?: string;
  trainerHandledAllOutstandingIssuesEffectively?: string;
  overallRatingOfTrainer?: string;

  // Facilities fields
  comfortOfTheTrainingFacility?: string;
  convenienceOfTrainingLocation?: string;
  qualityOfRefreshmentsProvided?: string;

  // Overall Review fields
  generalComments?: string;
  generalComments2?: string;
  overallTrainingRating?: string;

  // System fields
  systemCreatedAt?: string;
  systemCreatedBy?: string;
  systemModifiedAt?: string;
  systemModifiedBy?: string;
  systemRowVersion?: string;
  "@odata.etag"?: string;
}

export interface TrainingEvaluationFormData {
  systemId?: string;
  no?: string;
  employeeNo: string;
  employeeName?: string;
  trainingType?: string;
  trainingPlan?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  expectedEvaluationDate?: string;
  status?: string;

  // Course Content
  qualityAndEfficiencyOfContent?: string;
  qualityAndEfficiencyOfVisualAids?: string;
  appropriatenessAndEfficiencyOfPracticalSessions?: string;
  extentOfBalanceBetweenTheoreticalAndPracticalPartsOfTheCourse?: string;
  amountOfTimeSpentOnEachSkillAndModule?: string;
  participantInvolvementAndPeerFeedback?: string;
  overallLengthAndPaceOfTheClass?: string;
  logicalSequenceOfTheCourse?: string;
  relevanceOfTheCourseToMyJobFunction?: string;
  overallCourseContentRating?: string;

  // Trainer Evaluation
  trainerExplainedOutcomesOfCourse?: string;
  trainerShowedContentMasteryKnowledgeOfMaterial?: string;
  trainerExplainedMaterialAndGiveInstructions?: string;
  trainerUsedTimeEffectively?: string;
  trainerQuestionedParticipantsToStimulateDiscussionAndVerifyLearning?: string;
  trainerMadeEffectiveUseOfLearningAidsToEnhanceLearning?: string;
  trainerHandledAllOutstandingIssuesEffectively?: string;
  overallRatingOfTrainer?: string;

  // Facilities
  comfortOfTheTrainingFacility?: string;
  convenienceOfTrainingLocation?: string;
  qualityOfRefreshmentsProvided?: string;

  // Overall Review
  generalComments?: string;
  generalComments2?: string;
  overallTrainingRating?: string;

  // System fields
  "@odata.etag"?: string;
}

// Rating options for dropdowns
export interface RatingOption {
  label: string;
  value: string;
}

export const RATING_OPTIONS: RatingOption[] = [
  { label: "Outstanding", value: "Outstanding" },
  { label: "Good", value: "Good" },
  { label: "Fair", value: "Fair" },
  { label: "Poor", value: "Poor" },
];
