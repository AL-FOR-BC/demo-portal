import { useEffect, useState } from "react";
import { fetchCareerMoveOptions } from "../../../../services/CareerMoveOptionsService";
import { CareerMoveOptions } from "../../../../@types/careerMoveOptions.dto";

export function useCareerMoveOptions(
  companyId: string | undefined,
  documentNo: string | undefined
) {
  const [data, setData] = useState<CareerMoveOptions[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!companyId || !documentNo) return;
    setLoading(true);
    fetchCareerMoveOptions(companyId, documentNo)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId, documentNo, refreshKey]);

  return { data, loading, refresh };
}
