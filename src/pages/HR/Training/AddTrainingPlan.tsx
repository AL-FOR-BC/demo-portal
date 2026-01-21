import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useTrainingPlanDocument } from "../../../hooks/documents/useTrainingPlanDocument";

const AddTrainingPlan: React.FC = () => {
  const navigate = useNavigate();
  const { state, populateDocument, submitTrainingPlan, getFormFields } =
    useTrainingPlanDocument({ mode: "add" });

  useEffect(() => {
    populateDocument();
  }, []);

  return (
    <div>
      <HeaderMui
        title="Add Training Plan"
        subtitle="Add Training Plan"
        breadcrumbItem="Add Training Plan"
        fields={getFormFields()}
        isLoading={state.isLoading}
        pageType="add"
        handleBack={() => navigate("/training-plans")}
        handleSubmit={submitTrainingPlan}
      />
    </div>
  );
};

export default AddTrainingPlan;
