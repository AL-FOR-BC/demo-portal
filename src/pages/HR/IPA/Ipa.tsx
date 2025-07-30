import { ReactNode, useEffect, useState } from "react";
import TableMui from "../../../Components/ui/Table/TableMui";
import { useIPA } from "./hooks/useIPA";
import { IPA } from "../../../@types/ipa.dto";
import {
  ActionFormatter,
  statusFormatter,
} from "../../../Components/ui/Table/TableUtils";
type Column = {
  dataField: keyof IPA | "action";
  text: string;
  sort: boolean;
  formatter?: any;
  action?: (cell: string, row: any) => JSX.Element;
};

function Ipa() {
  const [data, setData] = useState<IPA[]>([]);
  const [loading, setLoading] = useState(false);
  const { getIPA } = useIPA({ mode: "list" });

  const columns: Column[] = [
    {
      dataField: "no",
      text: "Document No",
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
      dataField: "appraiser",
      text: "Appraiser",
      sort: true,
    },
    {
      dataField: "convertToAppraisal",
      text: "Converted",
      sort: true,
      formatter: (cell: string, row: any) => {
        return (
          <span
            className={`badge ${cell === "Yes" ? "bg-success" : "bg-danger"}`}
          >
            {cell}
          </span>
        );
      },
    },
    {
      dataField: "postingDate",
      text: "Posting Date",
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
      text: "Action",
      sort: true,
      formatter: (cell: string, row: any) => {
        return (
          <ActionFormatter
            row={row}
            cellContent={cell}
            navigateTo="/ipa-details"
          />
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getIPA();
      try {
        setData(result || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <TableMui
      title="Individual Performance Appraisal"
      subTitle="List of IPA"
      addLink="/add-ipa"
      addLabel="Add Individual Performance Appraisal"
      data={data}
      columns={columns}
      breadcrumbItem="Individual Performance Appraisal"
      noDataMessage="No IPA found"
      iconClassName="fa fa-user"
      isLoading={loading}
    />
  );
}

export default Ipa;
