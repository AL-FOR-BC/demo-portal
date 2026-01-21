import { useEffect } from "react";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useNavigate } from "react-router-dom";
import { useExitInterview } from "./hooks/useExitInterview";

function AddExitInterview() {
  const navigate = useNavigate();
  const { populateDocument, submitExitInterview, getFormFields } =
    useExitInterview({ mode: "add" });

  useEffect(() => {
    populateDocument();
  }, []);

  const handleSubmit = async () => {
    const success = await submitExitInterview();
    if (success) {
      navigate("/exit-interviews");
    }
  };

  return (
    <HeaderMui
      title="Exit Interview"
      subtitle="Exit Interview"
      breadcrumbItem="Add Exit Interview"
      fields={getFormFields()}
      isLoading={false}
      handleBack={() => navigate("/exit-interviews")}
      handleSubmit={handleSubmit}
      pageType="add"
    />
  );
}

export default AddExitInterview;
