import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { trainingPlanService } from "../../../services/TrainingPlanService";
import { TrainingPlan } from "../../../@types/trainingPlan.dto";
import { getErrorMessage } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";
import TableMui from "../../../Components/ui/Table/TableMui";

const TrainingPlans: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainingPlans();
  }, [companyId, employeeNo]);

  const fetchTrainingPlans = async () => {
    try {
      setLoading(true);
      const filterQuery = `$filter=employeeId eq '${employeeNo}'`;
      const data = await trainingPlanService.getTrainingPlans(
        companyId,
        filterQuery
      );
      setTrainingPlans(data);
    } catch (error) {
      toast.error(`Error fetching training plans: ${getErrorMessage(error)}`);
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
      dataField: "trainingDescription",
      text: "Training Description",
      sort: true,
    },
    {
      dataField: "directorate",
      text: "Directorate",
      sort: true,
    },
    {
      dataField: "businessUnit",
      text: "Business Unit",
      sort: true,
    },
    {
      dataField: "totalCost",
      text: "Total Cost",
      sort: true,
      formatter: (cell: any) => `$${cell?.toFixed(2) || "0.00"}`,
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
          navigateTo="/training-plan-details"
        />
      ),
    },
  ];

  return (
    <TableMui
      title="Training Plans"
      subTitle="List of Training Plans"
      addLink="/add-training-plan"
      addLabel="Add Training Plan"
      data={trainingPlans}
      columns={columns}
      breadcrumbItem="Training Plans"
      noDataMessage="No Training Plans found"
      iconClassName="fa fa-graduation-cap"
      isLoading={loading}
    />
  );
};

export default TrainingPlans;
