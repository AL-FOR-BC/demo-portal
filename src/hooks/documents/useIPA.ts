// import { useState } from "react";
// import { useAppSelector } from "../../store/hook";
// import { DocumentTypeMode } from "../../@types/documents/base.types";
// import { ipaService } from "../../services/IpaSerivces";
// import { options } from "../../@types/common.dto";
// import { IPAFormData, IPALineFormData } from "../../@types/ipa.dto";
// import { formatDate, getErrorMessage } from "../../utils/common";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// export const useIPA = ({ mode }: { mode: DocumentTypeMode }) => {
//   const navigate = useNavigate();
//   const { companyId } = useAppSelector((state) => state.auth.session);
//   const { employeeNo, employeeName, jobTitle } = useAppSelector(
//     (state) => state.auth.user
//   );
//   const currentYear = new Date().getFullYear();
//   const currentDate = formatDate(new Date().toISOString());

//   const initialFormData: IPAFormData = {
//     No: "",
//     EmployeeNo: employeeNo || "",
//     Appraiser: "",
//     DepartmentCode: "",
//     PostingDate: currentDate,
//     Status: "Open",
//     AppraisalPeriod: currentYear,
//     ConvertToAppraisal: "",
//     PerformanceType: "",
//     Stage: "",
//     PerformanceAppraisalState: "",
//   };

//   const initialLineFormData: IPALineFormData = {
//     lineNo: 0,
//     documentNo: "",
//     perspective: "",
//     strategicObjectiveCode: "",
//     strategicObjective: "",
//     individualObjective: "",
//     initiatives: "",
//     measures: "",
//     targetDate: "",
//     weights: 0,
//   };

//   const [state, setState] = useState({});
//   const [formData, setFormData] = useState<IPAFormData>(initialFormData);
//   const [lineFormData, setLineFormData] =
//     useState<IPALineFormData>(initialLineFormData);
//   const [lines, setLines] = useState<IPALineFormData[]>([]);

//   const getIPA = async () => {
//     const filterQuery = `EmployeeNo eq '${employeeNo}'`;
//     const response = await ipaService.getIPAS(companyId, filterQuery);
//     return response;
//   };

