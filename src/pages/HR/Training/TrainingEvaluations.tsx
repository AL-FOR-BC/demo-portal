import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { trainingEvaluationService } from "../../../services/TrainingEvaluationService";
import { TrainingEvaluation } from "../../../@types/trainingEvaluation.dto";
import { getErrorMessage } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";
import TableMui from "../../../Components/ui/Table/TableMui";

const TrainingEvaluations: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);
  const [evaluations, setEvaluations] = useState<TrainingEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvaluations();
  }, [companyId, employeeNo]);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const filterQuery = `$filter=employeeNo eq '${employeeNo}'`;
      const data = await trainingEvaluationService.getTrainingEvaluations(
        companyId,
        filterQuery
      );
      setEvaluations(data);
    } catch (error) {
      toast.error(
        `Error fetching training evaluations: ${getErrorMessage(error)}`
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
      dataField: "employeeName",
      text: "Employee Name",
      sort: true,
    },
    {
      dataField: "trainingType",
      text: "Training Type",
      sort: true,
    },
    {
      dataField: "trainingPlan",
      text: "Training Plan",
      sort: true,
    },
    {
      dataField: "actualStartDate",
      text: "Actual Start Date",
      sort: true,
    },
    {
      dataField: "actualEndDate",
      text: "Actual End Date",
      sort: true,
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
          navigateTo="/training-evaluation-details"
        />
      ),
    },
  ];

  return (
    <TableMui
      title="Training Evaluations"
      subTitle="List of Training Evaluations"
      addLink="/add-training-evaluation"
      addLabel="Add Training Evaluation"
      data={evaluations}
      columns={columns}
      breadcrumbItem="Training Evaluations"
      noDataMessage="No Training Evaluations found"
      iconClassName="fa fa-graduation-cap"
      isLoading={loading}
    />
  );
};

export default TrainingEvaluations;
