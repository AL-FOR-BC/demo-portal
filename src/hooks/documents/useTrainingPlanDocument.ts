import React, { useState, useCallback, useEffect } from "react";
import { useAppSelector } from "../../store/hook";
import { getErrorMessage } from "../../utils/common";
import { toast } from "react-toastify";
import { trainingPlanService } from "../../services/TrainingPlanService";
import { trainingPlanLinesService } from "../../services/TrainingPlanLinesService";
import { expectedParticipantsService } from "../../services/ExpectedParticipantsService";
import { DocumentTypeMode } from "../../@types/documents/base.types";
import { useNavigate } from "react-router-dom";
import { quickUpdate } from "../../helpers/quickUpdate";
import { FormValidator } from "../../utils/hooks/validation";
import { apiLocation, apiDimensionValue } from "../../services/CommonServices";
import { options } from "../../@types/common.dto";
import { TrainingPlanLine } from "../../@types/trainingPlanLines.dto";
import { ExpectedParticipant } from "../../@types/expectedParticipants.dto";

export interface TrainingPlanFormData {
  no?: string;
  employeeId: string;
  employeeName?: string; // Read-only field for display
  totalCost?: number;
  status?: string;
  completed?: boolean;
  trainingDescription: string;
  organizationUnit?: string;
  projectCode?: options[];
  donorCode?: options[];
}

export interface TrainingPlanDocumentState {
  isLoading: boolean;
  trainingPlans: any[];
  organizationUnitOptions: options[];
  projectCodeOptions: options[];
  donorCodeOptions: options[];
  trainingPlanLines: TrainingPlanLine[];
  professionalCertificates: options[];
  coachingOptions: options[];
  conferenceOptions: options[];
  courseOptions: options[];
  organisationUnitOptions: options[];
  venueOptions: options[];
  employeeOptions: options[];
  vendorOptions: options[];
  // Expected participants state
  expectedParticipants: ExpectedParticipant[];
  isParticipantsModalOpen: boolean;
  selectedLineForParticipants: any;
  isAddParticipantModalOpen: boolean;
  needsLabelRefresh: boolean;
  newParticipantData: {
    no: options[];
    trainingNeed: string;
  };
  // Lines modal state
  lineModalData: {
    performanceGap: string;
    category: options[];
    programCode: options[];
    targetGroup: options[];
    deliveryMethod: options[];
    coachMentor: options[];
    trainingProvider: options[];
    trainingLocation: options[];
    plannedStartDate: string;
    plannedEndDate: string;
    expectedParticipants: number;
    estimatedUnitCost: number;
    estimatedTotalCost: number;
  };
}

const initialTrainingPlanDocumentState: TrainingPlanDocumentState = {
  isLoading: false,
  trainingPlans: [],
  organizationUnitOptions: [],
  projectCodeOptions: [],
  donorCodeOptions: [],
  trainingPlanLines: [],
  professionalCertificates: [],
  coachingOptions: [],
  conferenceOptions: [],
  courseOptions: [],
  organisationUnitOptions: [],
  venueOptions: [],
  employeeOptions: [],
  vendorOptions: [],
  // Expected participants state
  expectedParticipants: [],
  isParticipantsModalOpen: false,
  selectedLineForParticipants: null,
  isAddParticipantModalOpen: false,
  needsLabelRefresh: false,
  newParticipantData: {
    no: [],
    trainingNeed: "",
  },
  lineModalData: {
    performanceGap: "",
    category: [],
    programCode: [],
    targetGroup: [],
    deliveryMethod: [],
    coachMentor: [],
    trainingProvider: [],
    trainingLocation: [],
    plannedStartDate: "",
    plannedEndDate: "",
    expectedParticipants: 0,
    estimatedUnitCost: 0,
    estimatedTotalCost: 0,
  },
};

