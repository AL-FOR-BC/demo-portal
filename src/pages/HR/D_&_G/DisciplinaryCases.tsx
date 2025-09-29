import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../store/hook";
import { disciplinaryCasesService } from "../../../services/DisciplinaryCasesService";
import { DisciplinaryCase } from "../../../@types/disciplinaryCases.dto";
import { getErrorMessage } from "../../../utils/common";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";
import TableMui from "../../../Components/ui/Table/TableMui";

const DisciplinaryCases: React.FC = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { employeeNo } = useAppSelector((state) => state.auth.user);
  const [disciplinaryCases, setDisciplinaryCases] = useState<
    DisciplinaryCase[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisciplinaryCases();
  }, [companyId, employeeNo]);

  const fetchDisciplinaryCases = async () => {
    try {
      setLoading(true);
      const filterQuery = `$filter=caseRegisteredByNo eq '${employeeNo}'`;
      const data = await disciplinaryCasesService.getDisciplinaryCases(
        companyId,
        filterQuery
      );
      setDisciplinaryCases(data);
    } catch (error) {
      toast.error(
        `Error fetching Disciplinary Cases: ${getErrorMessage(error)}`
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
      dataField: "caseCategory",
      text: "Case Category",
      sort: true,
    },
    {
      dataField: "gdCode",
      text: "G/D Code",
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
      dataField: "disciplinaryCaseDescription",
      text: "Disciplinary Case Description",
      sort: true,
    },
    {
      dataField: "indictedEmployeeNo",
      text: "Indicted Employee No.",
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
          navigateTo="/disciplinary-case-details"
        />
      ),
    },
  ];

  return (
    <TableMui
      title="Disciplinary Cases"
      subTitle="List of Disciplinary Cases"
      addLink="/add-disciplinary-case"
      addLabel="Add Disciplinary Case"
      data={disciplinaryCases}
      columns={columns}
      breadcrumbItem="Disciplinary Cases"
      noDataMessage="No Disciplinary Cases found"
      iconClassName="fa fa-gavel"
      isLoading={loading}
    />
  );
};

export default DisciplinaryCases;
