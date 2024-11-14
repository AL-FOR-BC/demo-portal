import BcApiService from "./BcApiServices";

export async function apiSendForApproval(
  companyId: string,
  data: any,
  link: string
) {
  return BcApiService.fetchData<any>({
    url: `/ODataV4/ProcuretoPayActions_${link}?Company=${companyId}`,
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function apiCancelApproval(
  companyId: string,
  data: any,
  action: string
) {
  return BcApiService.fetchData<any>({
    url: `/ODataV4/ProcuretoPayActions_${action}?Company=${companyId}`,
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// -------------------------------------- Approval Actions --------------------------------------

// export async function apiApprovalRequest(
//   companyId: string,
//   filterQuery?: string,
//   data?: any
// ) {
//   return BcApiService.fetchData<any>({
//     url: `/ODataV4/ODataV4/HRMISActions_ApproveRequest?Company=${companyId}&${filterQuery}`,
//     method: "post",
//     data,
//   });
// }


export async function apiRejectApprovalRequest(
  companyId: string,
  data?: any,
  filterQuery?: string
) {
  return BcApiService.fetchData<any>({
    url: `/ODataV4/HRMISActions_RejectNFLApprovalRequest?Company=${companyId}&${filterQuery}`,
    method: "post",
    data,
  });
}


export async function apiApproveRequest(companyId: string, data: any) {
  return BcApiService.fetchData<any>({
    url: `/ODataV4/HRMISActions_ApproveRequest?Company=${companyId}`,
    method: "post",
    data,
  });
}
