import React from "react";
import { Row, Col, Input, Label } from "reactstrap";
import { Collapse } from "@mui/material";
import SectionHeader from "../../../Components/ui/SectionHeader";

interface ExitInterviewQuestionsProps {
  formData: any;
  isFieldDisabled: boolean;
  handleInputChange: (field: keyof any, value: string | boolean) => void;
  onSave: () => void;
}

const ExitInterviewQuestions: React.FC<ExitInterviewQuestionsProps> = ({
  formData,
  isFieldDisabled,
  handleInputChange,
  onSave,
}) => {
  const [questionSection1Open, setQuestionSection1Open] = React.useState(true);
  const [questionSection2Open, setQuestionSection2Open] = React.useState(true);
  const [questionSection3Open, setQuestionSection3Open] = React.useState(true);

  return (
    <>
      {/* Questions Section 1 */}
      <SectionHeader
        title="Exit Interview Questions - Part 1"
        open={questionSection1Open}
        onToggle={() => setQuestionSection1Open(!questionSection1Open)}
      />
      <Collapse in={questionSection1Open}>
        <div className="p-3">
          <Row>
            <Col sm={6}>
              <Label htmlFor="primaryReasonForLeaving">
                1. What is your primary reason for leaving this job?
              </Label>
              <Input
                type="textarea"
                id="primaryReasonForLeaving"
                value={formData.PrimaryReasonForLeaving || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange("PrimaryReasonForLeaving", e.target.value)
                }
                onBlur={onSave}
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
                value={formData.MostSatisfyingAboutJob || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange("MostSatisfyingAboutJob", e.target.value)
                }
                onBlur={onSave}
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
                value={formData.MostFrustratingAboutJob || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange("MostFrustratingAboutJob", e.target.value)
                }
                onBlur={onSave}
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
                value={formData.ROMCouldPreventLeaving || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange("ROMCouldPreventLeaving", e.target.value)
                }
                onBlur={onSave}
                rows={3}
                required
              />
            </Col>
          </Row>
        </div>
      </Collapse>

      {/* Questions Section 2 */}
      <SectionHeader
        title="Exit Interview Questions - Part 2"
        open={questionSection2Open}
        onToggle={() => setQuestionSection2Open(!questionSection2Open)}
      />
      <Collapse in={questionSection2Open}>
        <div className="p-3">
          <Row>
            <Col sm={6}>
              <Label htmlFor="positionCompatibleWithSkills">
                5. Do you feel you were placed in a position compatible with
                your skills? If not, explain.
              </Label>
              <Input
                type="textarea"
                id="positionCompatibleWithSkills"
                value={formData.PositionCompatibleWithSkills || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange(
                    "PositionCompatibleWithSkills",
                    e.target.value
                  )
                }
                onBlur={onSave}
                rows={3}
                required
              />
            </Col>
            <Col sm={6}>
              <Label htmlFor="possibilityForAdvancement">
                6. Do you feel that there was the possibility for advancement in
                your position? If not, what do you feel prevented advancement?
              </Label>
              <Input
                type="textarea"
                id="possibilityForAdvancement"
                value={formData.PossibilityForAdvancement || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange("PossibilityForAdvancement", e.target.value)
                }
                onBlur={onSave}
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
                value={formData.TrainingDevelopmentOffered || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange(
                    "TrainingDevelopmentOffered",
                    e.target.value
                  )
                }
                onBlur={onSave}
                rows={3}
                required
              />
            </Col>
            <Col sm={6}>
              <Label htmlFor="greatestChallengeInPosition">
                8a. What was the greatest challenge you faced in your position?
              </Label>
              <Input
                type="textarea"
                id="greatestChallengeInPosition"
                value={formData.GreatestChallengeInPosition || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange(
                    "GreatestChallengeInPosition",
                    e.target.value
                  )
                }
                onBlur={onSave}
                rows={3}
                required
              />
            </Col>
          </Row>
        </div>
      </Collapse>

      {/* Questions Section 3 */}
      <SectionHeader
        title="Exit Interview Questions - Part 3"
        open={questionSection3Open}
        onToggle={() => setQuestionSection3Open(!questionSection3Open)}
      />
      <Collapse in={questionSection3Open}>
        <div className="p-3">
          <Row>
            <Col sm={6}>
              <Label htmlFor="suggestionsForImprovement">
                8b. Suggest ways of improvement
              </Label>
              <Input
                type="textarea"
                id="suggestionsForImprovement"
                value={formData.SuggestionsForImprovement || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange("SuggestionsForImprovement", e.target.value)
                }
                onBlur={onSave}
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
                value={formData.MotivatedToReachPeakPerformance || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange(
                    "MotivatedToReachPeakPerformance",
                    e.target.value
                  )
                }
                onBlur={onSave}
                rows={3}
                required
              />
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm={6}>
              <Label htmlFor="relationshipWithTeamAndSupervisor">
                10. Did you get on well with your teammates & supervisor? If NO,
                explain
              </Label>
              <Input
                type="textarea"
                id="relationshipWithTeamAndSupervisor"
                value={formData.RelationshipWithTeamAndSupervisor || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange(
                    "RelationshipWithTeamAndSupervisor",
                    e.target.value
                  )
                }
                onBlur={onSave}
                rows={3}
                required
              />
            </Col>
            <Col sm={6}>
              <Label htmlFor="improveStaffMoraleRetention">
                11. Is there anything the organization could do to improve staff
                morale, retention?
              </Label>
              <Input
                type="textarea"
                id="improveStaffMoraleRetention"
                value={formData.ImproveStaffMoraleRetention || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange(
                    "ImproveStaffMoraleRetention",
                    e.target.value
                  )
                }
                onBlur={onSave}
                rows={3}
                required
              />
            </Col>
          </Row>
        </div>
      </Collapse>
    </>
  );
};

export default ExitInterviewQuestions;
