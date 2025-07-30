import { useEffect, useState } from "react";
import { fetchBehaviorsPersonalStyle } from "../../../../services/BehaviorsPersonalStyleService";
import { BehaviorsPersonalStyle } from "../../../../@types/behaviorsPersonalStyle.dto";

export function useBehaviorsPersonalStyle(
  companyId: string | undefined,
  documentNo: string | undefined
) {
  const [data, setData] = useState<BehaviorsPersonalStyle[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!companyId || !documentNo) return;
    setLoading(true);
    fetchBehaviorsPersonalStyle(companyId, documentNo)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId, documentNo, refreshKey]);

  return { data, loading, refresh };
}
