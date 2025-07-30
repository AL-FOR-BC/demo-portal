import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../Components/ui/Header/Header";
import { usePA } from "./hooks/usePA";

function AddPA() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { getFormFields, submitPA } = usePA({ mode: "add" });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await submitPA();
    } catch (error) {
      toast.error(`Error Adding PA: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Header
      title="Add PA"
      subtitle="Performance Appraisal"
      breadcrumbItem="PA"
      fields={getFormFields()}
      isLoading={isLoading}
      pageType="add"
      handleSubmit={handleSubmit}
      handleBack={() => navigate("/performance-appraisal")}
    />
  );
}

export default AddPA;
