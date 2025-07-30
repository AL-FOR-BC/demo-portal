import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../Components/ui/Header/Header";
import { useIPA } from "./hooks/useIPA";

function AddIPA() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { getFormFields, submitIPA } = useIPA({ mode: "add" });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await submitIPA();
    } catch (error) {
      toast.error(`Error Adding IPA: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Header
      title="Add IPA"
      subtitle="Individual Performance Agreement"
      breadcrumbItem="IPA"
      fields={getFormFields()}
      isLoading={isLoading}
      pageType="add"
      handleSubmit={handleSubmit}
      handleBack={() => navigate("/individual-performance-appraisal")}
    />
  );
}

export default AddIPA;
