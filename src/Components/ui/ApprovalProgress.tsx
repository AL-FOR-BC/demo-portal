import React from "react";
import { Box, Stepper, Step, StepLabel, styled } from "@mui/material";

interface ApprovalProgressProps {
  status?: string;
  hrOfficerStage?: string;
  financeStage?: string;
  adminStage?: string;
  supervisorStage?: string;
  ictStage?: string;
  headOfDepartmentStage?: string;
  hrManagerStage?: string;
}

const CustomStepper = styled(Stepper)(() => ({
  "& .MuiStepLabel-root": {
    "& .Mui-completed": {
      color: "#00c853", // vibrant green for completed
    },
    "& .Mui-active": {
      color: "#2196f3", // bright blue for active
    },
    "& .Mui-disabled": {
      color: "#9e9e9e", // medium gray for disabled
    },
    "& .MuiStepIcon-root": {
      width: "2rem",
      height: "2rem",
      transition: "all 0.3s ease",
      "&.Mui-completed": {
        color: "#00c853",
        filter: "drop-shadow(0 2px 4px rgba(0,200,83,0.2))",
        transform: "scale(1.1)",
      },
      "&.Mui-active": {
        color: "#2196f3",
        filter: "drop-shadow(0 2px 8px rgba(33,150,243,0.3))",
        transform: "scale(1.2)",
        animation: "pulse 2s infinite",
      },
      "&.Mui-disabled": {
        color: "#e0e0e0",
        border: "2px solid #9e9e9e",
        borderRadius: "50%",
      },
    },
    "& .MuiStepLabel-label": {
      marginTop: "8px",
      fontSize: "0.875rem",
      fontWeight: 500,
      transition: "all 0.3s ease",
      "&.Mui-completed": {
        color: "#2e7d32",
        fontWeight: 600,
      },
      "&.Mui-active": {
        color: "#1976d2",
        fontWeight: 700,
        transform: "scale(1.05)",
      },
      "&.Mui-disabled": {
        color: "#757575",
      },
    },
  },
  "& .MuiStepConnector-root": {
    "& .MuiStepConnector-line": {
      borderColor: "#e0e0e0",
      borderTopWidth: "3px",
      transition: "all 0.3s ease",
    },
    "&.Mui-active": {
      "& .MuiStepConnector-line": {
        borderColor: "#2196f3",
        borderTopStyle: "solid",
      },
    },
    "&.Mui-completed": {
      "& .MuiStepConnector-line": {
        borderColor: "#00c853",
      },
    },
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(1.1)",
      filter: "drop-shadow(0 2px 4px rgba(33,150,243,0.2))",
    },
    "50%": {
      transform: "scale(1.2)",
      filter: "drop-shadow(0 2px 8px rgba(33,150,243,0.4))",
    },
    "100%": {
      transform: "scale(1.1)",
      filter: "drop-shadow(0 2px 4px rgba(33,150,243,0.2))",
    },
  },
}));

const ApprovalProgress: React.FC<ApprovalProgressProps> = ({
  hrOfficerStage,
  financeStage,
  adminStage,
  supervisorStage,
  ictStage,
  headOfDepartmentStage,
  hrManagerStage,
}) => {
  const steps = [
    { label: "Initiator", stage: hrOfficerStage },
    { label: "HR Officer", stage: hrOfficerStage },
    { label: "Finance", stage: financeStage },
    { label: "Admin", stage: adminStage },
    { label: "Supervisor", stage: supervisorStage },
    { label: "IT", stage: ictStage },
    { label: "Head of Department", stage: headOfDepartmentStage },
    { label: "HR Manager", stage: hrManagerStage },
  ];

  // Debug logging to understand the stages
  console.log("Progress Bar Stages:", {
    hrOfficerStage,
    supervisorStage,
    headOfDepartmentStage,
    financeStage,
    adminStage,
    ictStage,
    hrManagerStage,
  });

  // When document is in Pending Approval, the Initiator step should be considered completed
  const pendingSteps = steps.filter(
    (step) => step.stage === "Pending Clearance" && step.label !== "Initiator"
  );

  const clearedSteps = steps.filter(
    (step) =>
      step.stage === "Cleared" ||
      (step.label === "Initiator" && step.stage === "Pending Clearance")
  );

  // Debug logging for step states
  console.log("Step States:", {
    totalSteps: steps.length,
    pendingSteps: pendingSteps.length,
    clearedSteps: clearedSteps.length,
    pendingStages: pendingSteps.map((s) => s.label),
    clearedStages: clearedSteps.map((s) => s.label),
  });

  // Count completed steps
  const completedCount = clearedSteps.length;

  return (
    <Box sx={{ width: "100%", mb: 4 }}>
      <CustomStepper alternativeLabel activeStep={completedCount}>
        {steps.map((step, index) => {
          // Handle undefined stages as not started
          const stage = step.stage || "";
          const isInitiator = step.label === "Initiator";
          const isCompleted =
            stage === "Cleared" ||
            (isInitiator && stage === "Pending Clearance");
          const isPending = stage === "Pending Clearance" && !isInitiator;
          const isActive = isPending;

          return (
            <Step key={index} completed={isCompleted} active={isActive}>
              <StepLabel
                error={false}
                optional={null}
                sx={{
                  "& .MuiStepLabel-label": {
                    color: isActive
                      ? "#1976d2 !important"
                      : isCompleted
                      ? "#2e7d32 !important"
                      : "inherit",
                    fontWeight: isActive
                      ? "600 !important"
                      : isCompleted
                      ? "500 !important"
                      : "inherit",
                  },
                  "& .MuiStepIcon-root": {
                    color: isActive
                      ? "#1976d2 !important"
                      : isCompleted
                      ? "#2e7d32 !important"
                      : "#bdbdbd",
                    transform: isActive ? "scale(1.2)" : "scale(1)",
                    transition: "transform 0.3s ease",
                  },
                  "& .MuiStepIcon-text": {
                    fill: isActive || isCompleted ? "#fff" : "#757575",
                  },
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </CustomStepper>
    </Box>
  );
};

export default ApprovalProgress;
