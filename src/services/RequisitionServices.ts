import BcApiService from "./BcApiServices.ts";
import {
  PurchaseRequisitionHeader,
  PurchaseRequisitionLinesResponse,
  PurchaseRequisitionLinesSingleResponse,
  PurchaseRequisitionLinesSubmitData,
  PurchaseRequisitionResponse,
  PurchaseRequisitionType,
  PurchaseRequisitionUpdateData,
} from "../@types/purchaseReq.dto.ts";
import {
  PaymentRequisition,
  PaymentRequisitionHeader,
  PaymentRequisitionLinesResponse,
  PaymentRequisitionResponse,
  PaymentRequisitionUpdateData,
  PaymentRequistionLinesSubmitData,
} from "../@types/paymentReq.dto.ts";
// import {
//   StoreRequisitionHeader,
//   StoreRequisitionLinesResponse,
//   StoreRequisitionLinesSingleResponse,
//   StoreRequisitionLinesSubmitData,
//   StoreRequisitionResponse,
//   StoreRequisitionType,
//   StoreRequisitionUpdateData,
// } from "../@types/storeReq.dto.ts";

// ----------------------- purchase requisitions ---------------------------------------------
export async function apiPurchaseRequisition(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  filterQuery?: string,
  data?: any,
  systemId?: string,
  etag?: string
) {
  if (method === "PATCH" || method === "DELETE") {
    return BcApiService.fetchData<PurchaseRequisitionResponse>({
      url: `/api/hrpsolutions/procuretopay/v2.0/purchaseRequisitionHeaders(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  } else {
    return BcApiService.fetchData<PurchaseRequisitionResponse>({
      url: `/api/hrpsolutions/procuretopay/v2.0/purchaseRequisitionHeaders?Company=${companyId}&${filterQuery}`,
      method,
      data,
    });
  }
}

export async function apiPurchaseRequisitionLines(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: PurchaseRequisitionLinesSubmitData,
  systemId?: string,
  etag?: string,
  filterQuery?: string
) {
  if (method === "PATCH" || "DELETE") {
    return BcApiService.fetchData<PurchaseRequisitionLinesResponse>({
      url: `/api/hrpsolutions/procuretopay/v2.0/purchaseRequisitionLines(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  }
  return BcApiService.fetchData<PurchaseRequisitionLinesResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/purchaseRequisitionLines?Company=${companyId}&${filterQuery}`,
    method,
    data,
  });
}

export async function apiCreatePurchaseRequisitionLines(
  companyId: string,
  data: PurchaseRequisitionLinesSubmitData
) {
  return BcApiService.fetchData<PurchaseRequisitionLinesResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/purchaseRequisitionLines?Company=${companyId}`,
    method: "post",
    data,
  });
}

export async function apiCreatePurchaseRequisition(
  companyId: string,
  data: PurchaseRequisitionType
) {
  return BcApiService.fetchData<PurchaseRequisitionHeader>({
    url: `/api/hrpsolutions/procuretopay/v2.0/purchaseRequisitionHeaders?Company=${companyId}`,
    method: "post",
    data,
  });
}

export async function apiPurchaseRequisitionDetail(
  companyId: string,
  id: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<PurchaseRequisitionLinesSingleResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/purchaseRequisitionHeaders(${id})?Company=${companyId}&${filterQuery}`,
  });
}

// ----------------------- payment requisitions ---------------------------------------------

export async function apiPaymentRequisition(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  filterQuery?: string,
  data?: any,
  systemId?: string,
  etag?: string
) {
  if (method === "PATCH" || method === "DELETE") {
    return BcApiService.fetchData<PaymentRequisitionResponse>({
      url: `/api/hrpsolutions/procuretopay/v2.0/paymentRequestHeaders(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  } else {
    return BcApiService.fetchData<PaymentRequisitionResponse>({
      url: `/api/hrpsolutions/procuretopay/v2.0/paymentRequestHeaders?Company=${companyId}&${filterQuery}`,
      method: "get",
    });
  }
}

export async function apiPaymentRequisitionDetail(
  companyId: string,
  id: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<PaymentRequisition>({
    url: `/api/hrpsolutions/procuretopay/v2.0/paymentRequestHeaders(${id})?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiCreatePaymentRequisition(
  companyId: string,
  data: any
) {
  return BcApiService.fetchData<PaymentRequisitionHeader>({
    url: `/api/hrpsolutions/procuretopay/v2.0/paymentRequestHeaders?Company=${companyId}`,
    method: "post",
    data,
  });
}

export async function apiCreatePaymentRequisitionLines(
  companyId: string,
  data: PaymentRequistionLinesSubmitData
) {
  return BcApiService.fetchData<PaymentRequisitionLinesResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/paymentRequestLines?Company=${companyId}`,
    method: "post",
    data,
  });
}

export async function apiPaymentRequisitionLines(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: PaymentRequistionLinesSubmitData,
  systemId?: string,
  etag?: string,
  filterQuery?: string
) {
  if (method === "PATCH" || "DELETE") {
    return BcApiService.fetchData<PaymentRequisitionResponse>({
      url: `/api/hrpsolutions/procuretopay/v2.0/paymentRequestLines(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  }
  return BcApiService.fetchData<PaymentRequisitionLinesResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/paymentRequestLines?Company=${companyId}&${filterQuery}`,
    method,
    data,
  });
}

export async function apiUpdatePaymentRequisition(
  companyId: string,
  id: string,
  data: Partial<PaymentRequisitionUpdateData>,
  etag: string
) {
  return BcApiService.fetchData<PaymentRequisitionResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/paymentRequestHeaders(${id})?Company=${companyId}`,
    method: "PATCH",
    data,
    headers: {
      "If-Match": etag,
    },
  });
}

export async function apiUpdatePurchaseRequisition(
  companyId: string,
  id: string,
  data: Partial<PurchaseRequisitionUpdateData>,
  etag: string
) {
  return BcApiService.fetchData<PurchaseRequisitionResponse>({
    url: `/api/hrpsolutions/procuretopay/v2.0/purchaseRequisitionHeaders(${id})?Company=${companyId}`,
    method: "PATCH",
    data,
    headers: {
      "If-Match": etag,
    },
  });
}

// ----------------------------------- stores requisitions -------------------------------------
export async function apiStoreRequisition(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  filterQuery?: string,
  data?: any,
  systemId?: string,
  etag?: string
) {
  if (method === "PATCH" || method === "DELETE") {
    return BcApiService.fetchData<any>({
      url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  } else {
    return BcApiService.fetchData<any>({
      url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests?Company=${companyId}&${filterQuery}`,
      method,
      data,
    });
  }
}

