
import BcApiService from "./BcApiServices.ts";
import {EmployeeData} from "../@types/employee.dto.ts";
interface response{
    '@odata.context': string;
    value: EmployeeData[];
}

export async function employees(companyId: string, filterQuery?:string){
    return BcApiService.fetchData<response>({
        url: `/api/hrpsolutions/hrmis/v2.0/employees?Company=${companyId}&${filterQuery}`,
    })
}