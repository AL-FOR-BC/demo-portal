import BcApiService from "./BcApiServices";
import { BehaviorsPersonalStyle } from "../@types/behaviorsPersonalStyle.dto";

export async function fetchBehaviorsPersonalStyle(
  companyId: string,
  documentNo: string
): Promise<BehaviorsPersonalStyle[]> {
  const filter = `$filter=documentNo eq '${documentNo}'`;
  const res = await BcApiService.fetchData<{ value: BehaviorsPersonalStyle[] }>(
    {
      url: `/api/hrpsolutions/hrmis/v2.0/behaviorsPersonalStyle?Company=${companyId}&${filter}`,
      method: "get",
    }
  );
  return res.data.value;
}

export async function updateBehaviorsPersonalStyle(
  companyId: string,
  systemId: string,
  data: Partial<BehaviorsPersonalStyle>
): Promise<any> {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/hrmis/v2.0/behaviorsPersonalStyle(${systemId})?Company=${companyId}`,
    method: "PATCH",
    data,
    headers: {
      "If-Match": "*",
    },
  });
}
