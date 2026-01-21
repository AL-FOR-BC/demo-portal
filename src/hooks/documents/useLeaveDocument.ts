import { useAppSelector } from "../../store/hook";
import { useState } from "react";
import {
  formatDate,
  formatPhoneNumber,
  getErrorMessage,
} from "../../utils/common";
import { toast } from "react-toastify";
import { leaveService } from "../../services/LeaveServices";
import {
  initialLeaveDocumentState,
  LeaveDocumentState,
  LeaveFormData,
} from "../../@types/documents/leave.types";
import { DocumentTypeMode } from "../../@types/documents/base.types";
import { options } from "../../@types/common.dto";
import { commonService } from "../../services/CommonServices";
import {
  LeaveCategory,
  leaveCategoryLabels,
} from "../../@types/enums/leave.enum";
import { useNavigate } from "react-router-dom";
import { quickUpdate } from "../../helpers/quickUpdate";
import { FormValidator } from "../../utils/hooks/validation";

const initialFormData: LeaveFormData = {
  documentNo: "",
  telephoneNumber: "",
  delegate: { label: "", value: "" },
  leaveCategoryType: { label: "", value: "" },
  fromDate: "",
  toDate: "",
  leaveAddress: "",
};

export const useLeaveDocument = ({ mode }: { mode: DocumentTypeMode }) => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo, employeeGender, employeeName, jobTitle } = useAppSelector(
    (state) => state.auth.user
  );
  const navigate = useNavigate();

  const [state, setState] = useState<LeaveDocumentState>(
    initialLeaveDocumentState
  );
  const [formData, setFormData] = useState<LeaveFormData>(initialFormData);
  const [delegateOptions, setDelegateOptions] = useState<options[]>([]);
  const [docSystemId, setDocSystemId] = useState<string>("");

  // ------------------------------------- ACTIONS -------------------------------------
  const submitLeaveRequest = async () => {
    // check for empyt field s
    if (
      !formData.leaveCategoryType ||
      !formData.delegate ||
      !formData.fromDate ||
      !formData.toDate
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const payload = {
        documentNo: formData.documentNo || "",
        employeeNo: employeeNo || "",
        leaveCategoryType:
          typeof formData.leaveCategoryType === "object"
            ? formData.leaveCategoryType.value
            : formData.leaveCategoryType,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        delegate:
          typeof formData.delegate === "object"
            ? formData.delegate.value
            : formData.delegate,
        telephoneNumber: formData.telephoneNumber,
        leaveAddress: formData.leaveAddress,
      };
      console.log(payload);
      const response = await leaveService.createLeaveRequest(
        companyId,
        payload
      );
      // send patch request to update the leave type
      await leaveService.updateLeaveRequest(
        companyId,
        "PATCH",
        {
          leaveCategoryType:
            typeof formData.leaveCategoryType === "object"
              ? formData.leaveCategoryType.value
              : formData.leaveCategoryType,
        },
        response.data.systemId,
        "*"
      );
      toast.success("Leave request created successfully");
      navigate(`/leave-request-details/${response.data.systemId}`);
      return true;
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const deleteLeaveRequest = async (systemId: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await leaveService.deleteLeaveRequest(companyId, systemId);
      toast.success("Leave request deleted successfully");
      navigate("/leave-requests");
      return true;
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const sendLeaveRequestForApproval = async (
    documentNo: string,
    senderEmailAddress: string
  ) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const isValid = handleValidateHeaderFields();
      if (!isValid) return;
      const response = await leaveService.sendLeaveRequestForApproval(
        companyId,
        {
          no: documentNo,
          senderEmailAddress: senderEmailAddress,
        }
      );
      if (response) {
        toast.success(`Leave request ${documentNo} sent for approval`);
        populateDocument(docSystemId);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };
  const cancelLeaveRequest = async (documentNo: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await leaveService.cancelLeaveRequest(companyId, {
        no: documentNo,
      });
      if (response) {
        toast.success(`Leave request ${documentNo} cancelled`);
        populateDocument(docSystemId);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const fetchDelegateOptions = async () => {
    const response = await commonService.getEmployeeList(companyId);
    const options = response.map((delegate) => ({
      label: `${delegate.No}:${delegate.FirstName}${" "} ${delegate.LastName}`,
      value: delegate.No,
    }));
    setDelegateOptions(options);
    return options;
  };

  const populateDocumentDetail = async (
    systemId: string,
    options: options[]
  ) => {
    const response = await leaveService.getLeaveRequest(companyId, systemId);
    setDocSystemId(systemId);
    setFormData(response);
    // set Options form date ie delegate, leave category, etc

    options.map((delegate) => {
      if (delegate.value === response.delegate) {
        setFormData((prev) => ({
          ...prev,
          delegate: {
            label: delegate.label,
            value: delegate.value,
          },
        }));
      }
    });

    // set leave category
    Object.values(LeaveCategory).map((leaveCategory) => {
      if (leaveCategory === response.leaveCategoryType) {
        setFormData((prev) => ({
          ...prev,
          leaveCategoryType: {
            label: leaveCategoryLabels[leaveCategory],
            value: leaveCategory,
          },
        }));
      }
    });
  };

  const populateDocument = async (systemId?: string, documentNo?: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      if (mode === "list") {
        const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
        const response = await leaveService.getLeaveRequests(
          companyId,
          filterQuery
        );
        setState((prev) => ({
          ...prev,
          leaveRequests: response,
        }));
      }
      if (mode === "add") {
        await fetchDelegateOptions();
      }
      if (mode === "detail" && systemId) {
        const options = await fetchDelegateOptions();
        if (options) {
          await populateDocumentDetail(systemId, options);
        }
      }
      if (mode === "approve") {
        const filterQuery = `$filter=documentNo eq '${documentNo}'`;
        const response = await leaveService.getLeaveRequests(
          companyId,
          filterQuery
        );
        const delegateOptions = await fetchDelegateOptions();
        delegateOptions.map((delegate) => {
          if (delegate.value === response[0].delegate) {
            setFormData((prev) => ({
              ...prev,
              delegate: {
                label: delegate.label,
                value: delegate.value,
              },
            }));
          }
        });
        setFormData((prev) => ({
          ...prev,
          employeeNo: response[0].employeeNo,
          employeeName: response[0].employeeName,
          employeeTitle: response[0].employeeTitle,
          documentNo: response[0].documentNo,
          telephoneNumber: response[0].telephoneNumber,
          leaveCategoryType: {
            label: leaveCategoryLabels[response[0].leaveCategoryType],
            value: response[0].leaveCategoryType,
          },
          fromDate: response[0].fromDate,
          toDate: response[0].toDate,
          leaveAddress: response[0].leaveAddress,
          status: response[0].status,
          noofDays: response[0].noofDays,
        }));
      }
    } catch (error) {
      toast.error(`Error fetching data: ${getErrorMessage(error)}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const getFilteredLeaveCategories = () => {
    return Object.values(LeaveCategory)
      .filter((category) => {
        if (
          employeeGender === "Female" &&
          category === LeaveCategory.PATERNITY
        ) {
          return false;
        }
        if (employeeGender === "Male" && category === LeaveCategory.MATERNITY) {
          return false;
        }
        return true;
      })
      .map((category, count = 1) => {
        count++;
        return {
          value: category,
          label: leaveCategoryLabels[category],
        };
      });
  };

  const handleInputChange = (
    field: keyof LeaveFormData,
    value: string | options
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFieldUpdate = async (
    field: keyof LeaveFormData,
    value: string
  ) => {
    if (!docSystemId) return;
    return quickUpdate({
      companyId,
      id: docSystemId,
      apiService: leaveService.updateLeaveRequest.bind(leaveService), // Important: bind the method
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
        label: "Requisition No",
        type: "text",
        value: formData.documentNo || "",
        disabled: true,
        id: "requestNo",
      },
      {
        label: "Requestor No",
        type: "text",
        value: mode == "approve" ? formData.employeeNo : employeeNo,
        disabled: true,
        id: "empNo",
      },
      {
        label: "Requestor Name",
        type: "text",
        value: mode == "approve" ? formData.employeeName : employeeName,
        disabled: true,
        id: "empName",
      },
      {
        label: "Employment Title",
        type: "text",
        value: mode == "approve" ? formData.employeeTitle : jobTitle,
        disabled: true,
        id: "empTitle",
      },
    ];
    const detailFields =
      mode === "detail" || mode === "approve"
        ? [
            {
              label: "Number Of Days",
              type: "text",
              value: formData.noofDays || "",
              id: "numberOfDays",
              disabled: true,
            },
            {
              label: "Status",
              type: "text",
              value: formData.status || "",
              id: "docStatus",
              disabled: true,
            },
          ]
        : [];
    const editableFields = [
      {
        label: "Telephone Number",
        type: "text",
        value: formData.telephoneNumber || "",
        id: "telephoneNumber",
        disabled: isFieldDisabled,
        placeholder: "XXX-XXX-XXXX",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          handleInputChange(
            "telephoneNumber",
            formatPhoneNumber(e.target.value)
          );
        },
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          if (mode === "detail") {
            handleFieldUpdate(
              "telephoneNumber",
              formatPhoneNumber(e.target.value)
            );
          }
        },
        required: true,
      },
      {
        label: "Leave Category",
        type: "select",
        options: getFilteredLeaveCategories(),
        value: formData.leaveCategoryType || "",
        disabled: isFieldDisabled,
        onChange: (e: options) => {
          handleInputChange("leaveCategoryType", {
            label: e.label,
            value: e.value,
          });
          if (mode === "detail") {
            handleFieldUpdate("leaveCategoryType", e.value);
          }
        },
        required: true,
      },
      {
        label: "Delegate",
        type: "select",
        options: delegateOptions,
        value: formData.delegate || "",
        id: "delegate",
        disabled: isFieldDisabled,
        onChange: (e: options) => {
          handleInputChange("delegate", { value: e.value, label: e.label });
          if (mode === "detail") {
            handleFieldUpdate("delegate", e.value);
          }
        },
        required: true,
      },
      {
        label: "Start Date",
        type: "date",
        value: formData.fromDate
          ? formData.fromDate === "0001-01-01"
            ? ""
            : formData.fromDate
          : "",
        id: "startDate",
        disabled: isFieldDisabled,
        onChange: (date: any) => {
          const formattedDate = formatDate(date[0]);
          handleInputChange("fromDate", formattedDate);
          if (mode === "detail" && formattedDate) {
            handleFieldUpdate("fromDate", formattedDate);
          }
        },
        min: new Date().toISOString().split("T")[0],
        required: true,
      },

      {
        label: "End Date",
        type: "date",
        value: formData.toDate
          ? formData.toDate === "0001-01-01"
            ? ""
            : formData.toDate
          : "",
        id: "endDate",
        disabled: isFieldDisabled,
        onChange: (date: any) => {
          const formattedDate = formatDate(date[0]);
          handleInputChange("toDate", formattedDate);
          if (mode === "detail" && formattedDate) {
            handleFieldUpdate("toDate", formattedDate);
          }
        },
        min: formData.fromDate || new Date().toISOString().split("T")[0],
        required: true,
      },
      ...(detailFields.length ? detailFields : []),
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
    submitLeaveRequest,
    deleteLeaveRequest,
    formData,
    handleInputChange,
    delegateOptions,
    getFormFields,
    sendLeaveRequestForApproval,
    cancelLeaveRequest,
  };
};
