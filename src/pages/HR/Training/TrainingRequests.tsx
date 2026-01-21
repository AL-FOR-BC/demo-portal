import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { trainingRequestService } from "../../../services/TrainingRequestService";
import { TrainingRequest } from "../../../@types/trainingRequest.dto";
import { getErrorMessage } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";
import TableMui from "../../../Components/ui/Table/TableMui";

const TrainingRequests: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingRequests();
  }, [companyId, employeeNo]);

  const fetchTrainingRequests = async () => {
    try {
      setLoading(true);
      const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
      const data = await trainingRequestService.getTrainingRequests(
        companyId,
        filterQuery
      );
      setTrainingRequests(data);
    } catch (error) {
      toast.error(
        `Error fetching training requests: ${getErrorMessage(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      dataField: "no",
      text: "No",
      sort: true,
    },
    {
      dataField: "employeeNo",
      text: "Employee No",
      sort: true,
    },
    {
      dataField: "type",
      text: "Type",
      sort: true,
    },
    {
      dataField: "code",
      text: "Code",
      sort: true,
    },
    {
      dataField: "skillsToBeImparted",
      text: "Skills to be Imparted",
      sort: true,
    },
    {
      dataField: "plannedStartDate",
      text: "Planned Start Date",
      sort: true,
    },
    {
      dataField: "plannedEndDate",
      text: "Planned End Date",
      sort: true,
    },
    {
      dataField: "cost",
      text: "Cost",
      sort: true,
      formatter: (cell: any) => {
        return cell ? `${cell.toLocaleString()}` : "0";
      },
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
    },
    {
      dataField: "action",
      isDummyField: true,
      text: "Action",
      formatter: (cell: any, row: any) => (
        <ActionFormatter
          row={row}
          cellContent={cell}
          navigateTo="/training-request-details"
        />
      ),
    },
  ];

  return (
    <TableMui
      title="Training Requests"
      subTitle="List of Training Requests"
      addLink="/add-training-request"
      addLabel="Add Training Request"
      data={trainingRequests}
      columns={columns}
      breadcrumbItem="Training Requests"
      noDataMessage="No Training Requests found"
      iconClassName="fa fa-graduation-cap"
      isLoading={loading}
    />
  );
};

export default TrainingRequests;
