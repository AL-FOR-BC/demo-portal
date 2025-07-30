import BcApiService from "./BcApiServices";
import { QuestionQ1 } from "../@types/questionQ1.dto";

export async function fetchQuestionQ1(
  companyId: string,
  documentNo: string
): Promise<QuestionQ1[]> {
  const filter = `$filter=documentNo eq '${documentNo}'`;
  const res = await BcApiService.fetchData<{ value: QuestionQ1[] }>({
    url: `/api/hrpsolutions/hrmis/v2.0/questionQ1?Company=${companyId}&${filter}`,
    method: "get",
  });
  return res.data.value;
}

export async function updateQuestionQ1(
  companyId: string,
  systemId: string,
  data: Partial<QuestionQ1>
): Promise<any> {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/hrmis/v2.0/questionQ1(${systemId})?Company=${companyId}`,
    method: "PATCH",
    data,
    headers: {
      "If-Match": "*",
    },
  });
}
 