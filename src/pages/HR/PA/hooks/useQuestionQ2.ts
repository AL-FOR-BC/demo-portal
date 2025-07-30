import { useEffect, useState } from "react";
import { fetchQuestionQ2 } from "../../../../services/QuestionQ2Service";
import { QuestionQ2 } from "../../../../@types/questionQ2.dto";

export function useQuestionQ2(
  companyId: string | undefined,
  documentNo: string | undefined
) {
  const [data, setData] = useState<QuestionQ2[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!companyId || !documentNo) return;
    setLoading(true);
    fetchQuestionQ2(companyId, documentNo)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId, documentNo, refreshKey]);

  return { data, loading, refresh };
}
