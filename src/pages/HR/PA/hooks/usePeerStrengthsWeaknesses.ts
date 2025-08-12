import { useState, useEffect } from "react";
import { peerStrengthsWeaknessesService } from "../../../../services/PeerStrengthsWeaknessesService";
import {
  PeerStrengthsWeaknesses,
  PeerStrengthsWeaknessesFormData,
} from "../../../../@types/peerStrengthsWeaknesses.dto";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../../utils/common";

export const usePeerStrengthsWeaknesses = (
  companyId: string,
  documentNo?: string
) => {
  const [data, setData] = useState<PeerStrengthsWeaknesses[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!documentNo) return;

    setLoading(true);
    setError(null);

    try {
      const filterQuery = `$filter=documentNo eq '${documentNo}'`;
      const result =
        await peerStrengthsWeaknessesService.getPeerStrengthsWeaknesses(
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
          `Error fetching peer strengths & weaknesses: ${errorMessage}`
        );
      }
      // Set empty data instead of showing error
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const createPeerStrengthsWeaknesses = async (
    strengthsWeaknessesData: PeerStrengthsWeaknessesFormData
  ) => {
    try {
      setLoading(true);
      const result =
        await peerStrengthsWeaknessesService.createPeerStrengthsWeaknesses(
          companyId,
          strengthsWeaknessesData
        );
      await fetchData(); // Refresh the data
      toast.success("Peer strengths & weaknesses created successfully");
      return result.data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(
        `Error creating peer strengths & weaknesses: ${errorMessage}`
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePeerStrengthsWeaknesses = async (
    systemId: string,
    etag: string,
    updateData: Partial<PeerStrengthsWeaknessesFormData>
  ) => {
    try {
      setLoading(true);
      const result =
        await peerStrengthsWeaknessesService.updatePeerStrengthsWeaknesses(
          companyId,
          updateData,
          systemId,
          etag
        );
      await fetchData(); // Refresh the data
      toast.success("Peer strengths & weaknesses updated successfully");
      return result.data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(
        `Error updating peer strengths & weaknesses: ${errorMessage}`
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePeerStrengthsWeaknesses = async (systemId: string) => {
    try {
      setLoading(true);
      await peerStrengthsWeaknessesService.deletePeerStrengthsWeaknesses(
        companyId,
        systemId
      );
      await fetchData(); // Refresh the data
      toast.success("Peer strengths & weaknesses deleted successfully");
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      toast.error(
        `Error deleting peer strengths & weaknesses: ${errorMessage}`
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
    create: createPeerStrengthsWeaknesses,
    update: updatePeerStrengthsWeaknesses,
    delete: deletePeerStrengthsWeaknesses,
  };
};