//   const handleFieldUpdate = (
//     field: keyof IPAFormData,
//     value: string | options
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleInputChange = (
//     field: keyof IPAFormData,
//     value: string | options
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleLineFieldUpdate = (
//     field: keyof IPALineFormData,
//     value: string | number | options
//   ) => {
//     setLineFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const addLine = () => {
//     setLines((prev) => [...prev, { ...lineFormData, lineNo: prev.length + 1 }]);
//     setLineFormData(initialLineFormData);
//   };

//   const removeLine = (lineNo: number) => {
//     setLines((prev) => prev.filter((line) => line.lineNo !== lineNo));
//   };

//   const getFormFields = () => {
//     const isFieldDisabled =
//       mode === "add" ||
//       formData.status === "Open" ||
//       (mode === "detail" && formData.status === "Open")
//         ? false
//         : true;

//     const basicFields = [
//       { label: "IPA No", type: "text", value: "", disabled: true, id: "ipaNo" },
//       {
//         label: "Employee No",
//         type: "text",
//         value: employeeNo,
//         disabled: true,
//         id: "empNo",
//       },
//       {
//         label: "Employee Name",
//         type: "text",
//         value: employeeName,
//         disabled: true,
//         id: "empName",
//       },
//       {
//         label: "Employment Title",
//         type: "text",
//         value: jobTitle,
//         disabled: true,
//         id: "empTitle",
//       },

//       {
//         label: "Status",
//         type: "text",
//         value: formData.Status,
//         disabled: true,
//         id: "docStatus",
//       },
//       {
//         label: "Posting Date",
//         type: "date",
//         value: formData.postingDate || currentDate,
//         id: "postingDate",
//         disabled: isFieldDisabled,
//         onChange: (date: any) => {
//           const formattedDate = formatDate(date[0]);
//           handleInputChange("postingDate", formattedDate);
//           if (mode === "detail" && formattedDate) {
//             handleFieldUpdate("postingDate", formattedDate);
//           }
//         },
//         required: true,
//       },
//     ];
//     const detailFields =
//       mode === "detail" || mode === "approve"
//         ? [
//             {
//               label: "Converted to Appraisal",
//               type: "text",
//               value: formData.convertToAppraisal,
//               id: "convertedToAppraisal",
//               disabled: isFieldDisabled,
//             },
//           ]
//         : [];

//     const editableFields = [
//       {
//         label: "Performance Year",
//         type: "number",
//         value: formData.performanceYear || new Date().getFullYear(),
//         id: "performanceYear",
//         disabled: isFieldDisabled,
//         onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//           const value = parseInt(e.target.value);
//           if (value > currentYear) {
//             toast.error("Performance Year cannot be greater than current year");
//             return;
//           }
//           handleInputChange("performanceYear", e.target.value);
//           if (mode === "detail") {
//             handleFieldUpdate("performanceYear", e.target.value);
//           }
//         },
//         required: true,
//       },
//       // {
//       //   label: "Appraisal Period",
//       //   type: "select",
//       //   options: [
//       //     { label: "Full-Year Appraisal", value: "FULL_YEAR" },
//       //     { label: "Mid-Year Appraisal", value: "MID_YEAR" },
//       //     { label: "Probation Appraisal", value: "PROBATION" },
//       //   ],
//       //   value: formData.appraisalPeriod || "",
//       //   id: "appraisalPeriod",
//       //   disabled: isFieldDisabled,
//       //   onChange: (e: options) => {
//       //     handleInputChange("appraisalPeriod", {
//       //       label: e.label,
//       //       value: e.value,
//       //     });
//       //     if (mode === "detail") {
//       //       handleFieldUpdate("appraisalPeriod", e.value);
//       //     }
//       //   },
//       //   required: true,
//       // },
//       ...detailFields,
//     ];

//     return [basicFields, editableFields];
//   };

//   const getLineFields = () => {
//     const isFieldDisabled =
//       mode === "add" ||
//       formData.status === "Open" ||
//       (mode === "detail" && formData.status === "Open")
//         ? false
//         : true;

//     return [
//       [
//         {
//           label: "Perspective",
//           type: "select",
//           options: [
//             { label: "Customer/Stakeholder", value: "CUSTOMER_STAKEHOLDER" },
//             { label: "Financial Stewardship", value: "FINANCIAL_STEWARDSHIP" },
//             {
//               label: "Internal Business Process",
//               value: "INTERNAL_BUSINESS_PROCESS",
//             },
//             { label: "Organization Capacity", value: "ORGANIZATION_CAPACITY" },
//           ],
//           value: lineFormData.perspective || "",
//           id: "perspective",
//           disabled: isFieldDisabled,
//           onChange: (e: options) => {
//             handleLineFieldUpdate("perspective", e.value);
//           },
//           required: true,
//         },
//         {
//           label: "Strategic Objective",
//           type: "text",
//           value: lineFormData.strategicObjective || "",
//           id: "strategicObjective",
//           disabled: isFieldDisabled,
//           onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//             handleLineFieldUpdate("strategicObjective", e.target.value);
//           },
//           required: true,
//         },
//         {
//           label: "Individual Objective",
//           type: "text",
//           value: lineFormData.individualObjective || "",
//           id: "individualObjective",
//           disabled: isFieldDisabled,
//           onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//             handleLineFieldUpdate("individualObjective", e.target.value);
//           },
//           required: true,
//         },
//         {
//           label: "Target Date",
//           type: "date",
//           value: lineFormData.targetDate || "",
//           id: "targetDate",
//           disabled: isFieldDisabled,
//           onChange: (date: any) => {
//             const formattedDate = formatDate(date[0]);
//             handleLineFieldUpdate("targetDate", formattedDate);
//           },
//           required: true,
//         },
//         {
//           label: "Initiatives",
//           type: "text",
//           value: lineFormData.initiatives || "",
//           id: "initiatives",
//           disabled: isFieldDisabled,
//           onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//             handleLineFieldUpdate("initiatives", e.target.value);
//           },
//           required: true,
//         },
//         {
//           label: "Measures",
//           type: "text",
//           value: lineFormData.measures || "",
//           id: "measures",
//           disabled: isFieldDisabled,
//           onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//             handleLineFieldUpdate("measures", e.target.value);
//           },
//           required: true,
//         },
//         {
//           label: "Weights (%)",
//           type: "number",
//           value: lineFormData.weights || "",
//           id: "weights",
//           disabled: isFieldDisabled,
//           onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//             const value = parseInt(e.target.value);
//             if (value < 0 || value > 100) {
//               toast.error("Weight must be between 0 and 100");
//               return;
//             }
//             handleLineFieldUpdate("weights", value);
//           },
//           required: true,
//         },
//       ],
//     ];
//   };

//   const submitIPA = async () => {
//     try {
//       setState((prev) => ({ ...prev, isLoading: true }));
//       const data = {
//         EmployeeNo: employeeNo,
//         PostingDate: formData.postingDate,
//         Status: formData.status,
//         AppraisalPeriod: formData.performanceYear,
//         IPALines: lines,
//       };
//       const response = await ipaService.createIPA(companyId, data);
//       toast.success("IPA created successfully");
//       navigate(`/ipa-details/${response.data.SystemId}`);
//       return true;
//     } catch (error) {
//       toast.error(`Error fetching data: ${getErrorMessage(error)}`);
//     }
//   };

//   const populateDocumentDetail = async (systemId: string) => {
//     const filterQuery = `$expand=IPALines`;
//     const data = await ipaService.getIPA(companyId, systemId, filterQuery);
//     setFormData(data);
//     setLines(data.ipaLines);
//   };

//   return {
//     state,
//     formData,
//     lineFormData,
//     lines,
//     getFormFields,
//     getLineFields,
//     getIPA,
//     submitIPA,
//     addLine,
//     removeLine,
//     populateDocumentDetail,
//   };
// };
