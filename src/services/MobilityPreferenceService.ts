import BcApiService from "./BcApiServices";
import { MobilityPreference } from "../@types/mobilityPreference.dto";

export async function fetchMobilityPreference(
  companyId: string,
  documentNo: string
): Promise<MobilityPreference[]> {
  const filter = `$filter=documentNo eq '${documentNo}'`;
  const res = await BcApiService.fetchData<{ value: MobilityPreference[] }>({
    url: `/api/hrpsolutions/hrmis/v2.0/mobilityPreference?Company=${companyId}&${filter}`,
    method: "get",
  });
  return res.data.value;
}

export async function updateMobilityPreference(
  companyId: string,
  systemId: string,
  data: Partial<MobilityPreference>
): Promise<any> {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/hrmis/v2.0/mobilityPreference(${systemId})?Company=${companyId}`,
    method: "PATCH",
    data,
    headers: {
      "If-Match": "*",
    },
  });
}
