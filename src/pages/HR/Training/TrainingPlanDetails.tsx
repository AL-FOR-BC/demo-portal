import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { Typography } from "@mui/material";
import { useTrainingPlanDocument } from "../../../hooks/documents/useTrainingPlanDocument";

const TrainingPlanDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    formData,
    state,
    getFormFields,
    deleteTrainingPlan,
    sendTrainingPlanForApproval,
    populateDocument,
  } = useTrainingPlanDocument({ mode: "detail" });

  useEffect(() => {
    if (id) {
      // Populate the document with the training plan data using the systemId
      populateDocument(id);
    }
  }, [id]);

  if (state.isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (!formData.no && !state.isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <Typography variant="h6" color="error">
          Training plan not found
        </Typography>
      </div>
    );
  }

  return (
    <HeaderMui
      title="Training Plan Details"
      subtitle="Training Plan Details"
      breadcrumbItem="Training Plan Details"
      fields={getFormFields()}
      isLoading={state.isLoading}
      pageType="detail"
      status={formData.status}
      handleBack={() => navigate("/training-plans")}
      handleDelete={() => deleteTrainingPlan(id!)}
      handleSendApprovalRequest={() => {
        if (formData.no) {
          sendTrainingPlanForApproval(formData.no, "system@company.com");
        }
      }}
    />
  );
};

export default TrainingPlanDetails;
