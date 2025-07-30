import { useEffect, useState } from "react";
import { fetchAspirations } from "../../../../services/AspirationsService";
import { Aspirations } from "../../../../@types/aspirations.dto";

export function useAspirations(
  companyId: string | undefined,
  documentNo: string | undefined
) {
  const [data, setData] = useState<Aspirations[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!companyId || !documentNo) return;
    setLoading(true);
    fetchAspirations(companyId, documentNo)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId, documentNo, refreshKey]);

  return { data, loading, refresh };
}
