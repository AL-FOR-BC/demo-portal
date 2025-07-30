import { useEffect, useState } from "react";
import { fetchQuestionQ3 } from "../../../../services/QuestionQ3Service";
import { QuestionQ3 } from "../../../../@types/questionQ3.dto";

export function useQuestionQ3(
  companyId: string | undefined,
  documentNo: string | undefined
) {
  const [data, setData] = useState<QuestionQ3[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!companyId || !documentNo) return;
    setLoading(true);
    fetchQuestionQ3(companyId, documentNo)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId, documentNo, refreshKey]);

  return { data, loading, refresh };
}
