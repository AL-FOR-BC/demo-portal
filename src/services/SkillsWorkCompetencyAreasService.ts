import BcApiService from "./BcApiServices";
import { SkillsWorkCompetencyAreas } from "../@types/skillsWorkCompetencyAreas.dto";

export async function fetchSkillsWorkCompetencyAreas(
  companyId: string,
  documentNo: string
): Promise<SkillsWorkCompetencyAreas[]> {
  const filter = `$filter=documentNo eq '${documentNo}'`;
  const res = await BcApiService.fetchData<{
    value: SkillsWorkCompetencyAreas[];
  }>({
    url: `/api/hrpsolutions/hrmis/v2.0/skillsWorkCompetencyAreas?Company=${companyId}&${filter}`,
    method: "get",
  });
  return res.data.value;
}

export async function updateSkillsWorkCompetencyAreas(
  companyId: string,
  systemId: string,
  data: Partial<SkillsWorkCompetencyAreas>
): Promise<any> {
  return BcApiService.fetchData<any>({
    url: `/api/hrpsolutions/hrmis/v2.0/skillsWorkCompetencyAreas(${systemId})?Company=${companyId}`,
    method: "PATCH",
    data,
    headers: {
      "If-Match": "*",
    },
  });
}
