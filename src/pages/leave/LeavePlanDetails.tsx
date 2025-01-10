import { useEffect, useState } from "react";

import { options } from "../../@types/common.dto";
import { apiEmployees } from "../../services/CommonServices";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  apiLeavePlanDetail,
  apiLeavePlanLines,
} from "../../services/LeaveServices";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { formatDate, getErrorMessage } from "../../utils/common";
import Lines from "../../Components/ui/Lines/Lines";
import HeaderMui from "../../Components/ui/Header/HeaderMui";
import {
  closeModalRequisition,
  editRequisitionLine,
  modelLoadingRequisition,
  openModalRequisition,
} from "../../store/slices/Requisitions";
import { ActionFormatterLines } from "../../Components/ui/Table/TableUtils";
import { quickUpdate } from "../../helpers/quickUpdate";
export default function LeavePlanDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState("");
  const [employeeOptions, setEmployeeOptions] = useState<options[]>([]);
  const [selectedDelegatee, setSelectedDelegatee] = useState<options[]>([]);
  const [postingDate, setPostingDate] = useState<Date>();
  const [leavePlanLines, setLeavePlanLines] = useState<any[]>([]);
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo, employeeName } = useAppSelector(
    (state) => state.auth.user
  );
  const [leavePlanNo, setLeavePlanNo] = useState("");
  const [lineSystemId, setLineSystemId] = useState("");
  const [lineEtag, setLineEtag] = useState("");

  const leaveTypeOptions: options[] = [{ label: "Annual", value: "Annual" }];

  const [leaveType, setLeaveType] = useState<options>({ label: "", value: "" });
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");

  const columns = [
    {
      // field: 'leaveType',
      // headerName: 'Leave Type',
      // type: 'singleSelect',
      // width: 180,
      // editable: true,
      // valueOptions: ['Annual', 'Medical', 'Maternity', 'Paternity', 'Bereavement'],
      dataField: "leaveType",
      text: "Leave Type",
      sort: true,
    },
    {
      dataField: "startDate",
      text: "Start Date",
      sort: true,
    },
    {
      dataField: "endDate",
      text: "End Date",
      sort: true,
    },

    {
      dataField: "description",
      text: "Description",
      sort: true,
    },

    {
      dataField: "quantity",
      text: "Quantity",
      sort: true,
    },
    {
      dataField: "action",
      text: "Action",
      sort: true,
      isDummyField: true,
      formatter: (cellContent: any, row: any) => {
        console.log(cellContent);
        return (
          <ActionFormatterLines
            row={row}
            companyId={companyId}
            apiHandler={apiLeavePlanLines}
            handleEditLine={handleEditLine}
            handleDeleteLine={handleDeleteLine}
            populateData={populateData}
          />
        );
      },
    },
  ];

  const modalFields = [
    [
      {
        label: "Leave Type",
        type: "select",
        value: leaveType,
        id: "leaveType",
        options: leaveTypeOptions,
        onChange: (e: options) => {
          setLeaveType({ label: e.label, value: e.value });
        },
      },

      {
        label: "Start Date",
        type: "date",
        value: startDate,
        id: "startDate",
        onChange: (e: Date) => setStartDate(e),
      },
      {
        label: "End Date",
        type: "date",
        value: endDate,
        id: "endDate",
        onChange: (e: Date) => setEndDate(e),
      },
      {
        label: "Description",
        type: "textarea",
        value: description,
        id: "description",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setDescription(e.target.value),
      },
    ],
  ];

  const fields = [
    [
      {
        label: "Requisition No",
        type: "text",
        value: leavePlanNo,
        disabled: true,
        id: "leavePlanNo",
      },
      {
        label: "Requestor No",
        type: "text",
        value: employeeNo,
        disabled: true,
        id: "empNo",
      },
      {
        label: "Requestor Name",
        type: "text",
        value: employeeName,
        disabled: true,
        id: "empName",
      },

      {
        label: "Posting Date",
        type: "date",
        value: postingDate,
        disabled: true,
        onChange: (e: Date) => setPostingDate(e),
        id: "documentDate",
      },
      {
        label: "Status",
        type: "text",
        value: status,
        id: "docStatus",
        disabled: true,
      },

      {
        label: "Delegatee",
        type: "select",
        value: selectedDelegatee,
        options: employeeOptions,
        onChange: async (e: options) => {
          const quickUpdateResponse = await handleQuickUpdate({
            delegate: e.value,
          });
          if (quickUpdateResponse) {
            setSelectedDelegatee([{ label: e.label, value: e.value }]);
          }
        },
        id: "delegatee",
      },
    ],
  ];

  const handleQuickUpdate = async (updateData: Record<string, any>) => {
    const quickUpdateResponse = await quickUpdate({
      companyId,
      id: id || "",
      apiService: apiLeavePlanDetail,
      data: updateData,
      successMessage: "Leave plan updated successfully",
      errorMessage: "Error updating leave plan",
      onSucesss: () => {
        // populateData();
      },
      onError: () => {
        // toast.error(getErrorMessage(error));
      },
    });
    return quickUpdateResponse;
  };

  const populateData = async () => {
    setIsLoading(true);
    try {
      if (id) {
        const filterQuery = `$expand=leavePlanLines`;
        const res = await apiLeavePlanDetail(
          companyId,
          "GET",
          undefined,
          id,
          undefined,
          filterQuery
        );
        if (res.data) {
          const data = res.data;
          // setLeavePlan(res.data)
          setLeavePlanNo(data.documentNo);
          setPostingDate(
            data.postingDate ? new Date(data.postingDate) : undefined
          );
          setStatus(data.status);
          // setSelectedDelegatee([{ label: res.data.delegate, value: res.data.delegate }])
          setLeavePlanLines(res.data.leavePlanLines);
        }
        const resEmployee = await apiEmployees(companyId);
        let employeeOptions: options[] = [];
        resEmployee.data.value.map((e) => {
          employeeOptions.push({
            label: `${e.No}::${e.LastName}-${e.FirstName}`,
            value: e.No,
          });
        });
        setEmployeeOptions(employeeOptions);

        const delegate = employeeOptions.find(
          (e) => e.value === res.data.delegate
        );
        if (delegate) {
          setSelectedDelegatee([delegate]);
        }
      }
    } catch (error) {
      toast.error(`Error fetching leave plan: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitLines = async () => {
    dispatch(modelLoadingRequisition(true));
    const data = {
      leaveType: leaveType.value,
      startDate: startDate ? formatDate(startDate.toString()) : "",
      endDate: endDate ? formatDate(endDate.toString()) : "",
      description: description,
      documentNo: leavePlanNo,
    };
    if (data) {
      try {
        const res = await apiLeavePlanLines(
          companyId,
          "POST",
          data,
          undefined,
          undefined,
          undefined
        );
        console.log(res);
        if (res.status === 201 || res.status === 200) {
          toast.success("Leave plan line added successfully");
          populateData();
          dispatch(closeModalRequisition());
        }
        // return res
      } catch (error) {
        toast.error(`Error submitting leave plan: ${getErrorMessage(error)}`);
      } finally {
        dispatch(modelLoadingRequisition(false));
      }
    }
  };

  const clearLineFields = () => {
    setLeaveType({ label: "", value: "" });
    setStartDate(null);
    setEndDate(null);
    setDescription("");
  };
  const handleEditLine = (row: any) => {
    clearLineFields();
    dispatch(modelLoadingRequisition(true));
    dispatch(openModalRequisition());
    dispatch(editRequisitionLine(true));
    setLeaveType({ label: row.leaveType, value: row.leaveType });
    setStartDate(new Date(row.startDate));
    setEndDate(new Date(row.endDate));
    setDescription(row.description);
    setLineSystemId(row.SystemId);
    setLineEtag(row["@odata.etag"]);
    dispatch(modelLoadingRequisition(false));
  };

  const handleSubmitUpdatedLine = async () => {
    try {
      const data = {
        leaveType: leaveType.value,
        startDate: startDate ? formatDate(startDate.toString()) : "",
        endDate: endDate ? formatDate(endDate.toString()) : "",
        description: description,
        documentNo: leavePlanNo,
      };
      console.log(lineSystemId, lineEtag);
      if (lineSystemId && lineEtag) {
        const res = await apiLeavePlanLines(
          companyId,
          "PATCH",
          data,
          lineSystemId,
          lineEtag,
          undefined
        );
        console.log(res);

        if (res.status === 200) {
          toast.success("Leave plan line updated successfully");
          populateData();
          dispatch(closeModalRequisition());
        }
      }
    } catch (error) {
      toast.error(`Error updating leave plan line: ${getErrorMessage(error)}`);
    } finally {
      dispatch(modelLoadingRequisition(false));
    }
  };

  const handleDeleteLine = async (row: any) => {
    console.log(row);
  };

  useEffect(() => {
    populateData();
  }, []);
  return (
    <HeaderMui
      title="Leave Plan Details"
      subtitle="Leave Plan Details"
      breadcrumbItem="Leave Plan Details"
      documentType="Leave Plan"
      fields={fields}
      isLoading={isLoading}
      handleBack={() => navigate("/leave-plans")}
      pageType="detail"
      status={status}
      // rowLines={leavePlanLines}
      handleSubmitLines={handleSubmitLines}
      lines={
        <Lines
          title="Leave Plan Lines"
          subTitle="Leave Plan Lines"
          breadcrumbItem="Leave Plan Lines"
          addLink=""
          addLabel=""
          iconClassName=""
          noDataMessage="No lines found"
          data={leavePlanLines}
          status={status}
          modalFields={modalFields}
          columns={columns}
          handleSubmitLines={() => {
            handleSubmitLines();
          }}
          handleSubmitUpdatedLine={() => {
            handleSubmitUpdatedLine();
          }}
          clearLineFields={() => {
            setLeaveType({ label: "", value: "" });
            setStartDate(null);
            setEndDate(null);
            setDescription("");
          }}
          handleValidateHeaderFields={() => true}
        />
      }
    />
  );
}
