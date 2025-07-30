import { useEffect, useState } from "react";
import { fetchSkillsWorkCompetencyAreas } from "../../../../services/SkillsWorkCompetencyAreasService";
import { SkillsWorkCompetencyAreas } from "../../../../@types/skillsWorkCompetencyAreas.dto";

export function useSkillsWorkCompetencyAreas(
  companyId: string | undefined,
  documentNo: string | undefined
) {
  const [data, setData] = useState<SkillsWorkCompetencyAreas[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!companyId || !documentNo) return;
    setLoading(true);
    fetchSkillsWorkCompetencyAreas(companyId, documentNo)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId, documentNo, refreshKey]);

  return { data, loading, refresh };
}
