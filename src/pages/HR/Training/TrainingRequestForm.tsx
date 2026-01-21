import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrainingRequest } from "./hooks/useTrainingRequest";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import SectionHeader from "../../../Components/ui/SectionHeader";
import { Collapse, Paper, Box } from "@mui/material";
import { Row, Col, Input, Label } from "reactstrap";

const TrainingRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    general: true,
    trainingDetails: true,
    financialDetails: true,
  });

  const {
    state,
    formData,
    handleInputChange,
    createTrainingRequest,
    getFormFields,
    isFieldDisabled,
    trainingRoomOptions,
  } = useTrainingRequest({ mode: "add" });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async () => {
    try {
      await createTrainingRequest();
    } catch (error) {
      // Error is already handled in createTrainingRequest
    }
  };

  const handleCancel = () => {
    navigate("/training-requests");
  };

  return (
    <HeaderMui
      title="Training Request"
      subtitle="Add New Training Request"
      breadcrumbItem="Training Request"
      fields={getFormFields()}
      status="Open"
      documentType="Training Request"
      isLoading={state.isLoading}
      pageType="add"
      handleBack={() => navigate(-1)}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      lines={
        <>
          {/* Training Details Section */}
          <Paper elevation={2} className="mt-4">
            <SectionHeader
              title="Training Details"
              open={openSections.trainingDetails}
              onToggle={() => toggleSection("trainingDetails")}
            />
            <Collapse in={openSections.trainingDetails}>
              <Box p={3}>
                <Row>
                  <Col md={6}>
                    <Label for="description">Description</Label>
                    <Input
                      type="textarea"
                      id="description"
                      value={formData.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      disabled={isFieldDisabled}
                      rows={4}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="trainingRoom">Training Room</Label>
                    <Input
                      type="select"
                      id="trainingRoom"
                      value={formData.trainingRoom || ""}
                      onChange={(e) =>
                        handleInputChange("trainingRoom", e.target.value)
                      }
                      disabled={isFieldDisabled}
                    >
                      <option value="">Select Training Room...</option>
                      {trainingRoomOptions.map((room) => (
                        <option key={room.value} value={room.value}>
                          {room.label}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Label for="plannedStartTime">Planned Start Time</Label>
                    <Input
                      type="time"
                      id="plannedStartTime"
                      value={formData.plannedStartTime || ""}
                      onChange={(e) =>
                        handleInputChange("plannedStartTime", e.target.value)
                      }
                      disabled={isFieldDisabled}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="plannedEndTime">Planned End Time</Label>
                    <Input
                      type="time"
                      id="plannedEndTime"
                      value={formData.plannedEndTime || ""}
                      onChange={(e) =>
                        handleInputChange("plannedEndTime", e.target.value)
                      }
                      disabled={isFieldDisabled}
                    />
                  </Col>
                </Row>
              </Box>
            </Collapse>
          </Paper>

          {/* Financial Details Section */}
          <Paper elevation={2} className="mt-4">
            <SectionHeader
              title="Financial Details"
              open={openSections.financialDetails}
              onToggle={() => toggleSection("financialDetails")}
            />
            <Collapse in={openSections.financialDetails}>
              <Box p={3}>
                <Row>
                  <Col md={6}>
                    <Label for="perDiemAmountIfNeeded">
                      Per Diem Amount If Needed
                    </Label>
                    <Input
                      type="number"
                      id="perDiemAmountIfNeeded"
                      value={formData.perDiemAmountIfNeeded || 0}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, "");
                        handleInputChange(
                          "perDiemAmountIfNeeded",
                          parseFloat(value) || 0
                        );
                      }}
                      onKeyDown={(e) => {
                        if (
                          ![8, 9, 27, 13, 46, 110, 190].includes(e.keyCode) &&
                          (![65, 67, 86, 88].includes(e.keyCode) ||
                            !e.ctrlKey) &&
                          ![35, 36, 37, 38, 39, 40].includes(e.keyCode) &&
                          (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                          (e.keyCode < 96 || e.keyCode > 105)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      disabled={isFieldDisabled}
                      min="0"
                      step="0.01"
                      placeholder="Enter per diem amount"
                    />
                  </Col>
                </Row>
              </Box>
            </Collapse>
          </Paper>
        </>
      }
    />
  );
};

export default TrainingRequestForm;
