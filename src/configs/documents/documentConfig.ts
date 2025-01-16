import {
  BaseDocumentConfig,
  DocumentType,
} from "../../@types/documents/base.types";

export const DOCUMENT_CONFIG: Record<DocumentType, BaseDocumentConfig> = {
  leave: {
    type: "leave",
    apiEndpoints: {
      detail: "leaveRequestDetail",
      lines: "leaveRequestLines",
      approve: "leaveHeaderApprovalReq",
      list: "leaveRequests",
    },
    tableId: 50135,
    navigationPaths: {
      list: "/leave-requests",
      approvals: "/approvals",
    },
  },
  purchase: {
    type: "purchase",
    apiEndpoints: {
      detail: "purchaseRequestDetail",
      lines: "purchaseRequestLines",
      approve: "purchaseHeaderApprovalReq",
      list: "purchaseRequests",
    },
    tableId: 50135,
    navigationPaths: {
      list: "/purchase-requests",
      approvals: "/approvals",
    },
  },
  payment: {
    type: "payment",
    apiEndpoints: {
      detail: "paymentRequestDetail",
      lines: "paymentRequestLines",
      approve: "paymentHeaderApprovalReq",
      list: "paymentRequests",
    },
    tableId: 50135,
    navigationPaths: {
      list: "/payment-requests",
      approvals: "/approvals",
    },
  },
  travel: {
    type: "travel",
    apiEndpoints: {
      detail: "travelRequestDetail",
      lines: "travelRequestLines",
      approve: "travelHeaderApprovalReq",
      list: "travelRequests",
    },
    tableId: 50135,
    navigationPaths: {
      list: "/travel-requests",
      approvals: "/approvals",
    },
  },
  store: {
    type: "store",
    apiEndpoints: {
      detail: "storeRequestDetail",
      lines: "storeRequestLines",
      approve: "storeHeaderApprovalReq",
      list: "storeRequests",
    },
    tableId: 50135,
    navigationPaths: {
      list: "/store-requests",
      approvals: "/approvals",
    },
  },
};
