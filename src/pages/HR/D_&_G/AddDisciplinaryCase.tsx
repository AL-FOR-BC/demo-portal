import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useDisciplinaryCases } from "./hooks/useDisciplinaryCases";

const AddDisciplinaryCase: React.FC = () => {
  const navigate = useNavigate();
  const { createDisciplinaryCase, getFormFields } = useDisciplinaryCases({
    mode: "add",
  });

  const handleSubmit = async () => {
    try {
      await createDisciplinaryCase();
    } catch (error) {
      // Error is already handled in createDisciplinaryCase
    }
  };

  return (
    <HeaderMui
      title="Disciplinary Case"
      subtitle="Disciplinary Case"
      breadcrumbItem="Add Disciplinary Case"
      fields={getFormFields()}
      isLoading={false}
      handleBack={() => navigate("/disciplinary-cases")}
      handleSubmit={handleSubmit}
      pageType="add"
      lines={
        <div className="alert alert-info mb-3">
          <i className="bx bx-info-circle me-2"></i>
          <strong>Required Fields:</strong> Please ensure all fields marked with
          (*) are filled before creating the Disciplinary Case. Required fields:
          Disciplinary Category, Case Description, G/D Code, Employee No,
          Incident Date, and Date Raised.
        </div>
      }
    />
  );
};

export default AddDisciplinaryCase;
