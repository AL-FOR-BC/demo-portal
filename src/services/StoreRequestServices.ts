// import { StoreRequisitionSubmitData } from "../@types/storeReq.dto";
import BcApiService from "./BcApiServices";

export async function apiCreateStoreRequest(companyId: string, data: any) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests?Company=${companyId}`,
    method: "post",
    data: data as Record<string, unknown>,
    
  });
}

export async function apiGetStoreRequest(companyId: string, filterQuery: string) {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/procuretopay/v2.0/StoreRequests?Company=${companyId}&${filterQuery}`,
    method: "get",
  });
}

