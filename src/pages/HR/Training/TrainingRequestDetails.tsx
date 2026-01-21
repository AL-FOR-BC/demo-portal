import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTrainingRequest } from "./hooks/useTrainingRequest";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import SectionHeader from "../../../Components/ui/SectionHeader";
import { Collapse, Paper, Box } from "@mui/material";
import { Row, Col, Input, Label } from "reactstrap";
import { decodeValue } from "../../../utils/common";
import { useAppSelector } from "../../../store/hook";

const TrainingRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    general: true,
    trainingDetails: true,
    financialDetails: true,
  });

  const {
    state,
    formData,
    handleInputChange,
    deleteTrainingRequest,
    sendForApproval,
    cancelApproval,
    submitTrainingRequest,
    handleSaveOnBlur,
    getFormFields,
    isFieldDisabled,
    trainingRoomOptions,
  } = useTrainingRequest({ mode: "edit", systemId: id });

  // Get logged-in user info from Redux store
  // const user = useAppSelector((state) => state.auth.user);
  // const { companyId } = useAppSelector((state) => state.auth.session);

  // Check if current user is the owner of this training request
  // const isOwner = user?.employeeNo === formData.employeeNo;

  // Determine if sections should be disabled based on ownership

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async () => {
    if (id) {
      const success = await submitTrainingRequest(
        state.trainingRequest?.no || ""
      );
      if (success) {
        navigate("/training-requests");
      }
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this training request?")
    ) {
      try {
        await deleteTrainingRequest();
      } catch (error) {
        // Error is already handled in deleteTrainingRequest
      }
    }
  };

  const handleSendForApproval = async () => {
    try {
      await sendForApproval();
    } catch (error) {
      // Error is already handled in sendForApproval
    }
  };

  const handleCancelApproval = async () => {
    try {
      await cancelApproval();
    } catch (error) {
      // Error is already handled in cancelApproval
    }
  };

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <HeaderMui
      title="Training Request"
      subtitle="Training Request Details"
      breadcrumbItem="Training Request"
      fields={getFormFields()}
      status={state.trainingRequest?.status}
      documentType={decodeValue(state.trainingRequest?.status || "")}
      isLoading={state.isLoading}
      pageType="detail"
      handleBack={() => navigate(-1)}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      handleSendApprovalRequest={handleSendForApproval}
      handleCancelApprovalRequest={handleCancelApproval}
      companyId={companyId}
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
                      onBlur={handleSaveOnBlur}
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
                      onBlur={handleSaveOnBlur}
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
                      onBlur={handleSaveOnBlur}
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
                      onBlur={handleSaveOnBlur}
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
                      onBlur={handleSaveOnBlur}
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

export default TrainingRequestDetails;
