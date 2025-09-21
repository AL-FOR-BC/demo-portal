import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../store/hook";
import { trainingRequestService } from "../../../../services/TrainingRequestService";
import {
  TrainingRequest,
  TrainingRequestFormData,
  TrainingRequestFormUpdate,
} from "../../../../@types/trainingRequest.dto";
import { getErrorMessage } from "../../../../utils/common";
import { apiEmployees, apiVendors } from "../../../../services/CommonServices";
import { trainingRequestCoursesService } from "../../../../services/TrainingRequestCoursesService";
import { trainingRequestCertificatesService } from "../../../../services/TrainingRequestCertificatesService";
import { trainingRequestConferencesService } from "../../../../services/TrainingRequestConferencesService";
import { trainingRequestCoachingService } from "../../../../services/TrainingRequestCoachingService";
import { trainingRoomsService } from "../../../../services/TrainingRoomsService";
import { hrmSkillsService } from "../../../../services/HRMSkillsService";
import Swal from "sweetalert2";

type DocumentTypeMode = "add" | "edit" | "view" | "approve";

interface UseTrainingRequestProps {
  mode: DocumentTypeMode;
  systemId?: string;
}

export const useTrainingRequest = ({
  mode,
  systemId,
}: UseTrainingRequestProps) => {
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo, employeeName } = useAppSelector(
    (state) => state.auth.user
  );

  const [state, setState] = useState<{
    isLoading: boolean;
    trainingRequest: TrainingRequest | null;
    error: string | null;
  }>({
    isLoading: false,
    trainingRequest: null,
    error: null,
  });

  const [formData, setFormData] = useState<TrainingRequestFormData>({
    employeeNo: employeeNo || "",
    employeeName: employeeName || "",
    internalExternal: "Internal",
    type: "Certificate",
    code: "",
    postingDate: new Date().toISOString().split("T")[0],
    skillsToBeImparted: "",
    plannedStartDate: "",
    plannedEndDate: "",
    description: "",
    trainingRoom: "",
    trainingProvider: "",
    plannedStartTime: "",
    plannedEndTime: "",
    cost: 0,
    skillGap: "",
    status: "Open",
    perDiemAmountIfNeeded: 0,
  });

  const [codeOptions, setCodeOptions] = useState<
    Array<{ label: string; value: string; description?: string; cost?: number }>
  >([]);

  const [dateError, setDateError] = useState<string | null>(null);

  const [vendorOptions, setVendorOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [trainingRoomOptions, setTrainingRoomOptions] = useState<
    Array<{ label: string; value: string; capacity?: number; venue?: string }>
  >([]);

  const [skillOptions, setSkillOptions] = useState<
    Array<{ label: string; value: string; description?: string }>
  >([]);

  const isFieldDisabled =
    mode === "view" ||
    mode === "approve" ||
    formData.status === "Pending Approval";

  useEffect(() => {
    if (mode === "edit" || mode === "view" || mode === "approve") {
      if (systemId) {
        populateDocumentDetail(systemId);
      }
    }
    if (mode === "add") {
      populateEmployeeData();
    }
    // Fetch codes when type changes
    if (formData.type) {
      fetchCodesByType(formData.type);
    }
    // Fetch vendors, training rooms, and skills for all modes
    fetchVendors();
    fetchTrainingRooms();
    fetchSkills();
  }, [mode, systemId, formData.type]);

  const populateEmployeeData = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const filterQuery = `$filter=No eq '${employeeNo}'`;
      const response = await apiEmployees(companyId, filterQuery);

      if (response.data.value.length > 0) {
        const employee = response.data.value[0];
        setFormData((prev) => ({
          ...prev,
          employeeNo: employee.No || employeeNo || "",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
      }));
      toast.error(`Error loading employee data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await apiVendors(companyId);
      const vendorOpts = response.data.value.map((vendor) => ({
        label: `${vendor.no} - ${vendor.name}`,
        value: vendor.no,
      }));
      setVendorOptions(vendorOpts);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error(`Error loading vendors: ${getErrorMessage(error)}`);
      setVendorOptions([]);
    }
  };

  const fetchTrainingRooms = async () => {
    try {
      const response = await trainingRoomsService.getTrainingRooms(companyId);
      const roomOpts = response.map((room) => ({
        label: `${room.code} - ${room.description} (${room.venue}, Capacity: ${room.capacity})`,
        value: room.code,
        capacity: room.capacity,
        venue: room.venue,
      }));
      setTrainingRoomOptions(roomOpts);
    } catch (error) {
      console.error("Error fetching training rooms:", error);
      toast.error(`Error loading training rooms: ${getErrorMessage(error)}`);
      setTrainingRoomOptions([]);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await hrmSkillsService.getHRMSkills(companyId);
      const skillOpts = response.map((skill) => ({
        label: `${skill.code} - ${skill.description}`,
        value: skill.code,
        description: skill.description,
      }));
      setSkillOptions(skillOpts);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error(`Error loading skills: ${getErrorMessage(error)}`);
      setSkillOptions([]);
    }
  };

  const fetchCodesByType = async (type: string) => {
    try {
      let options: Array<{
        label: string;
        value: string;
        description?: string;
        cost?: number;
      }> = [];

      switch (type) {
        case "Course":
          const courses =
            await trainingRequestCoursesService.getTrainingRequestCourses(
              companyId
            );
          options = courses.map((course) => ({
            label: `${course.code} - ${course.title}`,
            value: course.code,
            description: course.description,
          }));
          break;
        case "Certificate":
          const certificates =
            await trainingRequestCertificatesService.getTrainingRequestCertificates(
              companyId
            );
          options = certificates.map((cert) => ({
            label: `${cert.code} - ${cert.description}`,
            value: cert.code,
            description: cert.description,
            cost: cert.unitCost,
          }));
          break;
        case "Conference":
          const conferences =
            await trainingRequestConferencesService.getTrainingRequestConferences(
              companyId
            );
          options = conferences.map((conf) => ({
            label: `${conf.code} - ${conf.description}`,
            value: conf.code,
            description: conf.description,
            cost: conf.unitCost,
          }));
          break;
        case "Coaching":
          const coaching =
            await trainingRequestCoachingService.getTrainingRequestCoaching(
              companyId
            );
          options = coaching.map((coach) => ({
            label: `${coach.code} - ${coach.description}`,
            value: coach.code,
            description: coach.description,
            cost: coach.unitCost,
          }));
          break;
        default:
          options = [];
      }

      setCodeOptions(options);
    } catch (error) {
      console.error(`Error fetching codes for type ${type}:`, error);
      toast.error(
        `Error loading ${type.toLowerCase()} options: ${getErrorMessage(error)}`
      );
      setCodeOptions([]);
    }
  };

  const populateDocumentDetail = async (systemId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const data = await trainingRequestService.getTrainingRequest(
        companyId,
        systemId
      );

      setState((prev) => ({ ...prev, trainingRequest: data }));

      // Map API response to form data
      setFormData({
        no: data.no,
        employeeNo: data.employeeNo,
        employeeName: data.employeeName || employeeName,
        internalExternal: data.internalExternal,
        type: data.type,
        code: data.code,
        postingDate: data.postingDate,
        skillsToBeImparted: data.skillsToBeImparted,
        plannedStartDate: data.plannedStartDate,
        plannedEndDate: data.plannedEndDate,
        description: data.description,
        trainingRoom: data.trainingRoom,
        trainingProvider: data.trainingProvider,
        plannedStartTime: data.plannedStartTime,
        plannedEndTime: data.plannedEndTime,
        cost: data.cost,
        skillGap: data.skillGap,
        status: data.status,
        perDiemAmountIfNeeded: data.perDiemAmountIfNeeded,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: getErrorMessage(error),
      }));
      toast.error(`Error loading training request: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const validateDateRange = (
    startDate: string,
    endDate: string
  ): string | null => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day

    // Check if start date is in the past
    if (start < today) {
      return "Start date cannot be in the past";
    }

    // Check if end date is before start date (same dates are allowed for single-day training)
    if (start > end) {
      return "End date cannot be before start date";
    }

    return null;
  };

  const handleInputChange = (
    field: keyof TrainingRequestFormData,
    value: any
  ) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };

      // Clear code when type changes
      if (field === "type") {
        newData.code = "";
      }

      // Validate date range when dates change
      if (field === "plannedStartDate" || field === "plannedEndDate") {
        const startDate =
          field === "plannedStartDate" ? value : newData.plannedStartDate;
        const endDate =
          field === "plannedEndDate" ? value : newData.plannedEndDate;

        const validationError = validateDateRange(startDate, endDate);
        setDateError(validationError);

        if (validationError) {
          toast.error(validationError);
        }
      }

      return newData;
    });
  };

  const cleanFormDataForSubmission = (data: TrainingRequestFormData) => {
    const cleanedData = { ...data };

    // Fields that are read-only and should be excluded from create payload
    const readOnlyFields = ["no", "status", "employeeName"];

    // Remove read-only fields from the payload
    readOnlyFields.forEach((field) => {
      delete (cleanedData as any)[field];
    });

    // Convert empty strings to null for optional fields
    Object.keys(cleanedData).forEach((key) => {
      const value = cleanedData[key as keyof TrainingRequestFormData];
      if (value === "") {
        (cleanedData as any)[key] = null;
      }
    });

    // Special handling for numeric fields
    if (cleanedData.cost === null || cleanedData.cost === undefined) {
      cleanedData.cost = 0;
    }
    if (
      cleanedData.perDiemAmountIfNeeded === null ||
      cleanedData.perDiemAmountIfNeeded === undefined
    ) {
      cleanedData.perDiemAmountIfNeeded = 0;
    }

    return cleanedData;
  };

  const createTrainingRequest = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Validate required fields before submission
      const requiredFields = [
        { field: "employeeNo", label: "Employee No" },
        { field: "type", label: "Type" },
        { field: "code", label: "Code" },
        { field: "skillsToBeImparted", label: "Skills to be Imparted" },
        { field: "plannedStartDate", label: "Planned Start Date" },
        { field: "plannedEndDate", label: "Planned End Date" },
        { field: "trainingProvider", label: "Training Provider" },
        { field: "cost", label: "Cost" },
        { field: "skillGap", label: "Skill Gap" },
      ];

      const missingFields = requiredFields.filter(({ field }) => {
        const value = formData[field as keyof TrainingRequestFormData];
        const isEmpty =
          !value || value === "" || value === null || value === undefined;
        return isEmpty;
      });

      if (missingFields.length > 0) {
        const missingFieldLabels = missingFields
          .map(({ label }) => label)
          .join(", ");
        toast.error(
          `Please fill in the following required fields: ${missingFieldLabels}`
        );
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      // Validate date range
      const validationError = validateDateRange(
        formData.plannedStartDate,
        formData.plannedEndDate
      );
      if (validationError) {
        setDateError(validationError);
        toast.error(validationError);
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const cleanedData = cleanFormDataForSubmission(formData);

      const response = await trainingRequestService.createTrainingRequest(
        companyId,
        cleanedData
      );
      toast.success("Training request created successfully");
      navigate(`/training-request-details/${response.data.systemId}`);
      return response.data;
    } catch (error) {
      console.error("Training request creation error:", error);
      toast.error(`Error creating training request: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const updateTrainingRequest = async () => {
    if (!state.trainingRequest) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const cleanedData = cleanFormDataForSubmission(formData);
      const updateData: TrainingRequestFormUpdate = {
        ...cleanedData,
        systemId: state.trainingRequest.systemId,
      };

      const response = await trainingRequestService.updateTrainingRequest(
        companyId,
        updateData,
        state.trainingRequest.systemId,
        state.trainingRequest["@odata.etag"]
      );

      setState((prev) => ({ ...prev, trainingRequest: response.data }));
      toast.success("Training request updated successfully");
      return response.data;
    } catch (error) {
      toast.error(`Error updating training request: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const deleteTrainingRequest = async () => {
    if (!state.trainingRequest) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await trainingRequestService.deleteTrainingRequest(
        companyId,
        state.trainingRequest.systemId
      );
      toast.success("Training request deleted successfully");
      navigate("/training-requests");
    } catch (error) {
      toast.error(`Error deleting training request: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const sendForApproval = async () => {
    if (!state.trainingRequest) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await trainingRequestService.sendTrainingRequestForApproval(companyId, {
        no: state.trainingRequest.no,
        senderEmailAddress: "", // This should be populated with actual email
      });
      toast.success("Training request sent for approval successfully");
      await populateDocumentDetail(state.trainingRequest.systemId);
    } catch (error) {
      toast.error(`Error sending for approval: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const cancelApproval = async () => {
    if (!state.trainingRequest) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await trainingRequestService.cancelTrainingRequestApproval(companyId, {
        no: state.trainingRequest.no,
      });
      toast.success("Approval request cancelled successfully");
      await populateDocumentDetail(state.trainingRequest.systemId);
    } catch (error) {
      toast.error(`Error cancelling approval: ${getErrorMessage(error)}`);
      throw error;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const submitTrainingRequest = async (no: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to submit this training request?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, submit it!",
        cancelButtonText: "No, cancel!",
      });
      if (result.isConfirmed) {
        setState((prev) => ({ ...prev, isLoading: true }));
        await trainingRequestService.submitTrainingRequest(companyId, { no });
        toast.success("Training request submitted successfully");
        return true;
      }
    } catch (error) {
      toast.error(
        `Error submitting training request: ${getErrorMessage(error)}`
      );
      return false;
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSaveOnBlur = async (
    fieldName?: string | React.FocusEvent<HTMLInputElement>,
    newValue?: any
  ) => {
    if (mode === "edit" || mode === "approve" || mode === "view") {
      try {
        let updateData: any = { systemId: state.trainingRequest!.systemId };

        let actualFieldName: string | undefined;
        if (typeof fieldName === "string") {
          actualFieldName = fieldName;
        } else if (fieldName && "target" in fieldName) {
          actualFieldName = (fieldName.target as HTMLInputElement).id;
        }

        if (actualFieldName) {
          const fieldValue =
            newValue !== undefined
              ? newValue
              : formData[actualFieldName as keyof TrainingRequestFormData];

          updateData[actualFieldName] = fieldValue;
        } else {
          const cleanedData = cleanFormDataForSubmission(formData);
          updateData = {
            ...cleanedData,
            systemId: state.trainingRequest!.systemId,
          };
        }

        const response = await trainingRequestService.updateTrainingRequest(
          companyId,
          updateData,
          state.trainingRequest!.systemId,
          state.trainingRequest!["@odata.etag"]
        );

        setState((prev) => ({
          ...prev,
          trainingRequest: {
            ...prev.trainingRequest!,
            "@odata.etag": response.data["@odata.etag"],
          },
        }));

        const fieldLabels: { [key: string]: string } = {
          type: "Type",
          code: "Code",
          skillsToBeImparted: "Skills to be Imparted",
          plannedStartDate: "Planned Start Date",
          plannedEndDate: "Planned End Date",
          trainingProvider: "Training Provider",
          cost: "Cost",
          skillGap: "Skill Gap",
          description: "Description",
          trainingRoom: "Training Room",
          plannedStartTime: "Planned Start Time",
          plannedEndTime: "Planned End Time",
          perDiemAmountIfNeeded: "Per Diem Amount If Needed",
        };

        const fieldLabel = actualFieldName
          ? fieldLabels[actualFieldName] || actualFieldName
          : "Field";
        toast.success(`${fieldLabel} updated successfully`);
      } catch (error) {
        console.error("handleSaveOnBlur - Error:", error);
        toast.error(`Error updating field: ${getErrorMessage(error)}`);
      }
    }
  };

  const getFormFields = () => {
    const basicFields = [
      {
        label: "No",
        type: "text",
        value: state.trainingRequest?.no || "",
        disabled: true,
        id: "no",
      },
      {
        label: "Employee No",
        type: "text",
        value: employeeNo || "",
        disabled: true,
        id: "employeeNo",
      },
      {
        label: "Employee Name",
        type: "text",
        value: employeeName || "",
        disabled: true,
        id: "employeeName",
      },
      {
        label: "Status",
        type: "text",
        value: state.trainingRequest?.status || "Open",
        disabled: true,
        id: "docStatus",
      },
      {
        label: "Internal/External *",
        type: "select",
        value: formData.internalExternal
          ? {
              label: formData.internalExternal,
              value: formData.internalExternal,
            }
          : null,
        id: "internalExternal",
        disabled: isFieldDisabled,
        onChange: (selectedOption: any) => {
          const newValue = selectedOption?.value || "";
          handleInputChange("internalExternal", newValue);
        },
        onBlur: () => {
          setTimeout(() => {
            handleSaveOnBlur("internalExternal", formData.internalExternal);
          }, 0);
        },
        options: [
          { label: "Internal", value: "Internal" },
          { label: "External", value: "External" },
        ],
        required: true,
      },
      {
        label: "Type *",
        type: "select",
        value: formData.type
          ? { label: formData.type, value: formData.type }
          : null,
        id: "type",
        disabled: isFieldDisabled,
        onChange: (selectedOption: any) => {
          const newValue = selectedOption?.value || "";
          handleInputChange("type", newValue);
        },
        onBlur: () => {
          setTimeout(() => {
            handleSaveOnBlur("type", formData.type);
          }, 0);
        },
        options: [
          { label: "Certificate", value: "Certificate" },
          { label: "Course", value: "Course" },
          { label: "Coaching", value: "Coaching" },
          { label: "Conference", value: "Conference" },
        ],
        required: true,
      },
      {
        label: "Code *",
        type: "select",
        value: formData.code
          ? codeOptions.find((opt) => opt.value === formData.code) || null
          : null,
        id: "code",
        disabled: isFieldDisabled,
        onChange: (selectedOption: any) => {
          const newValue = selectedOption?.value || "";
          handleInputChange("code", newValue);

          // Auto-populate cost if available
          if (selectedOption?.cost) {
            handleInputChange("cost", selectedOption.cost);
          }
        },
        onBlur: () => {
          setTimeout(() => {
            handleSaveOnBlur("code", formData.code);
          }, 0);
        },
        options: codeOptions,
        required: true,
      },
      {
        label: "Skills to be Imparted *",
        type: "textarea",
        value: formData.skillsToBeImparted || "",
        id: "skillsToBeImparted",
        disabled: isFieldDisabled,
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          handleInputChange("skillsToBeImparted", e.target.value);
        },
        onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => {
          handleSaveOnBlur("skillsToBeImparted", e.target.value);
        },
        required: true,
      },
      {
        label: "Planned Start Date *",
        type: "date",
        value: formData.plannedStartDate || "",
        id: "plannedStartDate",
        disabled: isFieldDisabled,
        onChange: (_: Date[], dateStr: string) => {
          handleInputChange("plannedStartDate", dateStr);
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          handleSaveOnBlur("plannedStartDate", e.target.value);
        },
        required: true,
        min: new Date().toISOString().split("T")[0], // Cannot select past dates
        max: formData.plannedEndDate || undefined, // Cannot be after end date
      },
      {
        label: "Planned End Date *",
        type: "date",
        value: formData.plannedEndDate || "",
        id: "plannedEndDate",
        disabled: isFieldDisabled,
        onChange: (_: Date[], dateStr: string) => {
          handleInputChange("plannedEndDate", dateStr);
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          handleSaveOnBlur("plannedEndDate", e.target.value);
        },
        required: true,
        min:
          formData.plannedStartDate || new Date().toISOString().split("T")[0], // Cannot be before start date
      },
      {
        label: "Training Provider *",
        type: "select",
        value: formData.trainingProvider
          ? vendorOptions.find(
              (opt) => opt.value === formData.trainingProvider
            ) || null
          : null,
        id: "trainingProvider",
        disabled: isFieldDisabled,
        onChange: (selectedOption: any) => {
          const newValue = selectedOption?.value || "";
          handleInputChange("trainingProvider", newValue);
        },
        onBlur: () => {
          setTimeout(() => {
            handleSaveOnBlur("trainingProvider", formData.trainingProvider);
          }, 0);
        },
        options: vendorOptions,
        required: true,
      },
      {
        label: "Cost *",
        type: "number",
        value: formData.cost || 0,
        id: "cost",
        disabled: isFieldDisabled,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange("cost", parseFloat(e.target.value) || 0);
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          handleSaveOnBlur("cost", parseFloat(e.target.value) || 0);
        },
        required: true,
        min: 0,
        step: 0.01,
      },
      {
        label: "Skill Gap *",
        type: "select",
        value: formData.skillGap
          ? skillOptions.find((opt) => opt.value === formData.skillGap) || null
          : null,
        id: "skillGap",
        disabled: isFieldDisabled,
        onChange: (selectedOption: any) => {
          const newValue = selectedOption?.value || "";
          handleInputChange("skillGap", newValue);
        },
        onBlur: () => {
          setTimeout(() => {
            handleSaveOnBlur("skillGap", formData.skillGap);
          }, 0);
        },
        options: skillOptions,
        required: true,
      },
    ];

    return [basicFields];
  };

  return {
    state,
    formData,
    setFormData,
    handleInputChange,
    createTrainingRequest,
    updateTrainingRequest,
    deleteTrainingRequest,
    sendForApproval,
    cancelApproval,
    submitTrainingRequest,
    handleSaveOnBlur,
    getFormFields,
    isFieldDisabled,
    codeOptions,
    dateError,
    vendorOptions,
    trainingRoomOptions,
    skillOptions,
  };
};
