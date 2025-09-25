import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useGrievanceCases } from "./hooks/useGrievanceCases";

const AddGrievanceCase: React.FC = () => {
  const navigate = useNavigate();
  const { createGrievanceCase, getFormFields } = useGrievanceCases({
    mode: "add",
  });

  const handleSubmit = async () => {
    try {
      await createGrievanceCase();
    } catch (error) {
      // Error is already handled in createGrievanceCase
    }
  };

  return (
    <HeaderMui
      title="Grievance Case"
      subtitle="Grievance Case"
      breadcrumbItem="Add Grievance Case"
      fields={getFormFields()}
      isLoading={false}
      handleBack={() => navigate("/grievances")}
      handleSubmit={handleSubmit}
      pageType="add"
      lines={
        <div className="alert alert-info mb-3">
          <i className="bx bx-info-circle me-2"></i>
          <strong>Required Fields:</strong> Please ensure all fields marked with
          (*) are filled before creating the Grievance Case. Required fields:
          Grievance Category, Case Description, G/D Code, Employee No, Incident
          Date, and Date Raised.
        </div>
      }
    />
  );
};

export default AddGrievanceCase;
