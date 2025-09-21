import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { Typography, Box } from "@mui/material";

const ApproveTrainingPlan: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div>
      <HeaderMui
        title="Approve Training Plan"
        subtitle="Approve Training Plan"
        breadcrumbItem="Approve Training Plan"
        fields={[]}
        isLoading={false}
        pageType="approval"
        handleBack={() => navigate("/training-plans")}
      />

      <div className="container-fluid">
        <Box className="text-center py-4">
          <Typography variant="h6">Approve Training Plan - ID: {id}</Typography>
          <Typography variant="body2" color="textSecondary">
            This component is under development
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default ApproveTrainingPlan;
