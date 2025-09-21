import React from "react";
import { Row, Col, Input, Label } from "reactstrap";
import { Collapse } from "@mui/material";
import SectionHeader from "../../../Components/ui/SectionHeader";

interface ExitInterviewCommentsProps {
  formData: any;
  isFieldDisabled: boolean;
  handleInputChange: (field: keyof any, value: string | boolean) => void;
  onSave: () => void;
}

const ExitInterviewComments: React.FC<ExitInterviewCommentsProps> = ({
  formData,
  isFieldDisabled,
  handleInputChange,
  onSave,
}) => {
  const [commentsOpen, setCommentsOpen] = React.useState(true);

  return (
    <>
        <SectionHeader
          title="Comments"
          open={commentsOpen}
          onToggle={() => setCommentsOpen(!commentsOpen)}
        />
      <Collapse in={commentsOpen}>
        <div className="p-3">
          <Row>
            <Col sm={6}>
              <Label htmlFor="generalEmployeeComments">
                General Employee Comments/Feedback
              </Label>
              <Input
                type="textarea"
                id="generalEmployeeComments"
                value={formData.GeneralEmployeeComments || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange("GeneralEmployeeComments", e.target.value)
                }
                onBlur={onSave}
                rows={4}
              />
            </Col>
            <Col sm={6}>
              <Label htmlFor="generalInterviewerComments">
                Interviewer Comments
              </Label>
              <Input
                type="textarea"
                id="generalInterviewerComments"
                value={formData.GeneralInterviewerComments || ""}
                disabled={isFieldDisabled}
                onChange={(e) =>
                  handleInputChange(
                    "GeneralInterviewerComments",
                    e.target.value
                  )
                }
                onBlur={onSave}
                rows={4}
              />
            </Col>
          </Row>
        </div>
      </Collapse>
    </>
  );
};

export default ExitInterviewComments;
