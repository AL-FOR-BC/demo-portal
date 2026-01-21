import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import Lines from "../../../Components/ui/Lines/Lines";
import { useDisciplinaryCases } from "./hooks/useDisciplinaryCases";
import { disciplinaryLinesService } from "../../../services/DisciplinaryLinesService";
import BcApiService from "../../../services/BcApiServices";
import { disciplinaryCasesService } from "../../../services/DisciplinaryCasesService";
import { DisciplinaryLine } from "../../../@types/disciplinaryLines.dto";
import { ActionFormatterLines } from "../../../Components/ui/Table/TableUtils";
import { getErrorMessage } from "../../../utils/common";
import {
  closeModalRequisition,
  editRequisitionLine,
  modelLoadingRequisition,
  openModalRequisition,
} from "../../../store/slices/Requisitions";
import Swal from "sweetalert2";

const DisciplinaryCaseDetails: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { email, employeeNo } = useAppSelector((state) => state.auth.user);

  const [disciplinaryLines, setDisciplinaryLines] = useState<
    DisciplinaryLine[]
  >([]);
  const [lineSystemId, setLineSystemId] = useState("");
  const [lineEtag, setLineEtag] = useState("");
  const [status, setStatus] = useState("");
  const [caseRegisteredByNo, setCaseRegisteredByNo] = useState("");
  const [indictedEmployeeNo, setIndictedEmployeeNo] = useState<string>("");

  // Line form state
  const [entryType, setEntryType] = useState("");
  const [description, setDescription] = useState("");

  const { updateDisciplinaryCase, getFormFields, state } = useDisciplinaryCases(
    {
      mode: "edit",
      systemId,
    }
  );

  // Check if current user can add lines
  const canAddLines = () => {
    // Can add lines if status is "Open" OR if status is "Submitted to Employee" and current user is the indicted employee OR current user is in sendGrievanceTo field
    const canAdd =
      status === "Open" ||
      (status === "Submitted to Employee" &&
        (employeeNo === indictedEmployeeNo ||
          employeeNo === state.disciplinaryCase?.sendGrievanceTo));

    console.log("Can Add Lines Debug:", {
      status,
      employeeNo,
      indictedEmployeeNo,
      sendGrievanceTo: state.disciplinaryCase?.sendGrievanceTo,
      canAdd,
    });

    return canAdd;
  };

  // API handler function for ActionFormatterLines
  const apiDisciplinaryLines = async (
    companyId: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    systemId?: string,
    etag?: string,
    filterQuery?: string
  ) => {
    if (method === "DELETE") {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/disciplinaryLines(${systemId})?Company=${companyId}`,
        method,
        headers: {
          "If-Match": etag,
        },
      });
    } else if (method === "PATCH") {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/disciplinaryLines(${systemId})?Company=${companyId}`,
        method,
        data,
        headers: {
          "If-Match": etag,
        },
      });
    } else if (method === "POST") {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/disciplinaryLines?Company=${companyId}`,
        method,
        data,
      });
    } else {
      return BcApiService.fetchData<any>({
        url: `/api/hrpsolutions/hrmis/v2.0/disciplinaryLines?Company=${companyId}${
          filterQuery ? `&${filterQuery}` : ""
        }`,
        method,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      await updateDisciplinaryCase();
    } catch (error) {
      // Error is already handled in updateDisciplinaryCase
    }
  };

  const columns = [
    {
      dataField: "entryType",
      text: "Entry Type",
      sort: true,
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
    },
    (canAddLines() ? true : false) && {
      dataField: "action",
      text: "Action",
      sort: true,
      isDummyField: true,
      formatter: (_: any, row: any) => {
        return (
          <ActionFormatterLines
            row={row}
            companyId={companyId}
            apiHandler={apiDisciplinaryLines}
            handleEditLine={handleEditLine}
            handleDeleteLine={handleDeleteLine}
            populateData={populateData}
            status={status}
          />
        );
      },
    },
  ];

  const modalFields = [
    [
      {
        label: "Entry Type",
        type: "select",
        value: entryType
          ? { label: entryType, value: entryType }
          : { label: "Select Entry Type", value: "" },
        id: "entryType",
        options: (() => {
          const isOpenAndCaseInitiator =
            status === "Open" && employeeNo === caseRegisteredByNo;
          const isSubmittedToEmployee = status === "Submitted to Employee";
          console.log("Entry Type Options Debug:", {
            status,
            employeeNo,
            caseRegisteredByNo,
            indictedEmployeeNo,
            sendGrievanceTo: state.disciplinaryCase?.sendGrievanceTo,
            isOpenAndCaseInitiator,
            isSubmittedToEmployee,
          });

          return [
            { label: "Select Entry Type", value: "" },
            // If status is "Open" and current user is case initiator, only show Issue Detail Description and Findings
            ...(isOpenAndCaseInitiator
              ? [
                  {
                    label: "Issue Detail Description",
                    value: "Issue Detail Description",
                  },
                  { label: "Findings", value: "Findings" },
                ]
              : // If status is "Submitted to Employee" and current user is the indicted employee or in sendGrievanceTo, show Employee Response
              isSubmittedToEmployee &&
                (employeeNo === indictedEmployeeNo ||
                  employeeNo === state.disciplinaryCase?.sendGrievanceTo)
              ? [
                  {
                    label: "Employee Response",
                    value: "Employee Response",
                  },
                ]
              : // Otherwise show all options
                [
                  {
                    label: "Issue Detail Description",
                    value: "Issue Detail Description",
                  },
                  { label: "Findings", value: "Findings" },
                  { label: "Recommendations", value: "Recommendations" },
                  { label: "Employee Response", value: "Employee Response" },
                ]),
          ];
        })(),
        onChange: (e: any) => setEntryType(e?.value || ""),
      },
      {
        label: "Description",
        type: "textarea",
        value: description,
        id: "description",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setDescription(e.target.value),
      },
    ],
  ];

  const populateData = async () => {
    try {
      if (systemId) {
        // Use $expand to get disciplinary lines with the case
        const expandQuery = `$expand=disciplinaryLines`;
        const response = await disciplinaryCasesService.getDisciplinaryCase(
          companyId,
          systemId,
          expandQuery
        );

        console.log("Expanded response:", response);

        // Extract disciplinary lines from the expanded data
        let disciplinaryLines = response.disciplinaryLines || [];

        console.log("Found disciplinary lines:", disciplinaryLines.length);

        setDisciplinaryLines(disciplinaryLines);
        setStatus(response.status || "Open");
        setCaseRegisteredByNo(response.caseRegisteredByNo || "");
        setIndictedEmployeeNo(response.indictedEmployeeNo || "");
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error(
        `Error fetching disciplinary lines: ${getErrorMessage(error)}`
      );
    } finally {
    }
  };

  const handleSubmitLines = async () => {
    dispatch(modelLoadingRequisition(true));
    const data = {
      lineNo: 0, // Will be auto-generated by the API
      entryType: entryType,
      description: description,
      issueNo: state.disciplinaryCase?.no || "",
    };
    console.log("Submitting disciplinary line data:", data);
    if (data) {
      try {
        const res = await disciplinaryLinesService.createDisciplinaryLine(
          companyId,
          data
        );
        if (res.status === 201 || res.status === 200) {
          toast.success("Disciplinary line added successfully");
          populateData();
          dispatch(closeModalRequisition());
        }
      } catch (error) {
        toast.error(
          `Error submitting disciplinary line: ${getErrorMessage(error)}`
        );
      } finally {
        dispatch(modelLoadingRequisition(false));
      }
    }
  };

  const clearLineFields = () => {
    setEntryType("");
    setDescription("");
  };

  const handleEditLine = (row: any) => {
    clearLineFields();
    dispatch(modelLoadingRequisition(true));
    dispatch(openModalRequisition());
    dispatch(editRequisitionLine(true));
    setEntryType(row.entryType);
    setDescription(row.description);
    setLineSystemId(row.systemId);
    setLineEtag(row["@odata.etag"]);
    dispatch(modelLoadingRequisition(false));
  };

  const handleSubmitUpdatedLine = async () => {
    try {
      const data = {
        systemId: lineSystemId,
        lineNo: 0, // Will be auto-generated by the API
        entryType: entryType,
        description: description,
        issueNo: state.disciplinaryCase?.no || "",
      };
      console.log("Updating disciplinary line data:", data);
      if (lineSystemId && lineEtag) {
        const res = await disciplinaryLinesService.updateDisciplinaryLine(
          companyId,
          data,
          lineSystemId,
          lineEtag
        );
        if (res.status === 200) {
          toast.success("Disciplinary line updated successfully");
          populateData();
          dispatch(closeModalRequisition());
        }
      }
    } catch (error) {
      toast.error(
        `Error updating disciplinary line: ${getErrorMessage(error)}`
      );
    } finally {
      dispatch(modelLoadingRequisition(false));
    }
  };

  const handleDeleteLine = async (row: any) => {
    try {
      await disciplinaryLinesService.deleteDisciplinaryLine(
        companyId,
        row.systemId,
        row["@odata.etag"]
      );
      toast.success("Disciplinary line deleted successfully");
      populateData();
    } catch (error) {
      toast.error(
        `Error deleting disciplinary line: ${getErrorMessage(error)}`
      );
    }
  };

  const handleNotifySupervisor = async () => {
    try {
      if (!state.disciplinaryCase?.no) {
        toast.error("Disciplinary case number not found");
        return;
      }

      const responseData = {
        no: state.disciplinaryCase.no,
      };

      console.log("Notifying supervisor:", responseData);

      const response = await disciplinaryCasesService.notifySupervisor(
        companyId,
        responseData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Supervisor notified successfully!");
        // Optionally refresh the data
        populateData();
      } else {
        toast.error("Failed to notify supervisor");
      }
    } catch (error) {
      console.error("Error notifying supervisor:", error);
      toast.error(`Error notifying supervisor: ${getErrorMessage(error)}`);
    }
  };

  const handleSendNotification = async () => {
    try {
      if (!state.disciplinaryCase?.no) {
        toast.error("No disciplinary case number found");
        return;
      }

      // Show SweetAlert with radio button options
      const { value: sendNotificationOption } = await Swal.fire({
        title: "Send Disciplinary Notification",
        html: `
          <div style="text-align: left; margin: 20px 0;">
            <p style="margin-bottom: 15px;">Select notification recipients:</p>
            <div style="margin-bottom: 10px;">
              <input type="radio" id="accusedOnly" name="notificationOption" value="1" style="margin-right: 8px;">
              <label for="accusedOnly">Accused Employee</label>
            </div>
            <div>
              <input type="radio" id="accusedAndCommittee" name="notificationOption" value="2" checked style="margin-right: 8px;">
              <label for="accusedAndCommittee">Accused Employee and Disciplinary Committee</label>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Send Notification",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#6c757d",
        focusConfirm: false,
        allowOutsideClick: false,
        allowEscapeKey: true,
        preConfirm: () => {
          const selectedOption = document.querySelector(
            'input[name="notificationOption"]:checked'
          ) as HTMLInputElement;
          if (!selectedOption) {
            Swal.showValidationMessage("Please select a notification option");
            return false;
          }
          return selectedOption.value;
        },
      });

      if (sendNotificationOption) {
        const responseData = {
          no: state.disciplinaryCase.no,
          sendNotificationOption: parseInt(sendNotificationOption),
        };

        console.log("Sending disciplinary notification:", responseData);

        const response =
          await disciplinaryCasesService.sendDisciplinaryNotification(
            companyId,
            responseData
          );

        if (response.status === 200 || response.status === 201) {
          const optionText =
            sendNotificationOption === "1"
              ? "Accused Employee"
              : "Accused Employee and Disciplinary Committee";
          toast.success(`Notification sent to ${optionText} successfully!`);
          populateData();
        } else {
          toast.error("Failed to send disciplinary notification");
        }
      }
    } catch (error) {
      console.error("Error sending disciplinary notification:", error);
      toast.error(
        `Error sending disciplinary notification: ${getErrorMessage(error)}`
      );
    }
  };

  const handleSendEmployeeResponse = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Send Employee Response",
      text: "Are you sure you want to send your employee response for this disciplinary case?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Send Response",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      if (!state.disciplinaryCase?.no) {
        toast.error("No disciplinary case number found");
        return;
      }

      if (!email) {
        toast.error("User email not found. Please sign in again.");
        return;
      }

      const responseData = {
        no: state.disciplinaryCase.no,
      };

      console.log("Sending employee response:", responseData);

      // Use the new sendEmployeeResponse method
      const response = await disciplinaryCasesService.sendEmployeeResponse(
        companyId,
        responseData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Employee response sent successfully!");
        // Optionally refresh the data or navigate
        populateData();
      } else {
        toast.error("Failed to send employee response");
      }
    } catch (error) {
      console.error("Error sending employee response:", error);
      toast.error(`Error sending employee response: ${getErrorMessage(error)}`);
    }
  };

  useEffect(() => {
    if (state.disciplinaryCase?.no) {
      populateData();
    }
  }, [state.disciplinaryCase?.no]);

  return (
    <HeaderMui
      title="Disciplinary Case Details"
      subtitle="Disciplinary Case Details"
      breadcrumbItem="Disciplinary Case Details"
      fields={getFormFields()}
      isLoading={state.isLoading}
      handleBack={() => navigate("/disciplinary-cases")}
      handleSubmit={handleSubmit}
      handleSendResponse={handleSendEmployeeResponse}
      handleNotifySupervisor={handleNotifySupervisor}
      handleSendNotification={handleSendNotification}
      documentType="Disciplinary Case"
      pageType="detail"
      status={status}
      lines={
        <Lines
          title="Disciplinary Lines"
          subTitle="Case Lines and Comments"
          breadcrumbItem="Disciplinary Lines"
          addLink=""
          addLabel=""
          iconClassName=""
          noDataMessage="No lines found"
          data={disciplinaryLines}
          status={status}
          modalFields={modalFields}
          columns={columns}
          handleSubmitLines={() => {
            handleSubmitLines();
          }}
          handleSubmitUpdatedLine={() => {
            handleSubmitUpdatedLine();
          }}
          clearLineFields={() => {
            setEntryType("");
            setDescription("");
          }}
          handleValidateHeaderFields={() => true}
          canAddLines={canAddLines()}
        />
      }
    />
  );
};

export default DisciplinaryCaseDetails;
