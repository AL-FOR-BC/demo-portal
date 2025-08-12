import { useState, useEffect } from "react";
import { trainingNeedsIdentifiedService } from "../../../../services/TrainingNeedsIdentifiedService";
import {
  TrainingNeedsIdentified,
  TrainingNeedsIdentifiedFormData,
} from "../../../../@types/trainingNeedsIdentified.dto";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../../utils/common";

export const useTrainingNeedsIdentified = (
  companyId: string,
  documentNo?: string
) => {
  const [data, setData] = useState<TrainingNeedsIdentified[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!documentNo) return;

    setLoading(true);
    setError(null);

    try {
      const filterQuery = `$filter=documentNo eq '${documentNo}'`;
      const result =
        await trainingNeedsIdentifiedService.getTrainingNeedsIdentified(
          companyId,
          filterQuery
        );

      // BaseApiService.get() returns the data directly, not wrapped in response.data
      if (result && Array.isArray(result)) {
        setData(result);
      } else {
        // Handle case where API returns empty or different structure
        setData([]);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      // Only show toast error for non-404 errors (API not found)
      if (
        !errorMessage.includes("404") &&
        !errorMessage.includes("Not Found")
      ) {
        toast.error(
          `Error fetching training needs identified: ${errorMessage}`
        );
      }
      // Set empty data instead of showing error
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const createTrainingNeedsIdentified = async (
    trainingNeedsData: TrainingNeedsIdentifiedFormData
  ) => {
    try {
      setLoading(true);
      const result =
        await trainingNeedsIdentifiedService.createTrainingNeedsIdentified(
          companyId,
          trainingNeedsData
        );
      await fetchData(); // Refresh the data
      toast.success("Training needs identified created successfully");
      return result.data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(`Error creating training needs identified: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrainingNeedsIdentified = async (
    systemId: string,
    etag: string,
    updateData: Partial<TrainingNeedsIdentifiedFormData>
  ) => {
    try {
      setLoading(true);
      const result =
        await trainingNeedsIdentifiedService.updateTrainingNeedsIdentified(
          companyId,
          updateData,
          systemId,
          etag
        );
      await fetchData(); // Refresh the data
      toast.success("Training needs identified updated successfully");
      return result.data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(`Error updating training needs identified: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrainingNeedsIdentified = async (systemId: string) => {
    try {
      setLoading(true);
      await trainingNeedsIdentifiedService.deleteTrainingNeedsIdentified(
        companyId,
        systemId
      );
      await fetchData(); // Refresh the data
      toast.success("Training needs identified deleted successfully");
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(`Error deleting training needs identified: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [documentNo]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    create: createTrainingNeedsIdentified,
    update: updateTrainingNeedsIdentified,
    delete: deleteTrainingNeedsIdentified,
  };
};
