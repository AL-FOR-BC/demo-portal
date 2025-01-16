import { useNavigate, useParams } from "react-router-dom";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { useLeaveDocument } from "../../../hooks/documents/useLeaveDocument";
import { useEffect } from "react";
import { useAppSelector } from "../../../store/hook";

function LeaveRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { email } = useAppSelector((state) => state.auth.user);

  const {
    getFormFields,
    populateDocument,
    state,
    formData,
    deleteLeaveRequest,
    sendLeaveRequestForApproval,
    cancelLeaveRequest,
    // submitLeaveRequest,
  } = useLeaveDocument({ mode: "detail" });

  useEffect(() => {
    if (id) {
      populateDocument(id);
    }
  }, [id]);

  return (
    <HeaderMui
      title="Leave Request Detail"
      subtitle="Leave Request Detail"
      breadcrumbItem="Leave Request"
      isLoading={state.isLoading}
      handleBack={() => navigate("/leave-requests")}
      handleDelete={() => {
        if (id) {
          deleteLeaveRequest(id);
        }
      }}
      handleSendApprovalRequest={() => {
        if (formData.documentNo) {
          sendLeaveRequestForApproval(formData.documentNo, email);
        }
      }}
      handleCancelApprovalRequest={() => {
        if (formData.documentNo) {
          cancelLeaveRequest(formData.documentNo);
        }
      }}
      requestNo={formData.documentNo}
      companyId={companyId}
      tableId={50350}
      pageType="detail"
      status={formData.status}
      documentType="Leave Request"
      fields={getFormFields()}
    />
  );
}

export default LeaveRequestDetail;
