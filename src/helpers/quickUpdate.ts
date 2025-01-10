/**
 * Interface for the quick update function
 * @interface QuickUpdateParams
 */

import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/common";

interface QuickUpdateParams {
  companyId: string;
  id: string;
  apiService: (
    companyId: string,
    method: "GET" | "PATCH" | "DELETE",
    data: any,
    id: string,
    etag: string
  ) => Promise<any>;
  data: Record<string, any>;
  successMessage: string;
  errorMessage: string;
  onSucesss: () => void;
  onError: (error: any) => void;
}
export const quickUpdate = async ({
  companyId,
  id,
  apiService,
  data,
  successMessage,
  errorMessage,
  onSucesss,
  onError,
}: QuickUpdateParams) => {
  try {
    // making API CALL
    const response = await apiService(companyId, "PATCH", data, id, "*");
    if (response.status === 200) {
      toast.success(successMessage);
      onSucesss?.();
      return true;
    }
  } catch (error) {
    toast.error(getErrorMessage(error) || errorMessage);
    onError?.(error);
    return false;
  }
};
