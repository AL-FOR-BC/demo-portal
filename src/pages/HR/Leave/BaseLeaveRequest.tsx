// import { LeaveDocumentState } from "@/types/documents/leave.types";

import HeaderMui from "../../../Components/ui/Header/HeaderMui";

function BaseLeaveRequest() {
  return (
    <HeaderMui
      title="Leave Request"
      subtitle="Leave Request"
      breadcrumbItem={"Leave Request"}
      isLoading={state.isLoading}
      fields={[]}
      isLoading={false}
    />
  );
}

export default BaseLeaveRequest;
