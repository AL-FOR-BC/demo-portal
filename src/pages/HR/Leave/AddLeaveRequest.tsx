import { useEffect } from "react";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useNavigate } from "react-router-dom";

import { useLeaveDocument } from "../../../hooks/documents/useLeaveDocument";

function AddLeaveRequest() {
  const navigate = useNavigate();
  const { populateDocument, submitLeaveRequest, getFormFields } =
    useLeaveDocument({ mode: "add" });

  useEffect(() => {
    populateDocument();
  }, []);

  const handleSubmit = async () => {
    const success = await submitLeaveRequest();
    if (success) {
      navigate("/leave-requests");
    }
  };

  return (
    <HeaderMui
      title="Leave Request"
      subtitle="Leave Request"
      breadcrumbItem="Add Leave Request"
      fields={getFormFields()}
      isLoading={false}
      handleBack={() => navigate("/leave-requests")}
      handleSubmit={handleSubmit}
      pageType="add"
    />
  );
}

export default AddLeaveRequest;
