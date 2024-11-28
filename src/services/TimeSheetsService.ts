import BcApiService from "./BcApiServices";

const BASE_URL = "/api/hrpsolutions/hrmis/v2.0";
const BASE_URL_ACTIONS = "/ODataV4";

export const TimeSheetsService = {
  getJobs: (companyId: string) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/jobsAPI?Company=${companyId}`,
      method: "get",
    });
  },

  getJobTasks: (companyId: string, jobId: string) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/jobTasks?Company=${companyId}&JobId=${jobId}`,
      method: "get",
    });
  },

  getTimeSheetDetails: (companyId: string, filterQuery?: string) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetDetails?Company=${companyId}&${filterQuery}`,
      method: "get",
    });
  },

  getTimeSheetHeader: (companyId: string, filterQuery: string) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetHeader?Company=${companyId}&${filterQuery}`,
      method: "get",
    });
  },

  getTimeSheetHeaderById: (
    companyId: string,
    id: string,
    filterQuery?: string
  ) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetHeader(${id})?Company=${companyId}&${filterQuery}`,
      method: "get",
    });
  },


  getTimeSheetLines: (companyId: string, filterQuery: string) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetLines?Company=${companyId}&${filterQuery}`,
      method: "get",
    });
  },
  addTimeSheetLines: (companyId: string, data: any) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetLines?Company=${companyId}`,
      method: "post",
      data,
    });
  },

  addTimeSheetDetails: (companyId: string, data: any) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetDetails?Company=${companyId}`,
      method: "post",
      data,
    });
  },

  postTimeSheetDetails: (companyId: string, data: any) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetDetails?Company=${companyId}`,
      method: "post",
      data,
    });
  },


  updateTimeSheetLines: (
    companyId: string,
    systemId: string,
    data: any,
    filterQuery: string
  ) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetLines(${systemId})?Company=${companyId}&${filterQuery}`,
      method: "patch",
      data,
      headers: {
        "If-Match": "*",
      },
    });
  },

  updateTimeSheetDetails: (
    companyId: string,
    id: string,
    data: any,
    filterQuery: string
  ) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetDetails(${id})?Company=${companyId}&${filterQuery}`,
      method: "put",
      data,
      headers: {
        "If-Match": "*",
      },
    });
  },

  //*    delete time sheet line
  deleteTimeSheetDetails: (companyId: string, systemId: string) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL}/timeSheetLines(${systemId})?Company=${companyId}`,
      method: "delete",
    });
  },

  //*    reopen time sheet
  reopenTimeSheet: (companyId: string, data: any) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL_ACTIONS}/HRMISActions_reopenSubmittedTimeSheets?Company=${companyId}`,
      method: "post",
      data,
    });
  },

  //*    submit time sheet
  submitTimeSheet: (companyId: string, data: any) => {
    return BcApiService.fetchData<any>({
      url: `${BASE_URL_ACTIONS}/HRMISActions_submitTimeSheets?Company=${companyId}`,
      method: "post",
      data,
    });
  },

  // //*    approve time sheet
  // approveTimeSheet: (companyId: string, data: any) => {
  //   return BcApiService.fetchData<any>({
  //     url: `${BASE_URL_ACTIONS}/UnboundActions_approveTimeSheets?Company=${companyId}`,
  //     method: "post",
  //     data,
  //   });
  // },

  // //*    reject time sheet
  // rejectTimeSheet: (companyId: string, data: any) => {
  //   return BcApiService.fetchData<any>({
  //     url: `${BASE_URL_ACTIONS}/UnboundActions_rejectTimeSheets?Company=${companyId}`,
  //     method: "post",
  //     data,
  //   });
  // },
};
