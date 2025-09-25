import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../store/hook";
import { grievanceLinesService } from "../../../../services/GrievanceLinesService";
import {
  GrievanceLine,
  GrievanceLineFormData,
  GrievanceLineFormUpdate,
} from "../../../../@types/grievanceLines.dto";
import { getErrorMessage } from "../../../../utils/common";

type DocumentTypeMode = "add" | "edit" | "view" | "approve";

interface UseGrievanceLinesProps {
  mode: DocumentTypeMode;
  systemId?: string;
  issueNo?: string; // Filter by issue number
}

export const useGrievanceLines = ({
  mode,
  systemId,
  issueNo,
}: UseGrievanceLinesProps) => {
  const { companyId } = useAppSelector((state) => state.auth.session);

  const [state, setState] = useState<{
    isLoading: boolean;
    grievanceLines: GrievanceLine[];
    grievanceLine: GrievanceLine | null;
    error: string | null;
  }>({
    isLoading: false,
    grievanceLines: [],
    grievanceLine: null,
    error: null,
  });

  const [formData, setFormData] = useState<GrievanceLineFormData>({
    lineNo: 0,
    issueNo: issueNo || "",
    entryType: "",
    description: "",
  });

  const isFieldDisabled = mode === "view" || mode === "approve";

  useEffect(() => {
    if (mode === "add" && issueNo) {
      setFormData((prev) => ({
        ...prev,
        issueNo: issueNo,
      }));
    } else if (systemId) {
      fetchGrievanceLine();
    }
  }, [mode, systemId, issueNo, companyId]);

  useEffect(() => {
    if (issueNo) {
      fetchGrievanceLines();
    }
  }, [issueNo, companyId]);

  const fetchGrievanceLines = async () => {
    if (!issueNo) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const filterQuery = `$filter=issueNo eq '${issueNo}'`;
      const data = await grievanceLinesService.getGrievanceLines(
        companyId,
        filterQuery
      );
      setState((prev) => ({ ...prev, grievanceLines: data, isLoading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
        isLoading: false,
      }));
      toast.error(`Error fetching Grievance Lines: ${getErrorMessage(error)}`);
    }
  };

  const fetchGrievanceLine = async () => {
    if (!systemId) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await grievanceLinesService.getGrievanceLine(
        companyId,
        systemId
      );
      setState((prev) => ({ ...prev, grievanceLine: data, isLoading: false }));

      // Populate form data with fetched data
      setFormData({
        lineNo: data.lineNo || 0,
        issueNo: data.issueNo || "",
        entryType: data.entryType || "",
        description: data.description || "",
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
        isLoading: false,
      }));
      toast.error(`Error fetching Grievance Line: ${getErrorMessage(error)}`);
    }
  };

  const handleInputChange = (
    field: keyof GrievanceLineFormData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createGrievanceLine = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      await grievanceLinesService.createGrievanceLine(companyId, formData);

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Grievance Line created successfully!");

      // Refresh the lines list
      await fetchGrievanceLines();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error(`Error creating Grievance Line: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const updateGrievanceLine = async () => {
    if (!systemId || !state.grievanceLine) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const updateData: GrievanceLineFormUpdate = {
        ...formData,
        systemId,
      };

      await grievanceLinesService.updateGrievanceLine(
        companyId,
        updateData,
        systemId,
        state.grievanceLine["@odata.etag"] || ""
      );

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Grievance Line updated successfully!");

      // Refresh the data
      await fetchGrievanceLine();
      await fetchGrievanceLines();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error(`Error updating Grievance Line: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const deleteGrievanceLine = async (lineSystemId: string, etag: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      await grievanceLinesService.deleteGrievanceLine(
        companyId,
        lineSystemId,
        etag
      );

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Grievance Line deleted successfully!");

      // Refresh the lines list
      await fetchGrievanceLines();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error(`Error deleting Grievance Line: ${getErrorMessage(error)}`);
      throw error;
    }
  };

  const getFormFields = () => {
    const basicFields = [
      {
        label: "Line No",
        type: "number",
        value: formData.lineNo || 0,
        disabled: true,
        id: "lineNo",
      },
      {
        label: "Issue No",
        type: "text",
        value: formData.issueNo || "",
        disabled: true,
        id: "issueNo",
      },
      {
        label: "Entry Type",
        type: "select",
        value: formData.entryType || "",
        disabled: isFieldDisabled,
        id: "entryType",
        options: [
          { label: "Select Entry Type", value: "" },
          { label: "Comment", value: "Comment" },
          { label: "Action", value: "Action" },
          { label: "Resolution", value: "Resolution" },
          { label: "Follow-up", value: "Follow-up" },
        ],
        onChange: (value: string) => {
          handleInputChange("entryType", value);
        },
      },
      {
        label: "Description",
        type: "textarea",
        value: formData.description || "",
        disabled: isFieldDisabled,
        id: "description",
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          handleInputChange("description", e.target.value);
        },
      },
    ];

    return [basicFields];
  };

  return {
    state,
    formData,
    createGrievanceLine,
    updateGrievanceLine,
    deleteGrievanceLine,
    getFormFields,
    handleInputChange,
    fetchGrievanceLines,
  };
};
