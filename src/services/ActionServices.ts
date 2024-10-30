import BcApiService from "./BcApiServices";

export async function apiSendForApproval(companyId: string, data: any, link: string) {
  return BcApiService.fetchData<any>({
    url: `/ODataV4/ProcuretoPayActions_${link}?Company=${companyId}`,
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}


export async function apiCancelApproval(companyId: string, data: any, action: string) {
  return BcApiService.fetchData<any>({
    url: `/ODataV4/ProcuretoPayActions_${action}?Company=${companyId}`,
    method: "post",
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
}