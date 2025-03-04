// import { ReactNode, useEffect, useState } from "react";
// import TableMui from "../../../Components/ui/Table/TableMui";
// import { useIPA } from "../../../hooks/documents/useIPA";
// import { IPA } from "../../../@types/ipa.dto";
// import {
//   ActionFormatter,
//   statusFormatter,
// } from "../../../Components/ui/Table/TableUtils";
// type Column = {
//   dataField: keyof IPA | "action";
//   text: string;
//   sort: boolean;
//   formatter?: any;
//   action?: (cell: string, row: any) => JSX.Element;
// };

// function Ipa() {
//   const [data, setData] = useState<IPA[]>([]);
//   const { getIPA } = useIPA({ mode: "list" });

//   const columns: Column[] = [
//     {
//       dataField: "No",
//       text: "Document No",
//       sort: true,
//     },
//     {
//       dataField: "EmployeeNo",
//       text: "Employee No",
//       sort: true,
//     },
//     {
//       dataField: "Appraiser",
//       text: "Appraiser",
//       sort: true,
//     },
//     {
//       dataField: "ConvertToAppraisal",
//       text: "Converted",
//       sort: true,
//       formatter: (cell: string, row: any) => {
//         return (
//           <span
//             className={`badge ${cell === "Yes" ? "bg-success" : "bg-danger"}`}
//           >
//             {cell}
//           </span>
//         );
//       },
//     },
//     {
//       dataField: "PostingDate",
//       text: "Posting Date",
//       sort: true,
//     },
//     {
//       dataField: "Status",
//       text: "Status",
//       sort: true,
//       formatter: statusFormatter,
//     },
//     {
//       dataField: "PerformanceAppraisalState",
//       text: "Performance Appraisal State",
//       sort: true,
//     },
//     {
//       dataField: "action",
//       text: "Action",
//       sort: true,
//       formatter: (cell: string, row: any) => {
//         return (
//           <ActionFormatter
//             row={row}
//             cellContent={cell}
//             navigateTo="/ipa-details"
//           />
//         );
//       },
//     },
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await getIPA();
//       try {
//         setData(result || []);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <TableMui
//       title="IPA"
//       subTitle="List of IPA"
//       addLink="/add-ipa"
//       addLabel="Add IPA"
//       data={data}
//       columns={columns}
//       breadcrumbItem="Individual Performance Appraisal"
//       noDataMessage="No IPA found"
//       iconClassName="fa fa-user"
//     />
//   );
// }

// export default Ipa;
