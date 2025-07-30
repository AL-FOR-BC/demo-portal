import { useEffect, useState } from "react";
import { fetchMobilityPreference } from "../../../../services/MobilityPreferenceService";
import { MobilityPreference } from "../../../../@types/mobilityPreference.dto";

export function useMobilityPreference(
  companyId: string | undefined,
  documentNo: string | undefined
) {
  const [data, setData] = useState<MobilityPreference[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!companyId || !documentNo) return;
    setLoading(true);
    fetchMobilityPreference(companyId, documentNo)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId, documentNo, refreshKey]);

  return { data, loading, refresh };
}
