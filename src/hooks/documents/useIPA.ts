// import { useEffect, useState } from "react";
// import { useAppSelector } from "../../store/hook";

// export const useIPA = () => {
//   const { companyId } = useAppSelector((state) => state.auth.session);
//   const { employeeNo, employeeName, jobTitle } = useAppSelector(
//     (state) => state.auth.user
//   );

//   const { mode, formData } = useState({});
//   const [state, setState] = useState({});
//   const getFormFields = () => {
//     const isFieldDisabled =
//       mode === "add" ||
//       formData.status === "Open" ||
//       (mode === "detail" && formData.status === "Open")
//         ? false
//         : true;

//     const basicFields = [
//       {
//         label: "IPA No",
//         type: "text",
//         value: formData.documentNo || "",
//         disabled: true,
//         id: "ipaNo",
//       },
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
//     ];

//     const editableFields = [
//       {
//         label: "Posting Date",
//         type: "date",
//         value: formData.postingDate || "",
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
//       {
//         label: "Status",
//         type: "text",
//         value: formData.status || "Open",
//         id: "status",
//         disabled: true,
//       },
//       {
//         label: "Performance Year",
//         type: "number",
//         value: formData.performanceYear || new Date().getFullYear(),
//         id: "performanceYear",
//         disabled: isFieldDisabled,
//         onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//           handleInputChange("performanceYear", e.target.value);
//           if (mode === "detail") {
//             handleFieldUpdate("performanceYear", e.target.value);
//           }
//         },
//         required: true,
//       },
//       {
//         label: "Appraisal Period",
//         type: "select",
//         options: [
//           { label: "Full-Year Appraisal", value: "FULL_YEAR" },
//           { label: "Mid-Year Appraisal", value: "MID_YEAR" },
//           { label: "Probation Appraisal", value: "PROBATION" },
//         ],
//         value: formData.appraisalPeriod || "",
//         id: "appraisalPeriod",
//         disabled: isFieldDisabled,
//         onChange: (e: options) => {
//           handleInputChange("appraisalPeriod", {
//             label: e.label,
//             value: e.value,
//           });
//           if (mode === "detail") {
//             handleFieldUpdate("appraisalPeriod", e.value);
//           }
//         },
//         required: true,
//       },
//       {
//         label: "Converted to Appraisal",
//         type: "checkbox",
//         value: formData.convertedToAppraisal || false,
//         id: "convertedToAppraisal",
//         disabled: isFieldDisabled,
//         onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
//           handleInputChange("convertedToAppraisal", e.target.checked);
//           if (mode === "detail") {
//             handleFieldUpdate("convertedToAppraisal", e.target.checked);
//           }
//         },
//       },
//     ];

//     return [basicFields, editableFields];
//   };
// };