const initialFormData: TrainingPlanFormData = {
  employeeId: "",
  employeeName: "",
  trainingDescription: "",
  status: "Open",
  completed: false,
  totalCost: 0,
  organizationUnit: "",
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

  // Effect to refresh form data labels when options are loaded (for approve and detail modes)
  useEffect(() => {
    if (
      state.needsLabelRefresh &&
      state.projectCodeOptions.length > 0 &&
      state.donorCodeOptions.length > 0 &&
      (mode === "approve" || mode === "detail")
    ) {
      setFormData((currentFormData) => {
        const updatedProjectCode = currentFormData.projectCode?.[0]?.value
          ? [
              {
                label:
                  state.projectCodeOptions.find(
                    (opt) =>
                      opt.value === currentFormData.projectCode?.[0]?.value
                  )?.label ||
                  currentFormData.projectCode?.[0]?.value ||
                  "",
                value: currentFormData.projectCode?.[0]?.value || "",
              },
            ]
          : [];

        const updatedDonorCode = currentFormData.donorCode?.[0]?.value
          ? [
              {
                label:
                  state.donorCodeOptions.find(
                    (opt) => opt.value === currentFormData.donorCode?.[0]?.value
                  )?.label ||
                  currentFormData.donorCode?.[0]?.value ||
                  "",
                value: currentFormData.donorCode?.[0]?.value || "",
              },
            ]
          : [];

        return {
          ...currentFormData,
          projectCode: updatedProjectCode,
          donorCode: updatedDonorCode,
        };
      });

      // Clear the refresh flag
      setState((prev) => ({ ...prev, needsLabelRefresh: false }));
    }
  }, [
    state.needsLabelRefresh,
    state.projectCodeOptions,
    state.donorCodeOptions,
    mode,
  ]);

  // ------------------------------------- ACTIONS -------------------------------------
  const submitTrainingPlan = async () => {
    // Enhanced validation
    if (!formData.employeeId?.trim()) {
      toast.error("Employee ID is required");
      return;
    }
    if (!formData.trainingDescription?.trim()) {
      toast.error("Training description is required");
      return;
    }
    if (formData.trainingDescription.trim().length < 10) {
      toast.error("Training description must be at least 10 characters long");
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Create API payload that matches the Business Central API structure
      const apiPayload = {
        employeeId: formData.employeeId.trim(),
        completed: formData.completed || false,
        trainingDescription: formData.trainingDescription.trim(),
        organizationUnit: formData.organizationUnit || "",
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

  const populateDocumentDetail = useCallback(
    async (systemId: string) => {
      try {
        const response = await trainingPlanService.getTrainingPlan(
          companyId,
          systemId
        );
        setDocSystemId(systemId);

        setFormData({
          no: response.no,
          employeeId: response.employeeId || response.empId || "", // Use employeeId from API or fallback to empId
          employeeName: employeeName || "", // Use current logged-in user's name
          totalCost: response.totalCost,
          status: response.status,
          completed: response.completed,
          trainingDescription: response.trainingDescription,
          organizationUnit:
            response.organizationUnit || response.directorate || "",
          projectCode: response.shortcutDimension1Code
            ? [
                {
                  label: response.shortcutDimension1Code, // Initially just the code, will be updated by populateData
                  value: response.shortcutDimension1Code,
                },
              ]
            : [],
          donorCode: response.shortcutDimension2Code
            ? [
                {
                  label: response.shortcutDimension2Code, // Initially just the code, will be updated by populateData
                  value: response.shortcutDimension2Code,
                },
              ]
            : [],
        });
      } catch (error) {
        console.error("Error populating document detail:", error);
        toast.error(`Error loading training plan: ${getErrorMessage(error)}`);
      }
    },
    [companyId, employeeName]
  );

  const populateData = useCallback(async () => {
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
  }, [companyId]);

  const populateDocument = useCallback(
    async (systemId?: string, documentNo?: string) => {
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
            employeeId: employeeNo || "",
            employeeName: employeeName || "",
          }));
        }
        if (mode === "detail" && systemId) {
          await populateDocumentDetail(systemId);

          // Set a flag to refresh labels when options are loaded
          setState((prev) => ({ ...prev, needsLabelRefresh: true }));
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
              employeeId: data.employeeId || data.empId || "", // Use employeeId from API or fallback to empId
              employeeName: employeeName || "", // Use current logged-in user's name
              totalCost: data.totalCost,
              status: data.status,
              completed: data.completed,
              trainingDescription: data.trainingDescription,
              organizationUnit: data.organizationUnit || data.directorate || "",
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

            // Set a flag to refresh labels when options are loaded
            setState((prev) => ({ ...prev, needsLabelRefresh: true }));
          }
        }
      } catch (error) {
        toast.error(`Error fetching data: ${getErrorMessage(error)}`);
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [
      mode,
      employeeNo,
      employeeName,
      companyId,
      populateData,
      populateDocumentDetail,
    ]
  );

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

    // Map form field names to API field names
    const fieldMapping: Record<string, string> = {
      projectCode: "shortcutDimension1Code",
      donorCode: "shortcutDimension2Code",
    };

    const apiField = fieldMapping[field as string] || field;
    let apiValue = value;

    // For select fields, extract the value from the options array
    if (field === "projectCode" || field === "donorCode") {
      apiValue = Array.isArray(value) && value.length > 0 ? value[0].value : "";
    }

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
      data: { [apiField]: apiValue },
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
        label: "Employee ID",
        type: "text",
        value: formData.employeeId || "",
        disabled: true, // Always disabled - read only
        id: "employeeId",
        placeholder: "Employee ID",
      },
      {
        label: "Employee Name",
        type: "text",
        value: formData.employeeName || "",
        disabled: true,
        id: "employeeName",
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
              disabled: true, // Always disabled - read only
              min: 0,
              step: 0.01,
              placeholder: "Total Cost",
            },
          ]
        : []),
      {
        label: "Organization Unit",
        type: "text",
        value: formData.organizationUnit || "",
        id: "organizationUnit",
        disabled: true, // Always disabled - read only
        placeholder: "Organization Unit",
      },
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
        onBlur: (e: options) => {
          if (mode === "detail") {
            handleFieldUpdate("projectCode", [
              { label: e.label, value: e.value },
            ]);
          }
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
        onBlur: (e: options) => {
          if (mode === "detail") {
            handleFieldUpdate("donorCode", [
              { label: e.label, value: e.value },
            ]);
          }
        },
      },
      {
        label: "Training Description",
        type: "textarea",
        value: formData.trainingDescription || "",
        id: "trainingDescription",
        disabled: isFieldDisabled,
        rows: 4,
        placeholder: "Enter detailed description of the training plan",
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

  // Lines management functions
  const fetchTrainingPlanLines = useCallback(
    async (trainingPlanNo: string) => {
      try {
        const lines = await trainingPlanLinesService.getTrainingPlanLines(
          companyId,
          trainingPlanNo
        );
        setState((prev) => ({ ...prev, trainingPlanLines: lines }));
      } catch (error) {
        toast.error(
          `Error fetching training plan lines: ${getErrorMessage(error)}`
        );
      }
    },
    [companyId]
  );

  const fetchProgramOptions = useCallback(async () => {
    console.log("fetchProgramOptions called");
    try {
      // Fetch Professional Certificates
      const certificates =
        await trainingPlanLinesService.getProfessionalCertificates(companyId);
      const certificateOptions = certificates.map((cert) => ({
        label: `${cert.code}::${cert.description}`,
        value: cert.code,
        unitCost: cert.unitCost,
        score: cert.score,
      }));

      // Fetch Coaching
      const coaching = await trainingPlanLinesService.getCoaching(companyId);
      const coachingOptions = coaching.map((coach) => ({
        label: `${coach.code}::${coach.description}`,
        value: coach.code,
        unitCost: coach.unitCost,
      }));

      // Fetch Conferences
      const conferences = await trainingPlanLinesService.getConferences(
        companyId
      );
      const conferenceOptions = conferences.map((conf) => ({
        label: `${conf.code}::${conf.description}`,
        value: conf.code,
        unitCost: conf.unitCost,
        trainingType: conf.trainingType,
      }));

      // Fetch Courses
      const courses = await trainingPlanLinesService.getCourses(companyId);
      const courseOptions = courses.map((course) => ({
        label: `${course.code}::${course.title}`,
        value: course.code,
        unitCost: course.unitCost,
        type: course.type,
        status: course.status,
      }));

      // Fetch Organisation Units
      const orgUnits = await trainingPlanLinesService.getOrganisationUnits(
        companyId
      );
      const orgUnitOptions = orgUnits.map((unit) => ({
        label: `${unit.code}::${unit.orgUnitName}`,
        value: unit.code,
      }));

      // Fetch Venues
      console.log("About to fetch venues from API...");
      const venueOptions: options[] = [];
      try {
        const venues = await trainingPlanLinesService.getVenues(companyId);
        console.log("Fetched venues:", venues);
        console.log("First venue structure:", venues[0]);

        if (venues && venues.length > 0) {
          venues.forEach((venue) => {
            console.log("Mapping venue:", venue);
            venueOptions.push({
              label: `${venue.code || "N/A"}::${venue.name || "N/A"}`,
              value: venue.code || "",
            });
          });
        } else {
          console.log("No venues returned from API, using sample data");
          // Fallback sample data for testing
          venueOptions.push(
            { label: "VEN001::Main Conference Room", value: "VEN001" },
            { label: "VEN002::Training Hall A", value: "VEN002" },
            { label: "VEN003::Boardroom", value: "VEN003" }
          );
        }
        console.log("Mapped venue options:", venueOptions);
      } catch (error) {
        console.error("Error fetching venues:", error);
        // Fallback sample data for testing
        venueOptions.push(
          { label: "VEN001::Main Conference Room", value: "VEN001" },
          { label: "VEN002::Training Hall A", value: "VEN002" },
          { label: "VEN003::Boardroom", value: "VEN003" }
        );
      }

      // Fetch Employees
      const employees = await trainingPlanLinesService.getEmployees(companyId);
      const employeeOptions = employees.map((employee) => ({
        label: `${employee.employeeId}::${employee.fullName}`,
        value: employee.employeeId,
      }));

      // Fetch Vendors
      const vendors = await trainingPlanLinesService.getVendors(companyId);
      const vendorOptions = vendors.map((vendor) => ({
        label: `${vendor.vendorCode}::${vendor.name}`,
        value: vendor.vendorCode,
      }));

      setState((prev) => ({
        ...prev,
        professionalCertificates: certificateOptions,
        coachingOptions: coachingOptions,
        conferenceOptions: conferenceOptions,
        courseOptions: courseOptions,
        organisationUnitOptions: orgUnitOptions,
        venueOptions: venueOptions,
        employeeOptions: employeeOptions,
        vendorOptions: vendorOptions,
      }));
    } catch (error) {
      toast.error(`Error fetching program options: ${getErrorMessage(error)}`);
    }
  }, [companyId]);

  const getProgramOptionsByCategory = useCallback(
    (category: string): options[] => {
      switch (category) {
        case "Certificate":
          return state.professionalCertificates;
        case "Coaching":
          return state.coachingOptions;
        case "Conference":
        case "Seminars":
        case "Workshops":
          return state.conferenceOptions.filter(
            (opt) =>
              (opt as any).trainingType === category ||
              (opt as any).trainingType === "Conference"
          );
        case "Course":
          return state.courseOptions;
        default:
          return [];
      }
    },
    [
      state.professionalCertificates,
      state.coachingOptions,
      state.conferenceOptions,
      state.courseOptions,
    ]
  );

  const createTrainingPlanLine = useCallback(
    async (lineData: Partial<TrainingPlanLine>) => {
      try {
        if (!formData.no) {
          toast.error("No training plan selected");
          return;
        }

        const data = {
          ...lineData,
          planNo: formData.no,
        };

        await trainingPlanLinesService.createTrainingPlanLine(companyId, data);
        toast.success("Training plan line created successfully");
        await fetchTrainingPlanLines(formData.no);
      } catch (error) {
        toast.error(
          `Error creating training plan line: ${getErrorMessage(error)}`
        );
      }
    },
    [companyId, formData.no, fetchTrainingPlanLines]
  );

  const updateTrainingPlanLine = useCallback(
    async (
      systemId: string,
      lineData: Partial<TrainingPlanLine>,
      etag: string
    ) => {
      try {
        await trainingPlanLinesService.updateTrainingPlanLine(
          companyId,
          systemId,
          lineData,
          etag
        );
        toast.success("Training plan line updated successfully");
        if (formData.no) {
          await fetchTrainingPlanLines(formData.no);
        }
      } catch (error) {
        toast.error(
          `Error updating training plan line: ${getErrorMessage(error)}`
        );
      }
    },
    [companyId, formData.no, fetchTrainingPlanLines]
  );

  const deleteTrainingPlanLine = useCallback(
    async (systemId: string, etag: string) => {
      try {
        await trainingPlanLinesService.deleteTrainingPlanLine(
          companyId,
          systemId,
          etag
        );
        toast.success("Training plan line deleted successfully");
        if (formData.no) {
          await fetchTrainingPlanLines(formData.no);
        }
      } catch (error) {
        toast.error(
          `Error deleting training plan line: ${getErrorMessage(error)}`
        );
      }
    },
    [companyId, formData.no, fetchTrainingPlanLines]
  );

  // Lines modal data handlers
  const updateLineModalData = useCallback((field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      lineModalData: {
        ...prev.lineModalData,
        [field]: value,
      },
    }));
  }, []);

  const clearLineModalData = useCallback(() => {
    setState((prev) => ({
      ...prev,
      lineModalData: {
        performanceGap: "",
        category: [],
        programCode: [],
        targetGroup: [],
        deliveryMethod: [],
        coachMentor: [],
        trainingProvider: [],
        trainingLocation: [],
        plannedStartDate: "",
        plannedEndDate: "",
        expectedParticipants: 0,
        estimatedUnitCost: 0,
        estimatedTotalCost: 0,
      },
    }));
  }, []);

  const populateLineModalData = useCallback(
    (lineData: any) => {
      console.log("Populating modal with line data:", lineData);

      // Helper function to find option by value
      const findOptionByValue = (options: options[], value: string) => {
        const found = options.find((opt) => opt.value === value);
        console.log(
          `Finding option for value "${value}":`,
          found || "Not found, using fallback"
        );
        return found || { label: value, value };
      };

      // Helper function to map category value to display label
      const getCategoryLabel = (value: string): string => {
        const categoryMap: Record<string, string> = {
          Certificate: "Professional Certificates",
          Coaching: "Coaching",
          Conference: "Conferences",
          Seminars: "Seminars",
          Workshops: "Workshops",
          Course: "Course",
        };
        return categoryMap[value] || value;
      };

      setState((prev) => ({
        ...prev,
        lineModalData: {
          performanceGap: lineData.performanceGap || "",
          category: lineData.category
            ? [
                {
                  label: getCategoryLabel(lineData.category),
                  value: lineData.category,
                },
              ]
            : [],
          programCode: lineData.programCode
            ? [
                findOptionByValue(
                  getProgramOptionsByCategory(lineData.category),
                  lineData.programCode
                ),
              ]
            : [],
          targetGroup: lineData.trainingGroup
            ? [
                findOptionByValue(
                  prev.organisationUnitOptions,
                  lineData.trainingGroup
                ),
              ]
            : [],
          deliveryMethod: lineData.deliveryMethod
            ? [
                {
                  label: lineData.deliveryMethod,
                  value: lineData.deliveryMethod,
                },
              ]
            : [],
          coachMentor: lineData.coach
            ? [findOptionByValue(prev.employeeOptions, lineData.coach)]
            : [],
          trainingProvider: lineData.trainingProvider
            ? [findOptionByValue(prev.vendorOptions, lineData.trainingProvider)]
            : [],
          trainingLocation: lineData.trainingLocation
            ? [findOptionByValue(prev.venueOptions, lineData.trainingLocation)]
            : [],
          plannedStartDate: lineData.plannedStartDate || "",
          plannedEndDate: lineData.plannedEndDate || "",
          expectedParticipants: lineData.expectedParticipants || 0,
          estimatedUnitCost: lineData.estimatedUnitCost || 0,
          estimatedTotalCost: lineData.estimatedTotalCost || 0,
        },
      }));
    },
    [
      getProgramOptionsByCategory,
      state.organisationUnitOptions,
      state.employeeOptions,
      state.vendorOptions,
      state.venueOptions,
    ]
  );

  // Expected participants management
  const fetchExpectedParticipants = useCallback(
    async (trainingNo: string, lineNo: number, programCode?: string) => {
      try {
        console.log("Fetching participants for:", {
          trainingNo,
          lineNo,
          programCode,
        });
        const participants =
          await expectedParticipantsService.getExpectedParticipants(
            companyId,
            trainingNo,
            lineNo,
            programCode
          );
        setState((prev) => ({
          ...prev,
          expectedParticipants: participants,
        }));
      } catch (error) {
        console.error("Error fetching expected participants:", error);
        toast.error(
          `Error fetching expected participants: ${getErrorMessage(error)}`
        );
      }
    },
    [companyId]
  );

  const openParticipantsModal = useCallback(
    (line: any) => {
      console.log("Opening participants modal for line:", line);
      setState((prev) => ({
        ...prev,
        isParticipantsModalOpen: true,
        selectedLineForParticipants: line,
      }));
      if (formData.no && line.lineNo) {
        console.log(
          "Fetching participants for training plan:",
          formData.no,
          "line:",
          line.lineNo,
          "programCode:",
          line.programCode
        );
        fetchExpectedParticipants(formData.no, line.lineNo, line.programCode);
      } else {
        console.warn("Missing training plan number or line number:", {
          trainingPlanNo: formData.no,
          lineNo: line.lineNo,
        });
      }
    },
    [formData.no, fetchExpectedParticipants]
  );

  const closeParticipantsModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isParticipantsModalOpen: false,
      selectedLineForParticipants: null,
      expectedParticipants: [],
    }));
  }, []);

  const openAddParticipantModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAddParticipantModalOpen: true,
      newParticipantData: {
        no: [],
        trainingNeed: prev.selectedLineForParticipants?.performanceGap || "",
      },
    }));
  }, []);

  const closeAddParticipantModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAddParticipantModalOpen: false,
      newParticipantData: {
        no: [],
        trainingNeed: "",
      },
    }));
  }, []);

  const updateNewParticipantData = useCallback((field: string, value: any) => {
    setState((prev) => ({
      ...prev,
      newParticipantData: {
        ...prev.newParticipantData,
        [field]: value,
      },
    }));
  }, []);

  const addExpectedParticipant = useCallback(async () => {
    try {
      if (
        state.newParticipantData.no.length === 0 ||
        !formData.no ||
        !state.selectedLineForParticipants?.lineNo
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      const participantData = {
        trainingNo: formData.no,
        trainingNeed: state.newParticipantData.trainingNeed,
        no: state.newParticipantData.no[0].value,
        lineNo: state.selectedLineForParticipants.lineNo,
        programCode: state.selectedLineForParticipants.programCode,
        attended: false,
      };

      console.log("Adding participant with data:", participantData);

      await expectedParticipantsService.createExpectedParticipant(
        companyId,
        participantData
      );
      toast.success("Participant added successfully");

      // Refresh participants list
      await fetchExpectedParticipants(
        formData.no,
        state.selectedLineForParticipants.lineNo,
        state.selectedLineForParticipants.programCode
      );

      // Close modal and reset form
      closeAddParticipantModal();
    } catch (error) {
      toast.error(`Error adding participant: ${getErrorMessage(error)}`);
    }
  }, [
    state.newParticipantData,
    state.selectedLineForParticipants,
    formData.no,
    companyId,
    fetchExpectedParticipants,
    closeAddParticipantModal,
  ]);

  const updateParticipantAttendance = useCallback(
    async (systemId: string, etag: string, attended: boolean) => {
      try {
        await expectedParticipantsService.updateExpectedParticipant(
          companyId,
          systemId,
          { attended },
          etag
        );
        toast.success("Attendance updated successfully");

        // Refresh participants list
        if (formData.no && state.selectedLineForParticipants?.lineNo) {
          await fetchExpectedParticipants(
            formData.no,
            state.selectedLineForParticipants.lineNo,
            state.selectedLineForParticipants.programCode
          );
        }
      } catch (error) {
        toast.error(`Error updating attendance: ${getErrorMessage(error)}`);
      }
    },
    [
      companyId,
      formData.no,
      state.selectedLineForParticipants,
      fetchExpectedParticipants,
    ]
  );

  const deleteExpectedParticipant = useCallback(
    async (systemId: string, etag: string) => {
      try {
        await expectedParticipantsService.deleteExpectedParticipant(
          companyId,
          systemId,
          etag
        );
        toast.success("Participant removed successfully");

        // Refresh participants list
        if (formData.no && state.selectedLineForParticipants?.lineNo) {
          await fetchExpectedParticipants(
            formData.no,
            state.selectedLineForParticipants.lineNo,
            state.selectedLineForParticipants.programCode
          );
        }
      } catch (error) {
        toast.error(`Error removing participant: ${getErrorMessage(error)}`);
      }
    },
    [
      companyId,
      formData.no,
      state.selectedLineForParticipants,
      fetchExpectedParticipants,
    ]
  );

  // Utility function to format numbers with commas
  const formatNumberWithCommas = (value: number | string): string => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "0";
    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // Utility function to parse comma-formatted numbers
  const parseCommaFormattedNumber = (value: string): number => {
    return parseFloat(value.replace(/,/g, "")) || 0;
  };

  // Utility function to format category for display
  const formatCategory = (value: string): string => {
    const categoryMap: Record<string, string> = {
      Certificate: "Professional Certificates",
      Coaching: "Coaching",
      Conference: "Conferences",
      Seminars: "Seminars",
      Workshops: "Workshops",
      Course: "Course",
    };
    return categoryMap[value] || value;
  };

  // Lines modal fields
  const getLinesModalFields = useCallback(() => {
    console.log("Current venue options:", state.venueOptions);
    const categoryOptions = [
      {
        label: "Professional Certificates",
        value: "Certificate",
      },
      { label: "Coaching", value: "Coaching" },
      { label: "Conferences", value: "Conference" },
      { label: "Seminars", value: "Seminars" },
      { label: "Workshops", value: "Workshops" },
      { label: "Course", value: "Course" },
    ];

    const deliveryMethodOptions = [
      { label: "On the job", value: "On the job" },
      { label: "Internal", value: "Internal" },
      { label: "External", value: "External" },
    ];

    const programOptions = getProgramOptionsByCategory(
      state.lineModalData.category[0]?.value || ""
    );

    return [
      [
        {
          label: "Performance Gap",
          type: "textarea",
          value: state.lineModalData.performanceGap,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            updateLineModalData("performanceGap", e.target.value);
          },
          id: "performanceGap",
          rows: 3,
          placeholder: "Describe the performance gap",
          required: true,
        },
        {
          label: "Category",
          type: "select",
          value: state.lineModalData.category,
          options: categoryOptions,
          onChange: (e: options) => {
            updateLineModalData("category", [
              { label: e.label, value: e.value },
            ]);
            // Reset program code when category changes
            updateLineModalData("programCode", []);
          },
          id: "category",
          required: true,
        },
        {
          label: "Program Code",
          type: "select",
          value: state.lineModalData.programCode,
          options: programOptions,
          onChange: (e: options) => {
            updateLineModalData("programCode", [
              { label: e.label, value: e.value },
            ]);
            // Auto-populate estimated unit cost from selected program
            if ((e as any).unitCost) {
              updateLineModalData("estimatedUnitCost", (e as any).unitCost);
              // Auto-calculate estimated total cost
              const totalCost =
                (e as any).unitCost * state.lineModalData.expectedParticipants;
              updateLineModalData("estimatedTotalCost", totalCost);
            }
          },
          id: "programCode",
          required: true,
          disabled: state.lineModalData.category.length === 0,
        },
      ],
      [
        {
          label: "Target Group",
          type: "select",
          value: state.lineModalData.targetGroup,
          options: state.organisationUnitOptions,
          onChange: (e: options) => {
            updateLineModalData("targetGroup", [
              { label: e.label, value: e.value },
            ]);
          },
          id: "targetGroup",
          placeholder: "Select target group",
        },
        {
          label: "Delivery Method",
          type: "select",
          value: state.lineModalData.deliveryMethod,
          options: deliveryMethodOptions,
          onChange: (e: options) => {
            updateLineModalData("deliveryMethod", [
              { label: e.label, value: e.value },
            ]);
            // Reset conditional fields when delivery method changes
            updateLineModalData("coachMentor", []);
            updateLineModalData("trainingProvider", []);
          },
          id: "deliveryMethod",
          placeholder: "Select delivery method",
        },
        {
          label: "Training Location",
          type: "select",
          value: state.lineModalData.trainingLocation,
          options: state.venueOptions,
          onChange: (e: options) => {
            console.log("Training location selected:", e);
            updateLineModalData("trainingLocation", [
              { label: e.label, value: e.value },
            ]);
          },
          id: "trainingLocation",
          placeholder: "Select training location",
        },
      ],
      // Conditional fields based on delivery method
      ...(state.lineModalData.deliveryMethod[0]?.value === "Internal"
        ? [
            [
              {
                label: "Coach/Mentor (Internal)",
                type: "select",
                value: state.lineModalData.coachMentor,
                options: state.employeeOptions,
                onChange: (e: options) => {
                  updateLineModalData("coachMentor", [
                    { label: e.label, value: e.value },
                  ]);
                },
                id: "coachMentor",
                placeholder: "Select coach/mentor",
                required: true,
              },
            ],
          ]
        : []),
      ...(state.lineModalData.deliveryMethod[0]?.value === "External"
        ? [
            [
              {
                label: "Training Provider",
                type: "select",
                value: state.lineModalData.trainingProvider,
                options: state.vendorOptions,
                onChange: (e: options) => {
                  updateLineModalData("trainingProvider", [
                    { label: e.label, value: e.value },
                  ]);
                },
                id: "trainingProvider",
                placeholder: "Select training provider",
                required: true,
              },
            ],
          ]
        : []),
      [
        {
          label: "Planned Start Date",
          type: "date",
          value: state.lineModalData.plannedStartDate,
          onChange: (_selectedDates: Date[], dateStr: string) => {
            updateLineModalData("plannedStartDate", dateStr);
          },
          id: "plannedStartDate",
          placeholder: "Select start date",
        },
        {
          label: "Planned End Date",
          type: "date",
          value: state.lineModalData.plannedEndDate,
          onChange: (_selectedDates: Date[], dateStr: string) => {
            updateLineModalData("plannedEndDate", dateStr);
          },
          id: "plannedEndDate",
          placeholder: "Select end date",
        },
        {
          label: "Expected Participants",
          type: "number",
          value: state.lineModalData.expectedParticipants,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const participants = parseInt(e.target.value) || 0;
            updateLineModalData("expectedParticipants", participants);
            // Auto-calculate estimated total cost
            const totalCost =
              participants * state.lineModalData.estimatedUnitCost;
            updateLineModalData("estimatedTotalCost", totalCost);
          },
          id: "expectedParticipants",
          min: 1,
          step: 1,
          placeholder: "Number of participants",
        },
      ],
      [
        {
          label: "Estimated Unit Cost",
          type: "text",
          value: formatNumberWithCommas(state.lineModalData.estimatedUnitCost),
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const unitCost = parseCommaFormattedNumber(e.target.value);
            updateLineModalData("estimatedUnitCost", unitCost);
            // Auto-calculate estimated total cost
            const totalCost =
              unitCost * state.lineModalData.expectedParticipants;
            updateLineModalData("estimatedTotalCost", totalCost);
          },
          id: "estimatedUnitCost",
          placeholder: "Cost per participant",
        },
        {
          label: "Estimated Total Cost",
          type: "text",
          value: formatNumberWithCommas(state.lineModalData.estimatedTotalCost),
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            updateLineModalData(
              "estimatedTotalCost",
              parseCommaFormattedNumber(e.target.value)
            );
          },
          id: "estimatedTotalCost",
          placeholder: "Total estimated cost",
          disabled: true,
        },
      ],
    ];
  }, [
    state.lineModalData,
    state.organisationUnitOptions,
    state.venueOptions,
    state.employeeOptions,
    state.vendorOptions,
    getProgramOptionsByCategory,
    updateLineModalData,
    formatNumberWithCommas,
    parseCommaFormattedNumber,
  ]);

  // Lines table columns
  const getLinesColumns = useCallback(() => {
    return [
      {
        dataField: "lineNo",
        text: "Line No",
        sort: true,
      },
      {
        dataField: "performanceGap",
        text: "Performance Gap",
        sort: true,
      },
      {
        dataField: "category",
        text: "Category",
        sort: true,
        formatter: (cell: any) => formatCategory(cell),
      },
      {
        dataField: "programCode",
        text: "Program Code",
        sort: true,
      },
      {
        dataField: "programDescription",
        text: "Program Description",
        sort: true,
      },
      {
        dataField: "trainingGroup",
        text: "Training Group",
        sort: true,
      },
      {
        dataField: "deliveryMethod",
        text: "Delivery Method",
        sort: true,
      },
      {
        dataField: "trainingLocation",
        text: "Training Location",
        sort: true,
      },
      {
        dataField: "coach",
        text: "Coach/Mentor",
        sort: true,
      },
      {
        dataField: "trainingProvider",
        text: "Training Provider",
        sort: true,
      },
      {
        dataField: "plannedStartDate",
        text: "Planned Start Date",
        sort: true,
        formatter: (cell: any) =>
          cell ? new Date(cell).toLocaleDateString() : "",
      },
      {
        dataField: "plannedEndDate",
        text: "Planned End Date",
        sort: true,
        formatter: (cell: any) =>
          cell ? new Date(cell).toLocaleDateString() : "",
      },
      {
        dataField: "expectedParticipants",
        text: "Expected Participants",
        sort: true,
      },
      {
        dataField: "estimatedUnitCost",
        text: "Estimated Unit Cost",
        sort: true,
        formatter: (cell: any) => formatNumberWithCommas(cell || 0),
      },
      {
        dataField: "estimatedTotalCost",
        text: "Estimated Total Cost",
        sort: true,
        formatter: (cell: any) => formatNumberWithCommas(cell || 0),
      },
      {
        dataField: "action",
        isDummyField: true,
        text: "Action",
        formatter: (cell: any) => cell,
      },
    ];
  }, []);

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
    // Lines functions
    fetchTrainingPlanLines,
    fetchProgramOptions,
    getProgramOptionsByCategory,
    createTrainingPlanLine,
    updateTrainingPlanLine,
    deleteTrainingPlanLine,
    getLinesModalFields,
    getLinesColumns,
    // Lines modal functions
    updateLineModalData,
    clearLineModalData,
    populateLineModalData,
    // Expected participants functions
    fetchExpectedParticipants,
    openParticipantsModal,
    closeParticipantsModal,
    openAddParticipantModal,
    closeAddParticipantModal,
    updateNewParticipantData,
    addExpectedParticipant,
    updateParticipantAttendance,
    deleteExpectedParticipant,
  };
};
