import React from "react";
import { useNavigate } from "react-router-dom";
//
// import { useExitClearance } from "./hooks/useExitClearance";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useExitClearance } from "./hooks/useExitClearance";

const AddExitClearance: React.FC = () => {
  const navigate = useNavigate();
  const { createExitClearance, getFormFields } = useExitClearance({
    mode: "add",
  });

  const handleSubmit = async () => {
    try {
      await createExitClearance();
    } catch (error) {
      // Error is already handled in createExitClearance
    }
  };

  return (
    <HeaderMui
      title="Exit Clearance"
      subtitle="Exit Clearance"
      breadcrumbItem="Add Exit Clearance"
      fields={getFormFields()}
      isLoading={false}
      handleBack={() => navigate("/exit-clearances")}
      handleSubmit={handleSubmit}
      pageType="add"
      lines={
        <div className="alert alert-info mb-3">
          <i className="bx bx-info-circle me-2"></i>
          <strong>Required Fields:</strong> Please ensure all fields marked with
          (*) are filled before creating the Exit Clearance. Required fields:
          Employee No, End of services with ROM, Exit Type, Handover Date, and
          Operational Site.
        </div>
      }
    />
  );
};

export default AddExitClearance;
