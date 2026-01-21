import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useTrainingEvaluationDocument } from "../../../hooks/documents/useTrainingEvaluationDocument";
import { useAppSelector } from "../../../store/hook";
import { Paper, Box, Collapse } from "@mui/material";
import { Row, Col, Input, Label } from "reactstrap";
import SectionHeader from "../../../Components/ui/SectionHeader";
import { RATING_OPTIONS } from "../../../@types/trainingEvaluation.dto";

const TrainingEvaluationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const companyId = useAppSelector((state) => state.auth.session.companyId);

  // Determine mode based on whether id exists
  const mode = id ? "detail" : "add";

  const {
    formData,
    state,
    handleFieldUpdate,
    getFormFields,
    toggleCourseContent,
    toggleTrainerEvaluation,
    toggleFacilities,
    toggleOverallReview,
    populateDocument,
    createTrainingEvaluation,
    submitEvaluationToHOD,
  } = useTrainingEvaluationDocument({ mode: mode as "add" | "detail" });

  useEffect(() => {
    if (mode === "detail" && id) {
      populateDocument(id);
    }
  }, [id, populateDocument, mode]);

  const getTitle = () => {
    return mode === "add"
      ? "Add Training Evaluation"
      : "Training Evaluation Details";
  };

  const getSubtitle = () => {
    return mode === "add"
      ? "Create new training evaluation"
      : `Training Evaluation ${formData.no || ""}`;
  };

  const getBreadcrumbItem = () => {
    return mode === "add"
      ? "Add Training Evaluation"
      : "Training Evaluation Details";
  };

  const handleSubmit = () => {
    if (mode === "add") {
      createTrainingEvaluation();
    } else {
      submitEvaluationToHOD();
    }
  };

  return (
    <>
      <HeaderMui
        title={getTitle()}
        subtitle={getSubtitle()}
        breadcrumbItem={getBreadcrumbItem()}
        handleBack={() => navigate(-1)}
        handleSubmit={handleSubmit}
        fields={getFormFields()}
        companyId={companyId}
        documentType="Training Evaluation"
        isLoading={state.isLoading}
        status={formData.status}
        lines={
          <>
            {/* Training Dates Section */}
            <Paper
              sx={{
                background: "transparent",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Training Dates"
                open={true}
                onToggle={() => {}}
              />
              <Collapse in={true}>
                <Box px={0} pb={2}>
                  <Row>
                    <Col sm={4}>
                      <Label htmlFor="actualStartDate">Actual Start Date</Label>
                      <Input
                        type="date"
                        id="actualStartDate"
                        value={formData.actualStartDate || ""}
                        onChange={(e) =>
                          handleFieldUpdate("actualStartDate", e.target.value)
                        }
                      />
                    </Col>
                    <Col sm={4}>
                      <Label htmlFor="actualEndDate">Actual End Date</Label>
                      <Input
                        type="date"
                        id="actualEndDate"
                        value={formData.actualEndDate || ""}
                        onChange={(e) =>
                          handleFieldUpdate("actualEndDate", e.target.value)
                        }
                      />
                    </Col>
                    <Col sm={4}>
                      <Label htmlFor="expectedEvaluationDate">
                        Expected Evaluation Date
                      </Label>
                      <Input
                        type="date"
                        id="expectedEvaluationDate"
                        value={formData.expectedEvaluationDate || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "expectedEvaluationDate",
                            e.target.value
                          )
                        }
                        disabled={true}
                      />
                    </Col>
                  </Row>
                </Box>
              </Collapse>
            </Paper>

            {/* Course Content Section */}
            <Paper
              sx={{
                background: "transparent",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Course Content"
                open={state.showCourseContent}
                onToggle={toggleCourseContent}
              />
              <Collapse in={state.showCourseContent}>
                <Box px={0} pb={2}>
                  <Row>
                    <Col sm={6}>
                      <Label htmlFor="qualityAndEfficiencyOfContent">
                        Quality and Efficiency of content
                      </Label>
                      <Input
                        type="select"
                        id="qualityAndEfficiencyOfContent"
                        value={formData.qualityAndEfficiencyOfContent || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "qualityAndEfficiencyOfContent",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="qualityAndEfficiencyOfVisualAids">
                        Quality and Efficiency of visual aids
                      </Label>
                      <Input
                        type="select"
                        id="qualityAndEfficiencyOfVisualAids"
                        value={formData.qualityAndEfficiencyOfVisualAids || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "qualityAndEfficiencyOfVisualAids",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="appropriatenessAndEfficiencyOfPracticalSessions">
                        Appropriateness and Efficiency of practical sessions
                      </Label>
                      <Input
                        type="select"
                        id="appropriatenessAndEfficiencyOfPracticalSessions"
                        value={
                          formData.appropriatenessAndEfficiencyOfPracticalSessions ||
                          ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "appropriatenessAndEfficiencyOfPracticalSessions",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="extentOfBalanceBetweenTheoreticalAndPracticalPartsOfTheCourse">
                        Extent of balance between theoretical and practical
                        parts
                      </Label>
                      <Input
                        type="select"
                        id="extentOfBalanceBetweenTheoreticalAndPracticalPartsOfTheCourse"
                        value={
                          formData.extentOfBalanceBetweenTheoreticalAndPracticalPartsOfTheCourse ||
                          ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "extentOfBalanceBetweenTheoreticalAndPracticalPartsOfTheCourse",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="amountOfTimeSpentOnEachSkillAndModule">
                        Amount of time spent on each skill and module
                      </Label>
                      <Input
                        type="select"
                        id="amountOfTimeSpentOnEachSkillAndModule"
                        value={
                          formData.amountOfTimeSpentOnEachSkillAndModule || ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "amountOfTimeSpentOnEachSkillAndModule",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="participantInvolvementAndPeerFeedback">
                        Participant Involvement and Peer feedback
                      </Label>
                      <Input
                        type="select"
                        id="participantInvolvementAndPeerFeedback"
                        value={
                          formData.participantInvolvementAndPeerFeedback || ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "participantInvolvementAndPeerFeedback",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="overallLengthAndPaceOfTheClass">
                        Overall Length and Pace of the class
                      </Label>
                      <Input
                        type="select"
                        id="overallLengthAndPaceOfTheClass"
                        value={formData.overallLengthAndPaceOfTheClass || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "overallLengthAndPaceOfTheClass",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="logicalSequenceOfTheCourse">
                        Logical sequence of the course
                      </Label>
                      <Input
                        type="select"
                        id="logicalSequenceOfTheCourse"
                        value={formData.logicalSequenceOfTheCourse || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "logicalSequenceOfTheCourse",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="relevanceOfTheCourseToMyJobFunction">
                        Relevance of the course to my job function
                      </Label>
                      <Input
                        type="select"
                        id="relevanceOfTheCourseToMyJobFunction"
                        value={
                          formData.relevanceOfTheCourseToMyJobFunction || ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "relevanceOfTheCourseToMyJobFunction",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="overallCourseContentRating">
                        Overall Course Content rating
                      </Label>
                      <Input
                        type="select"
                        id="overallCourseContentRating"
                        value={formData.overallCourseContentRating || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "overallCourseContentRating",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                </Box>
              </Collapse>
            </Paper>

            {/* Trainer Evaluation Section */}
            <Paper
              sx={{
                background: "transparent",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Trainer Evaluation"
                open={state.showTrainerEvaluation}
                onToggle={toggleTrainerEvaluation}
              />
              <Collapse in={state.showTrainerEvaluation}>
                <Box px={0} pb={2}>
                  <Row>
                    <Col sm={6}>
                      <Label htmlFor="trainerExplainedOutcomesOfCourse">
                        Trainer explained outcomes of course
                      </Label>
                      <Input
                        type="select"
                        id="trainerExplainedOutcomesOfCourse"
                        value={formData.trainerExplainedOutcomesOfCourse || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "trainerExplainedOutcomesOfCourse",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="trainerShowedContentMasteryKnowledgeOfMaterial">
                        Trainer showed content mastery/knowledge of material
                      </Label>
                      <Input
                        type="select"
                        id="trainerShowedContentMasteryKnowledgeOfMaterial"
                        value={
                          formData.trainerShowedContentMasteryKnowledgeOfMaterial ||
                          ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "trainerShowedContentMasteryKnowledgeOfMaterial",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="trainerExplainedMaterialAndGiveInstructions">
                        Trainer explained material and give instructions
                      </Label>
                      <Input
                        type="select"
                        id="trainerExplainedMaterialAndGiveInstructions"
                        value={
                          formData.trainerExplainedMaterialAndGiveInstructions ||
                          ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "trainerExplainedMaterialAndGiveInstructions",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="trainerUsedTimeEffectively">
                        Trainer used time effectively
                      </Label>
                      <Input
                        type="select"
                        id="trainerUsedTimeEffectively"
                        value={formData.trainerUsedTimeEffectively || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "trainerUsedTimeEffectively",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="trainerQuestionedParticipantsToStimulateDiscussionAndVerifyLearning">
                        Trainer questioned participants to stimulate discussion
                      </Label>
                      <Input
                        type="select"
                        id="trainerQuestionedParticipantsToStimulateDiscussionAndVerifyLearning"
                        value={
                          formData.trainerQuestionedParticipantsToStimulateDiscussionAndVerifyLearning ||
                          ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "trainerQuestionedParticipantsToStimulateDiscussionAndVerifyLearning",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="trainerMadeEffectiveUseOfLearningAidsToEnhanceLearning">
                        Trainer made effective use of learning aids
                      </Label>
                      <Input
                        type="select"
                        id="trainerMadeEffectiveUseOfLearningAidsToEnhanceLearning"
                        value={
                          formData.trainerMadeEffectiveUseOfLearningAidsToEnhanceLearning ||
                          ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "trainerMadeEffectiveUseOfLearningAidsToEnhanceLearning",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="trainerHandledAllOutstandingIssuesEffectively">
                        Trainer handled all outstanding issues effectively
                      </Label>
                      <Input
                        type="select"
                        id="trainerHandledAllOutstandingIssuesEffectively"
                        value={
                          formData.trainerHandledAllOutstandingIssuesEffectively ||
                          ""
                        }
                        onChange={(e) =>
                          handleFieldUpdate(
                            "trainerHandledAllOutstandingIssuesEffectively",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="overallRatingOfTrainer">
                        Overall rating of Trainer
                      </Label>
                      <Input
                        type="select"
                        id="overallRatingOfTrainer"
                        value={formData.overallRatingOfTrainer || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "overallRatingOfTrainer",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                </Box>
              </Collapse>
            </Paper>

            {/* Facilities Section */}
            <Paper
              sx={{
                background: "transparent",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Facilities"
                open={state.showFacilities}
                onToggle={toggleFacilities}
              />
              <Collapse in={state.showFacilities}>
                <Box px={0} pb={2}>
                  <Row>
                    <Col sm={6}>
                      <Label htmlFor="comfortOfTheTrainingFacility">
                        Facility: Comfort of the training facility
                      </Label>
                      <Input
                        type="select"
                        id="comfortOfTheTrainingFacility"
                        value={formData.comfortOfTheTrainingFacility || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "comfortOfTheTrainingFacility",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="convenienceOfTrainingLocation">
                        Facility: Convenience of training location
                      </Label>
                      <Input
                        type="select"
                        id="convenienceOfTrainingLocation"
                        value={formData.convenienceOfTrainingLocation || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "convenienceOfTrainingLocation",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="qualityOfRefreshmentsProvided">
                        Facility: Quality of refreshments provided
                      </Label>
                      <Input
                        type="select"
                        id="qualityOfRefreshmentsProvided"
                        value={formData.qualityOfRefreshmentsProvided || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "qualityOfRefreshmentsProvided",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                </Box>
              </Collapse>
            </Paper>

            {/* Overall Review Section */}
            <Paper
              sx={{
                background: "transparent",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Overall Review"
                open={state.showOverallReview}
                onToggle={toggleOverallReview}
              />
              <Collapse in={state.showOverallReview}>
                <Box px={0} pb={2}>
                  <Row>
                    <Col sm={12}>
                      <Label htmlFor="generalComments">General comments</Label>
                      <Input
                        type="textarea"
                        id="generalComments"
                        rows={3}
                        value={formData.generalComments || ""}
                        onChange={(e) =>
                          handleFieldUpdate("generalComments", e.target.value)
                        }
                      />
                    </Col>
                    <Col sm={12}>
                      <Label htmlFor="generalComments2">
                        General Comments 2
                      </Label>
                      <Input
                        type="textarea"
                        id="generalComments2"
                        rows={3}
                        value={formData.generalComments2 || ""}
                        onChange={(e) =>
                          handleFieldUpdate("generalComments2", e.target.value)
                        }
                      />
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="overallTrainingRating">
                        Overall Training Rating
                      </Label>
                      <Input
                        type="select"
                        id="overallTrainingRating"
                        value={formData.overallTrainingRating || ""}
                        onChange={(e) =>
                          handleFieldUpdate(
                            "overallTrainingRating",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select rating</option>
                        {RATING_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </Col>
                  </Row>
                </Box>
              </Collapse>
            </Paper>
          </>
        }
      />
    </>
  );
};

export default TrainingEvaluationDetails;
