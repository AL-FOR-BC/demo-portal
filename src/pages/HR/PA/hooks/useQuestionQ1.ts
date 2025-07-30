import { useEffect, useState } from "react";
import { fetchQuestionQ1 } from "../../../../services/QuestionQ1Service";
import { QuestionQ1 } from "../../../../@types/questionQ1.dto";

export function useQuestionQ1(
  companyId: string | undefined,
  documentNo: string | undefined
) {
  const [data, setData] = useState<QuestionQ1[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!companyId || !documentNo) return;
    setLoading(true);
    fetchQuestionQ1(companyId, documentNo)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId, documentNo, refreshKey]);

  return { data, loading, refresh };
}
