import BcApiService from "./BcApiServices";

const BASE_URL = '/api/hrpsolutions/hrmis/v2.0';

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

    addTimeSheetDetails: (companyId: string, data: any) => {
        return BcApiService.fetchData<any>({
            url: `${BASE_URL}/timeSheetDetails?Company=${companyId}`,
            method: "post",
            data,
        });
    },

    getTimeSheetHeader: (companyId: string, filterQuery: string) => {
        return BcApiService.fetchData<any>({
            url: `${BASE_URL}/timeSheetHeader?Company=${companyId}&${filterQuery}`,
            method: "get",
        });
    },
    
    getTimeSheetHeaderById: (companyId: string, id: string, filterQuery?: string) => {
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

    updateTimeSheetLines: (companyId: string, systemId: string, data: any, filterQuery: string) => {
        return BcApiService.fetchData<any>({
            url: `${BASE_URL}/timeSheetLines(${systemId})?Company=${companyId}&${filterQuery}`,
            method: "patch",
            data,
            headers: {
                "If-Match": "*",
            },
        });
    },

    updateTimeSheetDetails: (companyId: string, id: string, data: any, filterQuery: string) => {
        return BcApiService.fetchData<any>({
            url: `${BASE_URL}/timeSheetDetails(${id})?Company=${companyId}&${filterQuery}`,
            method: "put",
            data,
        });
    }
};