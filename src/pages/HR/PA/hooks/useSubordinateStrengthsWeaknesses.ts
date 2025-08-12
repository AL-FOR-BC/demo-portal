import { useState, useEffect } from "react";
import { subordinateStrengthsWeaknessesService } from "../../../../services/SubordinateStrengthsWeaknessesService";
import {
  SubordinateStrengthsWeaknesses,
  SubordinateStrengthsWeaknessesFormData,
} from "../../../../@types/subordinateStrengthsWeaknesses.dto";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../../utils/common";

export const useSubordinateStrengthsWeaknesses = (
  companyId: string,
  documentNo?: string
) => {
  const [data, setData] = useState<SubordinateStrengthsWeaknesses[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!documentNo) return;

    setLoading(true);
    setError(null);

    try {
      const filterQuery = `$filter=documentNo eq '${documentNo}'`;
      const result =
        await subordinateStrengthsWeaknessesService.getSubordinateStrengthsWeaknesses(
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
          `Error fetching subordinate strengths & weaknesses: ${errorMessage}`
        );
      }
      // Set empty data instead of showing error
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const createSubordinateStrengthsWeaknesses = async (
    strengthsWeaknessesData: SubordinateStrengthsWeaknessesFormData
  ) => {
    try {
      setLoading(true);
      const result =
        await subordinateStrengthsWeaknessesService.createSubordinateStrengthsWeaknesses(
          companyId,
          strengthsWeaknessesData
        );
      await fetchData(); // Refresh the data
      toast.success("Subordinate strengths & weaknesses created successfully");
      return result.data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(
        `Error creating subordinate strengths & weaknesses: ${errorMessage}`
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSubordinateStrengthsWeaknesses = async (
    systemId: string,
    etag: string,
    updateData: Partial<SubordinateStrengthsWeaknessesFormData>
  ) => {
    try {
      setLoading(true);
      const result =
        await subordinateStrengthsWeaknessesService.updateSubordinateStrengthsWeaknesses(
          companyId,
          updateData,
          systemId,
          etag
        );
      await fetchData(); // Refresh the data
      toast.success("Subordinate strengths & weaknesses updated successfully");
      return result.data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(
        `Error updating subordinate strengths & weaknesses: ${errorMessage}`
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSubordinateStrengthsWeaknesses = async (systemId: string) => {
    try {
      setLoading(true);
      await subordinateStrengthsWeaknessesService.deleteSubordinateStrengthsWeaknesses(
        companyId,
        systemId
      );
      await fetchData(); // Refresh the data
      toast.success("Subordinate strengths & weaknesses deleted successfully");
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(
        `Error deleting subordinate strengths & weaknesses: ${errorMessage}`
      );
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
    create: createSubordinateStrengthsWeaknesses,
    update: updateSubordinateStrengthsWeaknesses,
    delete: deleteSubordinateStrengthsWeaknesses,
  };
};
