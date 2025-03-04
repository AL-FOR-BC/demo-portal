// import HeaderMui from "../../../Components/ui/Header/HeaderMui";
// // import { useIPA } from "../../../hooks/documents/useIPA";
// import { useNavigate, useParams } from "react-router-dom";
// import Lines from "../../../Components/ui/Lines/Lines";
// import { useEffect } from "react";
// import { ActionFormatterLines } from "../../../Components/ui/Table/TableUtils";
// import { apiPaymentRequisitionLines } from "../../../services/RequisitionServices";
// import { useAppSelector } from "../../../store/hook";
// import { ipaService } from "../../../services/IpaSerivces";
// import { toast } from "react-toastify";

// function IPADetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { companyId } = useAppSelector((state) => state.auth.session);

//   const { getFormFields, getLineFields, populateDocumentDetail, lines } =
//     // useIPA({ mode: "detail" });
//   const columns =
//     "Open" == "Open"
//       ? [
//           {
//             dataField: "Perspective",
//             text: "Perspective",
//             sort: true,
//           },
//           {
//             dataField: "strategicObjective",
//             text: "Strategic Objective",
//             sort: true,
//           },
//           {
//             dataField: "individualObjective",
//             text: "Individual Objective",
//             sort: true,
//           },
//           {
//             dataField: "Initiatives",
//             text: "Initiatives",
//             sort: true,
//           },
//           {
//             dataField: "Measures",
//             text: "Measures",
//             sort: true,
//           },
//           {
//             dataField: "TargetDate",
//             text: "Target Date",
//             sort: true,
//           },
//           {
//             dataField: "Weights",
//             text: "Weights(%)",
//             sort: true,
//           },
//           {
//             dataField: "action",
//             isDummyField: true,
//             text: "Action",
//             formatter: (cellContent, row) => {
//               console.log("Cell Content:", cellContent);
//               return (
//                 <ActionFormatterLines
//                   row={row}
//                   companyId={companyId}
//                   apiHandler={apiPaymentRequisitionLines}
//                   handleEditLine={handleEditLine}
//                   handleDeleteLine={handleDeleteLine}
//                   populateData={populateData}
//                 />
//               );
//             },
//           },
//         ]
//       : [
//           {
//             dataField: "Perspective",
//             text: "Perspective",
//             sort: true,
//           },
//           {
//             dataField: "strategicObjective",
//             text: "Strategic Objective",
//             sort: true,
//           },
//           {
//             dataField: "individualObjective",
//             text: "Individual Objective",
//             sort: true,
//           },
//           {
//             dataField: "Initiatives",
//             text: "Initiatives",
//             sort: true,
//           },
//           {
//             dataField: "Measures",
//             text: "Measures",
//             sort: true,
//           },
//           {
//             dataField: "TargetDate",
//             text: "Target Date",
//             sort: true,
//           },
//           {
//             dataField: "Weights",
//             text: "Weights(%)",
//             sort: true,
//           },
//         ];

//   const handleEditLine = () => {
//     console.log("Edit Line");
//   };
//   const handleDeleteLine = async () => {
//     if (id) {
//       const response = await ipaService.deleteIPALine(companyId, id);
//       if (response.status === 200) {
//         toast.success("Line deleted successfully");
//       } else {
//         toast.error("Failed to delete line");
//       }
//     }
//   };
//   const populateData = () => {
//     console.log("Populate Data");
//   };
//   useEffect(() => {
//     if (id) {
//       populateDocumentDetail(id);
//     }
//   }, [id]);

//   return (
//     <HeaderMui
//       title="IPA Details"
//       subtitle="Individual Performance Agreement"
//       breadcrumbItem="IPA"
//       handleBack={() => navigate("/ipa")}
//       handleSubmit={() => {}}
//       isLoading={false}
//       pageType="details"
//       fields={getFormFields()}
//       lines={
//         <Lines
//           title="IPA Lines"
//           subTitle="IPA Lines"
//           breadcrumbItem="IPA Lines"
//           addLabel="Add Line"
//           iconClassName=""
//           noDataMessage="No lines found"
//           clearLineFields={() => {}}
//           handleValidateHeaderFields={() => true}
//           data={lines as any}
//           columns={columns}
//           status={"Open"}
//           modalFields={getLineFields()}
//           handleSubmitLines={() => {}}
//           handleDeleteLines={() => {}}
//           handleSubmitUpdatedLine={() => {}}
//         />
//       }
//     />
//   );
// }

// export default IPADetails;
