import { useAppSelector } from "../../store/hook";
import { useState } from "react";
import { getErrorMessage } from "../../utils/common";
import { toast } from "react-toastify";
import { trainingPlanService } from "../../services/TrainingPlanService";
import { DocumentTypeMode } from "../../@types/documents/base.types";
import { useNavigate } from "react-router-dom";
import { quickUpdate } from "../../helpers/quickUpdate";
import { FormValidator } from "../../utils/hooks/validation";
import { apiLocation, apiDimensionValue } from "../../services/CommonServices";
import { options } from "../../@types/common.dto";

export interface TrainingPlanFormData {
  no?: string;
  supervisorId: string;
  supervisorName?: string; // Read-only field for display
  totalCost?: number;
  status?: string;
  completed?: boolean;
  trainingDescription: string;
  organizationUnit?: options[];
  projectCode?: options[];
  donorCode?: options[];
}

export interface TrainingPlanDocumentState {
  isLoading: boolean;
  trainingPlans: any[];
  organizationUnitOptions: options[];
  projectCodeOptions: options[];
  donorCodeOptions: options[];
}

const initialTrainingPlanDocumentState: TrainingPlanDocumentState = {
  isLoading: false,
  trainingPlans: [],
  organizationUnitOptions: [],
  projectCodeOptions: [],
  donorCodeOptions: [],
};

const initialFormData: TrainingPlanFormData = {
  supervisorId: "",
  supervisorName: "",
  trainingDescription: "",
  status: "Open",
  completed: false,
  totalCost: 0,
  organizationUnit: [],
  projectCode: [],
  donorCode: [],
};

