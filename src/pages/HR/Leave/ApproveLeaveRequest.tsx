import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useLeaveDocument } from "../../../hooks/documents/useLeaveDocument";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../store/hook";
import { useEffect } from "react";

const ApproveLeaveRequest = () => {
  const navigate = useNavigate();
  const { state, formData, getFormFields, populateDocument } = useLeaveDocument(
    {
      mode: "approve",
    }
  );
  const { id } = useParams();
  const { companyId } = useAppSelector((state) => state.auth.session);

  useEffect(() => {
    if (id) {
      populateDocument(undefined, id);
    }
  }, []);
  return (
    <HeaderMui
      title="Approve Leave Request"
      subtitle="Approve Leave Request"
      breadcrumbItem="Leave Request"
      isLoading={state.isLoading}
      handleBack={() => navigate("/approvals")}
      requestNo={formData.documentNo}
      companyId={companyId}
      tableId={50350}
      pageType="approval"
      status={formData.status}
      documentType="Leave Request"
      fields={getFormFields()}
    />
  );
};

export default ApproveLeaveRequest;
