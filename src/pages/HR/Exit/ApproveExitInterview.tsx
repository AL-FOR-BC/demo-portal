import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useExitInterview } from "./hooks/useExitInterview";
import { Collapse, Paper, Box } from "@mui/material";
import SectionHeader from "../../../Components/ui/SectionHeader";
import { Row, Col, Input, Label } from "reactstrap";

function ApproveExitInterview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    state,
    formData,
    populateDocument,
    updateExitInterview,
    getFormFields,
    handleInputChange,
    isFieldDisabled,
  } = useExitInterview({ mode: "approval" });

  useEffect(() => {
    if (id) {
      populateDocument(id);
    }
  }, [id]);

  const handleApprove = async () => {
    if (id) {
      const success = await updateExitInterview(id);
      if (success) {
        navigate("/exit-interviews");
      }
    }
  };

  const handleReject = async () => {
    if (id) {
      const success = await updateExitInterview(id);
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

  const buttons = [
    {
      label: "Approve",
      color: "success",
      icon: "check",
      onClick: handleApprove,
    },
    {
      label: "Reject",
      color: "error",
      icon: "close",
      onClick: handleReject,
    },
  ];

  return (
    <>
      <HeaderMui
        title="Approve Exit Interview"
        subtitle="Approve Exit Interview"
        breadcrumbItem="Approve Exit Interview"
        fields={getFormFields()}
        isLoading={state.isLoading}
        handleBack={() => navigate("/exit-interviews")}
        buttons={buttons}
        pageType="approval"
        status={state.exitInterview?.status}
      />

      {/* Questions Sections */}
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
                  onChange={(e) =>
                    handleInputChange("primaryReasonForLeaving", e.target.value)
                  }
                  onBlur={handleSaveOnBlur}
                  rows={3}
                  required
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
                  onChange={(e) =>
                    handleInputChange("mostSatisfyingAboutJob", e.target.value)
                  }
                  onBlur={handleSaveOnBlur}
                  rows={3}
                  required
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
                  onChange={(e) =>
                    handleInputChange("mostFrustratingAboutJob", e.target.value)
                  }
                  onBlur={handleSaveOnBlur}
                  rows={3}
                  required
                />
              </Col>
              <Col sm={6}>
                <Label htmlFor="romCouldPreventLeaving">
                  4. Is there anything that ROM could have done to prevent you
                  from leaving?
                </Label>
                <Input
                  type="textarea"
                  id="romCouldPreventLeaving"
                  value={formData.romCouldPreventLeaving || ""}
                  disabled={isFieldDisabled}
                  onChange={(e) =>
                    handleInputChange("romCouldPreventLeaving", e.target.value)
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
          title="Exit Interview Questions - Part 2"
          open={true}
          onToggle={() => {}}
        />
        <Collapse in={true}>
          <Box px={0} pb={2}>
            <Row>
              <Col sm={6}>
                <Label htmlFor="positionCompatibleWithSkills">
                  5. Do you feel you were placed in a position compatible with
                  your skills? If not, explain.
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
                  6. Do you feel that there was the possibility for advancement
                  in your position? If not, what do you feel prevented
                  advancement?
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
                  10. Did you get on well with your teammates & supervisor? If
                  NO, explain
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
                  11. Is there anything the organization could do to improve
                  staff morale, retention?
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
          </Box>
        </Collapse>
      </Paper>
    </>
  );
}

export default ApproveExitInterview;