export async function apiStoreRequisitionDetail(
  companyId: string,
  id: string,
  filterQuery?: string
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests(${id})?Company=${companyId}&${filterQuery}`,
  });
}

export async function apiCreateStoreRequisition(
  companyId: string,
  data: any
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests?Company=${companyId}`,
    method: "post",
    data,
  });
}

export async function apiStoreRequisitionLines(
  companyId: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: any,
  systemId?: string,
  etag?: string,
  filterQuery?: string
) {
  if (method === "PATCH" || method === "DELETE") {
    return BcApiService.fetchData<any>({
      url: `/api/hrpsolutions/procuretopay/v2.0/storeRequisitionLines(${systemId})?Company=${companyId}&${filterQuery}`,
      method,
      data,
      headers: {
        "If-Match": etag,
      },
    });
  }
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/storeRequisitionLines?Company=${companyId}&${filterQuery}`,
    method,
    data,
  });
}

export async function apiCreateStoreRequisitionLines(
  companyId: string,
  data: any
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/storeRequisitionLines?Company=${companyId}`,
    method: "post",
    data,
  });
}

export async function apiUpdateStoreRequisition(
  companyId: string,
  id: string,
  data: any,
  etag: string
) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests(${id})?Company=${companyId}`,
    method: "PATCH",
    data,
    headers: {
      "If-Match": etag,
    },
  });
}