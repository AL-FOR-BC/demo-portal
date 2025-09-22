import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useExitInterview } from "./hooks/useExitInterview";
import { Collapse, Paper, Box } from "@mui/material";
import SectionHeader from "../../../Components/ui/SectionHeader";
import { Row, Col, Input, Label } from "reactstrap";
import { decodeValue } from "../../../utils/common";
import { useAppSelector } from "../../../store/hook";

function ExitInterviewDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { email } = useAppSelector((state) => state.auth.user);
  const [validationErrors, setValidationErrors] = useState<Set<string>>(
    new Set()
  );

  const {
    state,
    formData,
    populateDocument,
    updateExitInterview,
    deleteExitInterview,
    sendExitInterviewForApproval,
    cancelExitInterviewApproval,
    getFormFields,
    handleInputChange,
    isFieldDisabled,
    submitInterview,
    validateRequiredFields,
    printExitInterview,
  } = useExitInterview({ mode: "edit" });

  useEffect(() => {
    if (id) {
      populateDocument(id);
    }
  }, [id]);

  const hasValidationError = (fieldName: string) => {
    return validationErrors.has(fieldName);
  };

  const clearFieldValidationError = (fieldName: string) => {
    setValidationErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fieldName);
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (id) {
      // Validate fields before submission
      if (!validateRequiredFields(setValidationErrors)) {
        return;
      }

      const success = await submitInterview(state.exitInterview?.no || "");
      if (success) {
        navigate("/exit-interviews");
      }
    }
  };

  const handleSaveOnBlur = async () => {
    if (id) {
      await updateExitInterview(id);
    }
  };

  const handleDelete = async () => {
    if (id) {
      const success = await deleteExitInterview(id);
      if (success) {
        navigate("/exit-interviews");
      }
    }
  };

  const handleSendForApproval = async () => {
    if (state.exitInterview?.no) {
      const success = await sendExitInterviewForApproval(
        state.exitInterview.no,
        email
      );
      if (success) {
        navigate("/exit-interviews");
      }
    }
  };

  const handleCancelApproval = async () => {
    if (state.exitInterview?.no) {
      const success = await cancelExitInterviewApproval(state.exitInterview.no);
      if (success) {
        navigate("/exit-interviews");
      }
    }
  };

  return (
    <>
      <HeaderMui
        title="Exit Interview Details"
        subtitle="Exit Interview Details"
        breadcrumbItem="Exit Interview Details"
        documentType={decodeValue(state.exitInterview?.documentType || "Exit Interview")}
        fields={getFormFields()}
        isLoading={state.isLoading}
        handleBack={() => navigate("/exit-interviews")}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        handleSendApprovalRequest={() => {
          if (state.exitInterview?.no) {
            handleSendForApproval();
          }
        }}
        handleCancelApprovalRequest={handleCancelApproval}
        pageType="detail"
        status={state.exitInterview?.status}
        requestNo={state.exitInterview?.no}
        companyId={companyId}
        tableId={50350}
        onPrintClick={() => {
          if (id) {
            printExitInterview(id);
          }
        }}
        lines={
          <>
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
                title="Exit Interview Questions - Part 1"
                open={true}
                onToggle={() => {}}
              />
              <Collapse in={true}>
                <Box px={0} pb={2}>
                  <Row>
                    <Col sm={6}>
                      <Label htmlFor="primaryReasonForLeaving">
                        1. What is your primary reason for leaving this job?
                      </Label>
                      <Input
                        type="textarea"
                        id="primaryReasonForLeaving"
                        value={formData.primaryReasonForLeaving || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) => {
                          handleInputChange(
                            "primaryReasonForLeaving",
                            e.target.value
                          );
                          clearFieldValidationError("primaryReasonForLeaving");
                        }}
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                        invalid={hasValidationError("primaryReasonForLeaving")}
                      />
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="mostSatisfyingAboutJob">
                        2. What did you find most satisfying about your job?
                      </Label>
                      <Input
                        type="textarea"
                        id="mostSatisfyingAboutJob"
                        value={formData.mostSatisfyingAboutJob || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) => {
                          handleInputChange(
                            "mostSatisfyingAboutJob",
                            e.target.value
                          );
                          clearFieldValidationError("mostSatisfyingAboutJob");
                        }}
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                        invalid={hasValidationError("mostSatisfyingAboutJob")}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={6}>
                      <Label htmlFor="mostFrustratingAboutJob">
                        3. What did you find most frustrating about your job?
                      </Label>
                      <Input
                        type="textarea"
                        id="mostFrustratingAboutJob"
                        value={formData.mostFrustratingAboutJob || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) => {
                          handleInputChange(
                            "mostFrustratingAboutJob",
                            e.target.value
                          );
                          clearFieldValidationError("mostFrustratingAboutJob");
                        }}
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                        invalid={hasValidationError("mostFrustratingAboutJob")}
                      />
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="romCouldPreventLeaving">
                        4. Is there anything that ROM could have done to prevent
                        you from leaving?
                      </Label>
                      <Input
                        type="textarea"
                        id="romCouldPreventLeaving"
                        value={formData.romCouldPreventLeaving || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) => {
                          handleInputChange(
                            "romCouldPreventLeaving",
                            e.target.value
                          );
                          clearFieldValidationError("romCouldPreventLeaving");
                        }}
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                        invalid={hasValidationError("romCouldPreventLeaving")}
                      />
                    </Col>
                  </Row>
                </Box>
              </Collapse>
            </Paper>

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
                title="Exit Interview Questions - Part 2"
                open={true}
                onToggle={() => {}}
              />
              <Collapse in={true}>
                <Box px={0} pb={2}>
                  <Row>
                    <Col sm={6}>
                      <Label htmlFor="positionCompatibleWithSkills">
                        5. Do you feel you were placed in a position compatible
                        with your skills? If not, explain.
                      </Label>
                      <Input
                        type="textarea"
                        id="positionCompatibleWithSkills"
                        value={formData.positionCompatibleWithSkills || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "positionCompatibleWithSkills",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="possibilityForAdvancement">
                        6. Do you feel that there was the possibility for
                        advancement in your position? If not, what do you feel
                        prevented advancement?
                      </Label>
                      <Input
                        type="textarea"
                        id="possibilityForAdvancement"
                        value={formData.possibilityForAdvancement || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "possibilityForAdvancement",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={6}>
                      <Label htmlFor="trainingDevelopmentOffered">
                        7. Do you think you should have been offered more
                        training/development within the position you held?
                      </Label>
                      <Input
                        type="textarea"
                        id="trainingDevelopmentOffered"
                        value={formData.trainingDevelopmentOffered || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "trainingDevelopmentOffered",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="greatestChallengeInPosition">
                        8a. What was the greatest challenge you faced in your
                        position?
                      </Label>
                      <Input
                        type="textarea"
                        id="greatestChallengeInPosition"
                        value={formData.greatestChallengeInPosition || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "greatestChallengeInPosition",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                  </Row>
                </Box>
              </Collapse>
            </Paper>

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
                title="Exit Interview Questions - Part 3"
                open={true}
                onToggle={() => {}}
              />
              <Collapse in={true}>
                <Box px={0} pb={2}>
                  <Row>
                    <Col sm={6}>
                      <Label htmlFor="suggestionsForImprovement">
                        8b. Suggest ways of improvement
                      </Label>
                      <Input
                        type="textarea"
                        id="suggestionsForImprovement"
                        value={formData.suggestionsForImprovement || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "suggestionsForImprovement",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="motivatedToReachPeakPerformance">
                        9. Were you motivated to reach peak of your performance?
                      </Label>
                      <Input
                        type="textarea"
                        id="motivatedToReachPeakPerformance"
                        value={formData.motivatedToReachPeakPerformance || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "motivatedToReachPeakPerformance",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={6}>
                      <Label htmlFor="relationshipWithTeamAndSupervisor">
                        10. Did you get on well with your teammates &
                        supervisor? If NO, explain
                      </Label>
                      <Input
                        type="textarea"
                        id="relationshipWithTeamAndSupervisor"
                        value={formData.relationshipWithTeamAndSupervisor || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "relationshipWithTeamAndSupervisor",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="improveStaffMoraleRetention">
                        11. Is there anything the organization could do to
                        improve staff morale, retention?
                      </Label>
                      <Input
                        type="textarea"
                        id="improveStaffMoraleRetention"
                        value={formData.improveStaffMoraleRetention || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "improveStaffMoraleRetention",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={6}>
                      <Label htmlFor="workingConditionsSuitable">
                        12. Were the working conditions suitable? (i.e. hours,
                        work area, etc.). If NOT, how would you advise ROM to
                        improve?
                      </Label>
                      <Input
                        type="textarea"
                        id="workingConditionsSuitable"
                        value={formData.workingConditionsSuitable || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "workingConditionsSuitable",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                    <Col sm={6}>
                      <Label htmlFor="payComparedToWorkload">
                        13. How is the pay compared to the workload? Is it
                        timely?
                      </Label>
                      <Input
                        type="textarea"
                        id="payComparedToWorkload"
                        value={formData.payComparedToWorkload || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "payComparedToWorkload",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={3}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col sm={12}>
                      <Label htmlFor="additionalComments">
                        14. Would you care to make any other comments?
                      </Label>
                      <Input
                        type="textarea"
                        id="additionalComments"
                        value={formData.additionalComments || ""}
                        disabled={isFieldDisabled}
                        onChange={(e) =>
                          handleInputChange(
                            "additionalComments",
                            e.target.value
                          )
                        }
                        onBlur={handleSaveOnBlur}
                        rows={4}
                        required
                      />
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
}

export default ExitInterviewDetails;
