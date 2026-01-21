import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { grievanceCasesService } from "../../../services/GrievanceCasesService";
import { GrievanceCase } from "../../../@types/grievanceCases.dto";
import { getErrorMessage } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";
import TableMui from "../../../Components/ui/Table/TableMui";

const GrievanceCases: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);
  const [grievanceCases, setGrievanceCases] = useState<GrievanceCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievanceCases();
  }, [companyId, employeeNo]);

  const fetchGrievanceCases = async () => {
    try {
      setLoading(true);
      const filterQuery = `$filter=caseRegisteredByNo eq '${employeeNo}'`;
      const data = await grievanceCasesService.getGrievanceCases(
        companyId,
        filterQuery
      );
      setGrievanceCases(data);
    } catch (error) {
      toast.error(`Error fetching Grievance Cases: ${getErrorMessage(error)}`);
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
      dataField: "caseRegisteredByNo",
      text: "Case Registered By No",
      sort: true,
    },
    {
      dataField: "caseRegisteredByName",
      text: "Case Registered By Name",
      sort: true,
    },    
    {
      dataField: "incidentDate",
      text: "Incident Date",
      sort: true,
    },
    {
      dataField: "dateRaised",
      text: "Date Raised",
      sort: true,
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: statusFormatter,
    },
    {
      dataField: "natureOfGrievance",
      text: "Nature of Grievance",
      sort: true,
    },
    {
      dataField: "caseRegisteredByName",
      text: "Case Registered By",
      sort: true,
    },
    {
      dataField: "action",
      isDummyField: true,
      text: "Action",
      formatter: (cell: any, row: any) => (
        <ActionFormatter
          row={row}
          cellContent={cell}
          navigateTo="/grievance-case-details"
        />
      ),
    },
  ];

  return (
    <TableMui
      title="Grievance Cases"
      subTitle="List of Grievance Cases"
      addLink="/add-grievance-case"
      addLabel="Add Grievance Case"
      data={grievanceCases}
      columns={columns}
      breadcrumbItem="Grievance Cases"
      noDataMessage="No Grievance Cases found"
      iconClassName="fa fa-balance-scale"
      isLoading={loading}
    />
  );
};

export default GrievanceCases;
