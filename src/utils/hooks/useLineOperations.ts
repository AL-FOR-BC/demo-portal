import { toast } from "react-toastify";
import { getErrorMessage } from "../common";
import Swal from "sweetalert2";

interface LineOperationsConfig {
  companyId: string;
  deleteLineApi: (
    companyId: string,
    systemId: string,
    etag: string
  ) => Promise<any>;
  populateData: () => Promise<any>;
}

export const useLineOperations = ({
  companyId,
  deleteLineApi,
  populateData,
}: LineOperationsConfig) => {
  const deleteAllLines = async (lines: any[]) => {
    try {
      for (const line of lines) {
        await deleteLineApi(companyId, line.systemId, line["@odata.etag"]);
      }
      await populateData();
      toast.success("All lines deleted successfully");
      return true;
    } catch (error) {
      toast.error(
        `Error deleting lines: ${getErrorMessage((error as Error).message)}`
      );

      return false;
    }
  };

  const confirmAndDeleteAllLines = async (
    lines: any[],
    onSuccess: () => void,
    customMessage?: string
  ) => {
    if (lines.length === 0) {
      if (onSuccess) onSuccess();
      return true;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text:
        customMessage ||
        "This will delete all existing lines. This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete all lines!",
    });

    if (result.isConfirmed) {
      const success = await deleteAllLines(lines);
      if (success && onSuccess) {
        onSuccess();
      }
      return success;
    }

    return false;
  };
  return {
    confirmAndDeleteAllLines,
    deleteAllLines,
  };
};