export const useTrainingPlanDocument = ({
  mode,
}: {
  mode: DocumentTypeMode;
}) => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo, employeeName } = useAppSelector(
    (state) => state.auth.user
  );
  const navigate = useNavigate();

  const [state, setState] = useState<TrainingPlanDocumentState>(
    initialTrainingPlanDocumentState
  );
  const [formData, setFormData] =
    useState<TrainingPlanFormData>(initialFormData);
  const [docSystemId, setDocSystemId] = useState<string>("");

  // ------------------------------------- ACTIONS -------------------------------------
  const submitTrainingPlan = async () => {
    // check for empty fields
    if (!formData.supervisorId || !formData.trainingDescription) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Create API payload that matches the Business Central API structure
      const apiPayload = {
        empId: formData.supervisorId,
        completed: formData.completed || false,
        trainingDescription: formData.trainingDescription,
        shortcutDimension1Code: formData.projectCode?.[0]?.value || "",
        shortcutDimension2Code: formData.donorCode?.[0]?.value || "",
      };

      const response = await trainingPlanService.createTrainingPlan(
        companyId,
        apiPayload as any
      );
      toast.success("Training plan created successfully");
      navigate(`/training-plan-details/${response.data.systemId}`);
      return true;
    } catch (error) {
      toast.error(`Error creating training plan: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const deleteTrainingPlan = async (systemId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await trainingPlanService.deleteTrainingPlan(companyId, systemId);
      toast.success("Training plan deleted successfully");
      navigate("/training-plans");
      return true;
    } catch (error) {
      toast.error(`Error deleting training plan: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const sendTrainingPlanForApproval = async (
    documentNo: string | undefined,
    senderEmailAddress: string
  ) => {
    if (!documentNo) return;
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const isValid = handleValidateHeaderFields();
      if (!isValid) return;
      const response = await trainingPlanService.sendTrainingPlanForApproval(
        companyId,
        {
          no: documentNo,
          senderEmailAddress: senderEmailAddress,
        }
      );
      if (response) {
        toast.success(`Training plan ${documentNo} sent for approval`);
        populateDocument(docSystemId);
      }
    } catch (error) {
      toast.error(`Error sending for approval: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const cancelTrainingPlanApproval = async (documentNo: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await trainingPlanService.cancelTrainingPlanApproval(
        companyId,
        {
          no: documentNo,
        }
      );
      if (response) {
        toast.success(`Training plan ${documentNo} cancelled`);
        populateDocument(docSystemId);
      }
    } catch (error) {
      toast.error(`Error cancelling approval: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const populateDocumentDetail = async (systemId: string) => {
    const response = await trainingPlanService.getTrainingPlan(
      companyId,
      systemId
    );
    setDocSystemId(systemId);
    setFormData({
      no: response.no,
      supervisorId: response.empId || "", // Map empId to supervisorId for form
      supervisorName: employeeName || "", // Use current logged-in user's name
      totalCost: response.totalCost,
      status: response.status,
      completed: response.completed,
      trainingDescription: response.trainingDescription,
      organizationUnit: response.organizationUnit
        ? [
            {
              label: response.organizationUnit,
              value: response.organizationUnit,
            },
          ]
        : [],
      projectCode: response.shortcutDimension1Code
        ? [
            {
              label: response.shortcutDimension1Code,
              value: response.shortcutDimension1Code,
            },
          ]
        : [],
      donorCode: response.shortcutDimension2Code
        ? [
            {
              label: response.shortcutDimension2Code,
              value: response.shortcutDimension2Code,
            },
          ]
        : [],
    });
  };

  const populateDocument = async (systemId?: string, documentNo?: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Always populate the API data for select options
      await populateData();

      if (mode === "list") {
        const filterQuery = `$filter=empId eq '${employeeNo}'`;
        const response = await trainingPlanService.getTrainingPlans(
          companyId,
          filterQuery
        );
        setState((prev) => ({
          ...prev,
          trainingPlans: response,
        }));
      }
      if (mode === "add") {
        setFormData((prev) => ({
          ...prev,
          supervisorId: employeeNo || "",
          supervisorName: employeeName || "",
        }));
      }
      if (mode === "detail" && systemId) {
        await populateDocumentDetail(systemId);
      }
      if (mode === "approve") {
        const filterQuery = `$filter=no eq '${documentNo}'`;
        const response = await trainingPlanService.getTrainingPlans(
          companyId,
          filterQuery
        );
        if (response.length > 0) {
          const data = response[0];
          setFormData({
            no: data.no,
            supervisorId: data.empId || "", // Map empId to supervisorId for form
            supervisorName: employeeName || "", // Use current logged-in user's name
            totalCost: data.totalCost,
            status: data.status,
            completed: data.completed,
            trainingDescription: data.trainingDescription,
            organizationUnit: data.organizationUnit
              ? [{ label: data.organizationUnit, value: data.organizationUnit }]
              : [],
            projectCode: data.shortcutDimension1Code
              ? [
                  {
                    label: data.shortcutDimension1Code,
                    value: data.shortcutDimension1Code,
                  },
                ]
              : [],
            donorCode: data.shortcutDimension2Code
              ? [
                  {
                    label: data.shortcutDimension2Code,
                    value: data.shortcutDimension2Code,
                  },
                ]
              : [],
          });
        }
      }
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const populateData = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Fetch Organization Units (Locations)
      const resLocationCodes = await apiLocation(companyId);
      const organizationUnitOptions = resLocationCodes.data.value.map((e) => ({
        label: `${e.code}::${e.name}`,
        value: e.code,
      }));
      setState((prev) => ({
        ...prev,
        organizationUnitOptions,
      }));

      // Fetch Project Codes (Dimension Values)
      const dimensionFilter = `&$filter=globalDimensionNo eq 1`;
      const resDimensionValues = await apiDimensionValue(
        companyId,
        dimensionFilter
      );
      const projectCodeOptions = resDimensionValues.data.value.map((e) => ({
        label: `${e.code}::${e.name}`,
        value: e.code,
      }));
      setState((prev) => ({
        ...prev,
        projectCodeOptions,
      }));

      // Fetch Donor Codes (Dimension Values)
      const donorDimensionFilter = `&$filter=globalDimensionNo eq 2`;
      const resDonorDimensionValues = await apiDimensionValue(
        companyId,
        donorDimensionFilter
      );
      const donorCodeOptions = resDonorDimensionValues.data.value.map((e) => ({
        label: `${e.code}::${e.name}`,
        value: e.code,
      }));
      setState((prev) => ({
        ...prev,
        donorCodeOptions,
      }));
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleInputChange = (
    field: keyof TrainingPlanFormData,
    value: string | number | boolean | options[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFieldUpdate = async (
    field: keyof TrainingPlanFormData,
    value: string | number | boolean | options[]
  ) => {
    if (!docSystemId) return;

    // Create a wrapper function that matches the expected signature
    const updateWrapper = async (
      companyId: string,
      _method: "PATCH",
      data: any,
      id: string,
      etag: string
    ) => {
      return trainingPlanService.updateTrainingPlan(companyId, data, id, etag);
    };

    return quickUpdate({
      companyId,
      id: docSystemId,
      apiService: updateWrapper,
      data: { [field]: value },
      successMessage: `${field} updated successfully`,
      errorMessage: `Error updating ${field}`,
      onSucesss: () => {
        populateDocument(docSystemId);
      },
      onError: (error) => {
        console.error("Update error:", error);
      },
    });
  };

  const getFormFields = () => {
    const isFieldDisabled =
      mode === "add" ||
      formData.status === "Open" ||
      (mode === "detail" && formData.status === "Open")
        ? false
        : true;

    const basicFields = [
      {
        label: "No.",
        type: "text",
        value: formData.no || "",
        disabled: true,
        id: "no",
      },
      {
        label: "Supervisor ID",
        type: "text",
        value: formData.supervisorId || "",
        disabled: isFieldDisabled,
        id: "supervisorId",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange("supervisorId", e.target.value);
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          if (mode === "detail") {
            handleFieldUpdate("supervisorId", e.target.value);
          }
        },
        required: true,
      },
      {
        label: "Supervisor Name",
        type: "text",
        value: formData.supervisorName || "",
        disabled: true,
        id: "supervisorName",
      },
      {
        label: "Status",
        type: "text",
        value: formData.status || "",
        id: "docStatus",
        disabled: true,
      },
    ];

    const editableFields = [
      ...(mode !== "add"
        ? [
            {
              label: "Total Cost",
              type: "number",
              value: formData.totalCost || 0,
              id: "totalCost",
              disabled: isFieldDisabled,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                handleInputChange("totalCost", parseFloat(e.target.value) || 0);
              },
              onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                if (mode === "detail") {
                  handleFieldUpdate(
                    "totalCost",
                    parseFloat(e.target.value) || 0
                  );
                }
              },
            },
          ]
        : []),
      ...(mode !== "add"
        ? [
            {
              label: "Organization Unit",
              type: "select",
              value: formData.organizationUnit || [],
              id: "organizationUnit",
              disabled: isFieldDisabled,
              options: state.organizationUnitOptions,
              onChange: (e: options) => {
                handleInputChange("organizationUnit", [
                  { label: e.label, value: e.value },
                ]);
              },
            },
          ]
        : []),
      {
        label: "Project Code",
        type: "select",
        value: formData.projectCode || [],
        id: "projectCode",
        disabled: isFieldDisabled,
        options: state.projectCodeOptions,
        onChange: (e: options) => {
          handleInputChange("projectCode", [
            { label: e.label, value: e.value },
          ]);
        },
      },
      {
        label: "Donor Code",
        type: "select",
        value: formData.donorCode || [],
        id: "donorCode",
        disabled: isFieldDisabled,
        options: state.donorCodeOptions,
        onChange: (e: options) => {
          handleInputChange("donorCode", [{ label: e.label, value: e.value }]);
        },
      },
      {
        label: "Training Description",
        type: "textarea",
        value: formData.trainingDescription || "",
        id: "trainingDescription",
        disabled: isFieldDisabled,
        rows: 3,
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          handleInputChange("trainingDescription", e.target.value);
        },
        onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => {
          if (mode === "detail") {
            handleFieldUpdate("trainingDescription", e.target.value);
          }
        },
        required: true,
      },
    ];

    return [basicFields, editableFields];
  };

  const handleValidateHeaderFields = () => {
    const result = FormValidator.validateFields(getFormFields());
    return result.isValid;
  };

  return {
    state,
    populateDocument,
    populateData,
    submitTrainingPlan,
    deleteTrainingPlan,
    formData,
    handleInputChange,
    getFormFields,
    sendTrainingPlanForApproval,
    cancelTrainingPlanApproval,
  };
};
