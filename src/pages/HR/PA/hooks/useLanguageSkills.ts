import { useEffect, useState } from "react";
import { fetchLanguageSkills } from "../../../../services/LanguageSkillsService";
import { LanguageSkills } from "../../../../@types/languageSkills.dto";

export function useLanguageSkills(
  companyId: string | undefined,
  documentNo: string | undefined
) {
  const [data, setData] = useState<LanguageSkills[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!companyId || !documentNo) return;
    setLoading(true);
    fetchLanguageSkills(companyId, documentNo)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId, documentNo, refreshKey]);

  return { data, loading, refresh };
}
