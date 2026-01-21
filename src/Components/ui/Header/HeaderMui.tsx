import React from "react";
import { RiseLoader } from "react-spinners";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { Container, Alert as MuiAlert, Card, CardContent } from "@mui/material";
import ApprovalProgress from "../../ui/ApprovalProgress";
import Select from "react-select";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import BreadCrumbs from "../../BreadCrumbs";
// import ApprovalEntries from "../../common/ApprovalEntry";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import {
  ArrowBackIcon,
  CancelIcon,
  ConvertIcon,
  DeleteIcon,
  PrintIcon,
  ReopenIcon,
  SaveIcon,
  SendIcon,
} from "../../common/icons/icons";
import classNames from "classnames";
import { Button, Row, Col, Collapse, Input, Label } from "reactstrap";
// import { IconButton } from "@mui/material";
import Attachments from "../../common/Attachment";
import ApprovalEntries from "../../common/ApprovalEntry";
import ApprovalAction from "../../common/ApprovalAction";
import ApprovalComments from "../../common/ApprovalComments";
import Toggle from "../Toggle/Toggle";
import Swal from "sweetalert2";

interface HeaderMuiProps {
  title: string;
  subtitle: string;
  breadcrumbItem: string;
  fields: any[];
  isLoading: boolean;
  showError?: boolean;
  docError?: string;
  toggleError?: () => void;
  handleBack?: () => void;
  handleSubmit?: () => void;
  handleCancel?: () => void;
  handleSendApprovalRequest?: () => void;
  handleDeletePurchaseRequisition?: () => void;
  handleCancelApprovalRequest?: () => void;
  lines?: React.ReactNode;
  status?:
    | string
    | "Open"
    | "Submitted to Employee"
    | "Approved"
    | "Pending Approval";
  buttons?: {
    label: string;
    color: string;
    icon: string;
    onClick: () => void;
  }[];
  pageType?: "detail" | "add" | "approval" | "time-sheet";
  companyId?: string;
  documentType?: string;
  stage?: string;
  requestNo?: string;
  editableLines?: boolean;
  onBlur?: () => void;
  columns?: GridColDef[];
  rowLines?: any;
  handleSubmitLines?: (data: any, id: string) => void;
  handleDeleteLine?: (id: GridRowId) => void;
  handleEditLine?: (id: GridRowId) => void;
  tableId?: number;
  createNewLine?: (lineNo: number) => void;
  handleReopen?: () => void;
  handleDelete?: () => void;
  handleSendToAppraiser?: () => void;
  currentUser?: "Appraisee" | "Appraiser" | "Head of Department";
  handleConvertToPerformanceAppraisal?: () => void;
  handleSendToHeadOfDepartment?: () => void;
  handleSendBackToAppraisee?: () => void;
  handleSendBackToAppraiser?: () => void;
  handleSubmitPA?: () => void;
  headOfDepartment?: string;
  onGradingClick?: () => void;
  onPrintClick?: () => void;
  handleHROfficerClearance?: () => void;
  handleFinanceClearance?: () => void;
  handleITClearance?: () => void;
  handleMedicalAdminClearance?: () => void;
  handleHeadOfDepartmentClearance?: () => void;
  handleHRManagerClearance?: () => void;
  handleSupervisorClearance?: () => void;
  handleSendResponse?: () => void;
  handleNotifySupervisor?: () => void;
  handleSendNotification?: () => void;
  handleWithdrawCase?: () => void;
  handleCloseGrievance?: () => void;
  currentUserEmployeeNo?: string;
  indictedEmployeeNo?: string;
  caseRegisteredByNo?: string;
  sendGrievanceTo?: string;
  hrOfficerStage?: string;
  financeStage?: string;
  adminStage?: string;
  supervisorStage?: string;
  ictStage?: string;
  headOfDepartmentStage?: string;
  hrManagerStage?: string;
}

const HeaderMui: React.FC<HeaderMuiProps> = (props) => {
  const [generalTab, setGeneralTab] = React.useState(true);
  const toggleGeneral = () => setGeneralTab(!generalTab);

  const {
    title,
    subtitle,
    breadcrumbItem,
    fields,
    isLoading,
    showError,
    docError,
    toggleError,
    handleBack,
    handleSubmit,
    pageType,
    handleDelete,
    handleSendApprovalRequest,
    handleDeletePurchaseRequisition,
    handleCancelApprovalRequest,
    lines,
    status,
    companyId,
    documentType,
    stage,
    requestNo,
    editableLines,
    tableId,
    handleReopen,
    handleSendToAppraiser,
    currentUser,
    handleConvertToPerformanceAppraisal,
    handleSendToHeadOfDepartment,
    handleSendBackToAppraisee,
    handleSendBackToAppraiser,
    handleSubmitPA,
    headOfDepartment,
    onPrintClick,
    handleHROfficerClearance,
    handleFinanceClearance,
    handleITClearance,
    handleMedicalAdminClearance,
    handleHeadOfDepartmentClearance,
    handleHRManagerClearance,
    handleSupervisorClearance,
    handleSendResponse,
    handleNotifySupervisor,
    handleSendNotification,
    handleWithdrawCase,
    handleCloseGrievance,
    currentUserEmployeeNo,
    indictedEmployeeNo,
    caseRegisteredByNo,
    sendGrievanceTo,
    hrOfficerStage,
    financeStage,
    adminStage,
    supervisorStage,
    ictStage,
    headOfDepartmentStage,
    hrManagerStage,
  } = props;

  return (
    <LoadingOverlayWrapper
      active={isLoading}
      spinner={<RiseLoader />}
      text="Please wait..."
    >
      <div className="page-content">
        <Container maxWidth={false}>
          <BreadCrumbs
            title={title}
            subTitle={subtitle}
            breadcrumbItem={breadcrumbItem}
          />
          {documentType === "Exit Clearance" &&
            status === "Pending Approval" && (
              <ApprovalProgress
                status={status}
                hrOfficerStage={hrOfficerStage}
                financeStage={financeStage}
                adminStage={adminStage}
                supervisorStage={supervisorStage}
                ictStage={ictStage}
                headOfDepartmentStage={headOfDepartmentStage}
                hrManagerStage={hrManagerStage}
              />
            )}

          {pageType === "add" && (
            <Row className="justify-content-center mb-4">
              <div className="d-flex flex-wrap gap-2">
                <Button
                  color="secondary"
                  className="btn btn-label"
                  onClick={handleBack}
                >
                  <i className="label-icon">
                    <ArrowBackIcon className="label-icon" />
                  </i>
                  Back
                </Button>
                {pageType === "add" && (
                  <Button
                    color="primary"
                    className="btn btn-label"
                    onClick={handleSubmit}
                  >
                    <i className="label-icon">
                      <SaveIcon className="label-icon" />
                    </i>
                    Create Request
                  </Button>
                )}
              </div>
            </Row>
          )}

          {pageType === "detail" && (
            <>
              {status === "Open" && (
                <Row className="justify-content-center mb-4">
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      color="secondary"
                      className="btn  btn-label"
                      onClick={handleBack}
                    >
                      <i className="label-icon">
                        <ArrowBackIcon className="label-icon" />
                      </i>
                      Back
                    </Button>
                    {documentType === "Exit Interview" && (
                      <Button
                        color="primary"
                        className="btn btn-label"
                        onClick={handleSubmit}
                      >
                        <SendIcon className="label-icon" />
                        Submit Exit Interview
                      </Button>
                    )}
                    {documentType === "Exit Clearance" && (
                      <>
                        <Button
                          color="primary"
                          className="btn btn-label"
                          onClick={handleSubmit}
                        >
                          <SendIcon className="label-icon" />
                          Submit Exit Clearance
                        </Button>
                      </>
                    )}
                    {documentType === "Performance Management" && (
                      <>
                        <Button
                          variant="contained"
                          color="info"
                          className="btn btn-label"
                          onClick={props.onGradingClick}
                          sx={{
                            background:
                              "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF5722 100%)",
                            color: "white",
                            fontWeight: "800",
                            fontSize: "16px",
                            padding: "12px 24px",
                            borderRadius: "16px",
                            boxShadow:
                              "0 6px 20px rgba(255, 107, 53, 0.5), 0 3px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
                            textTransform: "none",
                            border: "2px solid #FF5722",
                            position: "relative",
                            overflow: "hidden",
                            backdropFilter: "blur(10px)",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: "-100%",
                              width: "100%",
                              height: "100%",
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                              transition: "left 0.6s ease-out",
                            },
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: "-50%",
                              left: "-50%",
                              width: "200%",
                              height: "200%",
                              background:
                                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                              animation: "ripple 4s ease-in-out infinite",
                            },
                            "&:hover": {
                              background:
                                "linear-gradient(135deg, #FF5722 0%, #FF6B35 50%, #F7931E 100%)",
                              boxShadow:
                                "0 8px 25px rgba(255, 107, 53, 0.7), 0 5px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
                              transform: "translateY(-3px) scale(1.05)",
                              "&::before": {
                                left: "100%",
                              },
                            },
                            "&:active": {
                              transform: "translateY(-1px) scale(1.02)",
                              boxShadow: "0 4px 12px rgba(255, 107, 53, 0.6)",
                            },
                            animation:
                              "gradientShift 4s ease-in-out infinite, float 3s ease-in-out infinite, glow 2s ease-in-out infinite alternate",
                            "@keyframes gradientShift": {
                              "0%, 100%": {
                                background:
                                  "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FF5722 100%)",
                              },
                              "50%": {
                                background:
                                  "linear-gradient(135deg, #F7931E 0%, #FF5722 50%, #FF6B35 100%)",
                              },
                            },
                            "@keyframes float": {
                              "0%, 100%": {
                                boxShadow:
                                  "0 6px 20px rgba(255, 107, 53, 0.5), 0 3px 6px rgba(0,0,0,0.15)",
                              },
                              "50%": {
                                boxShadow:
                                  "0 8px 25px rgba(255, 107, 53, 0.7), 0 5px 10px rgba(0,0,0,0.2)",
                              },
                            },
                            "@keyframes glow": {
                              "0%": {
                                boxShadow:
                                  "0 6px 20px rgba(255, 107, 53, 0.5), 0 3px 6px rgba(0,0,0,0.15), 0 0 0 0 rgba(255, 107, 53, 0.4)",
                              },
                              "100%": {
                                boxShadow:
                                  "0 6px 20px rgba(255, 107, 53, 0.5), 0 3px 6px rgba(0,0,0,0.15), 0 0 0 8px rgba(255, 107, 53, 0)",
                              },
                            },
                            "@keyframes ripple": {
                              "0%": {
                                transform: "rotate(0deg)",
                              },
                              "100%": {
                                transform: "rotate(360deg)",
                              },
                            },
                          }}
                        >
                          <i
                            className="label-icon"
                            style={{
                              marginRight: "10px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              style={{
                                filter:
                                  "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                                animation:
                                  "iconGlow 2s ease-in-out infinite alternate",
                              }}
                            >
                              <defs>
                                <filter id="glow">
                                  <feGaussianBlur
                                    stdDeviation="2"
                                    result="coloredBlur"
                                  />
                                  <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                  </feMerge>
                                </filter>
                              </defs>
                              <path
                                fill="currentColor"
                                filter="url(#glow)"
                                d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"
                              />
                            </svg>
                          </i>
                          <span
                            style={{
                              textShadow:
                                "0 2px 4px rgba(0,0,0,0.4), 0 0 8px rgba(255,255,255,0.3)",
                              letterSpacing: "0.8px",
                              fontWeight: "800",
                              fontSize: "16px",
                              color: "#FFFFFF",
                            }}
                          >
                            ⭐📊 Grading Scale ⭐
                          </span>
                        </Button>
                        {stage === "Appraisee Rating" &&
                          currentUser === "Appraisee" &&
                          breadcrumbItem !==
                            "Individual Performance Agreement" && (
                            <Button
                              color="primary"
                              className="btn btn-label"
                              onClick={handleSendToAppraiser}
                            >
                              <SendIcon className="label-icon" />
                              Send to Appraiser
                            </Button>
                          )}
                      </>
                    )}

                    {documentType === "Performance Management" &&
                      stage === "Appraiser Rating" &&
                      currentUser === "Appraiser" && (
                        <>
                          <Button
                            color="warning"
                            className="btn btn-label"
                            onClick={handleSendBackToAppraisee}
                          >
                            <ArrowBackIcon className="label-icon" />
                            Send back to Appraisee
                          </Button>
                          <Button
                            color="primary"
                            className="btn btn-label"
                            onClick={handleSendToHeadOfDepartment}
                          >
                            <SendIcon className="label-icon" />
                            Send To Head of Department
                          </Button>
                        </>
                      )}
                    {documentType === "Performance Management" &&
                      title === "IPA Details" &&
                      stage === "Appraisee Rating" &&
                      currentUser === "Appraisee" && (
                        <Button
                          color="primary"
                          className="btn btn-label"
                          onClick={handleSendApprovalRequest}
                        >
                          <SendIcon className="label-icon" />
                          Send Approval Request
                        </Button>
                      )}
                    {documentType === "Performance Management" &&
                      stage === "Head of Department Review" &&
                      headOfDepartment === "Head of Department" && (
                        <>
                          <Button
                            color="warning"
                            className="btn btn-label"
                            onClick={handleSendBackToAppraiser}
                          >
                            <ArrowBackIcon className="label-icon" />
                            Send back to Appraiser
                          </Button>

                          <Button
                            color="primary"
                            className="btn btn-label"
                            onClick={handleSubmitPA}
                          >
                            <SendIcon className="label-icon" />
                            Submit Performance Appraisal
                          </Button>
                        </>
                      )}
                    {documentType === "Training Evaluation" && (
                      <Button
                        color="primary"
                        className="btn btn-label"
                        onClick={handleSubmit}
                      >
                        <SendIcon className="label-icon" />
                        Submit to HOD
                      </Button>
                    )}

                    {documentType !== "Performance Management" &&
                      documentType !== "Exit Interview" &&
                      documentType !== "Exit Clearance" &&
                      documentType !== "Grievance Case" &&
                      documentType !== "Disciplinary Case" &&
                      documentType !== "Training Evaluation" && (
                        <Button
                          color="primary"
                          className="btn btn-label"
                          onClick={handleSendApprovalRequest}
                        >
                          <SendIcon className="label-icon" />
                          Send Approval Request
                        </Button>
                      )}

                    {handleNotifySupervisor &&
                      documentType === "Grievance Case" &&
                      String(status) === "Open" && (
                        <>
                          {/* // back */}
                          <Button
                            color="secondary"
                            className="btn btn-label"
                            onClick={handleBack}
                          >
                            <ArrowBackIcon className="label-icon" />
                            Back
                          </Button>
                          {/* // notify supervisor */}
                          <Button
                            color="warning"
                            className="btn btn-label"
                            onClick={handleNotifySupervisor}
                          >
                            <SendIcon className="label-icon" />
                            Notify Supervisor, Accused Employee and HR
                          </Button>
                        </>
                      )}

                    {handleSendNotification &&
                      documentType === "Disciplinary Case" &&
                      String(status) === "Open" &&
                      currentUserEmployeeNo === caseRegisteredByNo && (
                        <>
                          {/* // send notification */}
                          <Button
                            color="info"
                            className="btn btn-label"
                            onClick={handleSendNotification}
                          >
                            <SendIcon className="label-icon" />
                            Send Notification
                          </Button>
                        </>
                      )}

                    {documentType != "Exit Interview" && (
                      <>
                        <Attachments
                          defaultCompany={companyId}
                          docType={documentType}
                          docNo={requestNo}
                          status={status}
                          tableId={tableId}
                        />
                        <ApprovalEntries
                          defaultCompany={companyId}
                          docType={documentType}
                          docNo={requestNo}
                        />
                        <ApprovalComments
                          defaultCompany={companyId || ""}
                          docType={documentType || ""}
                          docNo={requestNo || ""}
                        />
                      </>
                    )}

                    {documentType === "Performance Management" &&
                      stage === "Appraisee Rating" &&
                      currentUser === "Appraisee" && (
                        <Button
                          color="danger"
                          className="btn btn-label"
                          onClick={
                            handleDeletePurchaseRequisition
                              ? handleDeletePurchaseRequisition
                              : () => {
                                  if (handleDelete) {
                                    Swal.fire({
                                      title: "Are you sure?",
                                      text: "You won't be able to revert this!",
                                      icon: "warning",
                                      showCancelButton: true,
                                      confirmButtonColor: "#3085d6",
                                      cancelButtonColor: "#d33",
                                      confirmButtonText: "Yes, delete it!",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        handleDelete();
                                      }
                                    });
                                  }
                                }
                          }
                        >
                          <DeleteIcon
                            className="label-icon"
                            style={{ padding: "8px" }}
                          />
                          Delete Request
                        </Button>
                      )}
                    {documentType !== "Performance Management" && (
                      <>
                        {documentType === "Grievance Case" ? (
                          // For Grievance Cases, only show delete if user is the case initiator
                          currentUserEmployeeNo === caseRegisteredByNo && (
                            <Button
                              color="danger"
                              className="btn btn-label"
                              onClick={() => {
                                if (handleDelete) {
                                  Swal.fire({
                                    title: "Are you sure?",
                                    text: "You won't be able to revert this!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Yes, delete it!",
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      handleDelete();
                                    }
                                  });
                                }
                              }}
                            >
                              <DeleteIcon
                                className="label-icon"
                                style={{ padding: "8px" }}
                              />
                              Delete Case
                            </Button>
                          )
                        ) : (
                          // For other document types, use existing logic
                          <Button
                            color="danger"
                            className="btn btn-label"
                            onClick={
                              handleDeletePurchaseRequisition
                                ? handleDeletePurchaseRequisition
                                : () => {
                                    if (handleDelete) {
                                      Swal.fire({
                                        title: "Are you sure?",
                                        text: "You won't be able to revert this!",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "Yes, delete it!",
                                      }).then((result) => {
                                        if (result.isConfirmed) {
                                          handleDelete();
                                        }
                                      });
                                    }
                                  }
                            }
                          >
                            <DeleteIcon
                              className="label-icon"
                              style={{ padding: "8px" }}
                            />
                            Delete Request
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </Row>
              )}

              {/* Send Response button for Submitted to Employee status */}
              {handleSendResponse &&
                documentType === "Grievance Case" &&
                String(status) === "Submitted to Employee" &&
                (currentUserEmployeeNo === indictedEmployeeNo ||
                  currentUserEmployeeNo === sendGrievanceTo) && (
                  <Row className="justify-content-center mb-4">
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        className="btn btn-label"
                        onClick={handleSendResponse}
                      >
                        <SendIcon className="label-icon" />
                        Send Response
                      </Button>
                    </div>
                  </Row>
                )}
              {documentType === "Grievance Case" &&
                String(status) === "Employee Response" &&
                currentUserEmployeeNo === caseRegisteredByNo && (
                  <Row className="justify-content-center mb-4">
                    <div className="d-flex flex-wrap gap-2">
                      {/* back button */}
                      <Button
                        color="secondary"
                        className="btn btn-label"
                        onClick={handleBack}
                      >
                        <ArrowBackIcon className="label-icon" />
                        Back
                      </Button>
                      {handleWithdrawCase && (
                        <Button
                          color="danger"
                          className="btn btn-label"
                          onClick={handleWithdrawCase}
                        >
                          <CancelIcon className="label-icon" />
                          Withdraw Case
                        </Button>
                      )}
                      {handleCloseGrievance && (
                        <Button
                          color="success"
                          className="btn btn-label"
                          onClick={handleCloseGrievance}
                        >
                          <i className="label-icon">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </i>
                          Close Grievance
                        </Button>
                      )}
                      <Attachments
                        defaultCompany={companyId}
                        docType={documentType}
                        docNo={requestNo}
                        status={status}
                        tableId={tableId}
                      />
                    </div>
                  </Row>
                )}

              {handleWithdrawCase &&
                documentType === "Grievance Case" &&
                String(status) === "Submitted to Employee" &&
                currentUserEmployeeNo === caseRegisteredByNo && (
                  <Row className="justify-content-center mb-4">
                    <div className="d-flex flex-wrap gap-2">
                      {/* back button */}
                      <Button
                        color="secondary"
                        className="btn btn-label"
                        onClick={handleBack}
                      >
                        <ArrowBackIcon className="label-icon" />
                        Back
                      </Button>
                      {/* withdraw button */}
                      <Button
                        color="danger"
                        className="btn btn-label"
                        onClick={handleWithdrawCase}
                      >
                        <CancelIcon className="label-icon" />
                        Withdraw Case
                      </Button>
                    </div>
                  </Row>
                )}

              {status === "Pending Approval" && (
                <Row className="justify-content-center mb-4">
                  <div className="d-flex flex-wrap gap-2">
                    {/* back button */}
                    <Button
                      color="secondary"
                      className="btn  btn-label"
                      onClick={handleBack}
                    >
                      <i className="label-icon">
                        <ArrowBackIcon className="label-icon" />
                      </i>
                      Back
                    </Button>
                    {documentType !== "Exit Clearance" && (
                      <Button
                        color="danger"
                        type="button"
                        className="btn btn-danger btn-label"
                        onClick={handleCancelApprovalRequest}
                      >
                        Cancel Approval Request
                        <CancelIcon className="label-icon" />
                      </Button>
                    )}
                    {documentType === "Exit Clearance" && (
                      <>
                        {/* HR Officer */}
                        {handleHROfficerClearance && (
                          <Button
                            color="success"
                            className="btn btn-label"
                            onClick={handleHROfficerClearance}
                          >
                            <i className="label-icon">👤</i>
                            HR Officer Clearance
                          </Button>
                        )}
                        {/* Finance */}
                        {handleFinanceClearance && (
                          <Button
                            color="warning"
                            className="btn btn-label"
                            onClick={handleFinanceClearance}
                          >
                            <i className="label-icon">$</i>
                            Finance Clearance
                          </Button>
                        )}
                        {/* Admin */}
                        {handleMedicalAdminClearance && (
                          <Button
                            color="success"
                            className="btn btn-label"
                            onClick={handleMedicalAdminClearance}
                          >
                            <i className="label-icon">🏥</i>
                            Admin Clearance
                          </Button>
                        )}
                        {/* Supervisor */}
                        {handleSupervisorClearance && (
                          <Button
                            color="secondary"
                            className="btn btn-label"
                            onClick={handleSupervisorClearance}
                          >
                            <i className="label-icon">👨‍💼</i>
                            Supervisor Clearance
                          </Button>
                        )}
                        {/* IT */}
                        {handleITClearance && (
                          <Button
                            color="info"
                            className="btn btn-label"
                            onClick={handleITClearance}
                          >
                            <i className="label-icon">💻</i>
                            IT Clearance
                          </Button>
                        )}
                        {/* Head of Department */}
                        {handleHeadOfDepartmentClearance && (
                          <Button
                            color="primary"
                            className="btn btn-label"
                            onClick={handleHeadOfDepartmentClearance}
                          >
                            <i className="label-icon">👨‍💼</i>
                            Head of Department Clearance
                          </Button>
                        )}
                        {/* HR Manager */}
                        {handleHRManagerClearance && (
                          <Button
                            color="info"
                            className="btn btn-label"
                            onClick={handleHRManagerClearance}
                          >
                            <i className="label-icon">👥</i>
                            HR Manager Clearance
                          </Button>
                        )}
                      </>
                    )}
                    <Attachments
                      defaultCompany={companyId}
                      docType={documentType}
                      docNo={requestNo}
                      status={status}
                      tableId={tableId}
                    />

                    <ApprovalEntries
                      defaultCompany={companyId}
                      docType={documentType}
                      docNo={requestNo}
                    />
                  </div>
                </Row>
              )}
              {status === "Approved" && (
                <Row className="justify-content-center mb-4">
                  <div className="d-flex flex-wrap gap-2">
                    <Button
                      color="secondary"
                      className="btn  btn-label"
                      onClick={handleBack}
                    >
                      <i className="label-icon">
                        <ArrowBackIcon className="label-icon" />
                      </i>
                      Back
                    </Button>
                    {documentType === "Performance Management" &&
                      stage === "Appraisee Rating" &&
                      breadcrumbItem === "Individual Performance Agreement" && (
                        <>
                          <Button
                            color="primary"
                            className="btn btn-label"
                            onClick={handleConvertToPerformanceAppraisal}
                          >
                            <i className="label-icon">
                              <ConvertIcon className="label-icon" />
                            </i>
                            Convert to Performance Appraisal
                          </Button>
                        </>
                      )}

                    {documentType === "Performance Management" &&
                      stage === "Closed" && (
                        <>
                          <Button
                            color="primary"
                            className="btn btn-label"
                            onClick={onPrintClick}
                          >
                            <i className="label-icon">
                              <PrintIcon className="label-icon" fontSize={16} />
                            </i>
                            Print Performance Appraisal
                          </Button>
                        </>
                      )}
                    <Attachments
                      defaultCompany={companyId}
                      docType={documentType}
                      docNo={requestNo}
                      status={status}
                      tableId={tableId}
                    />

                    <ApprovalEntries
                      defaultCompany={companyId}
                      docType={documentType}
                      docNo={requestNo}
                    />
                    <ApprovalComments
                      defaultCompany={companyId || ""}
                      docType={documentType || ""}
                      docNo={requestNo || ""}
                    />
                  </div>
                </Row>
              )}
              {status === "Submitted" && documentType === "Exit Interview" && (
                // back button
                <>
                  <Row className="justify-content-center mb-4">
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="secondary"
                        className="btn btn-label"
                        onClick={handleBack}
                      >
                        <ArrowBackIcon className="label-icon" />
                        Back
                      </Button>
                      <Button
                        color="primary"
                        className="btn btn-label"
                        onClick={onPrintClick}
                      >
                        <PrintIcon className="label-icon" />
                        Print Exit Interview
                      </Button>
                    </div>
                  </Row>
                </>
              )}
              {(documentType === "TIME SHEET" ||
                documentType === "Time Sheet") && (
                <>
                  {/*  reopen buttion */}
                  <Row className="justify-content-center mb-4">
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="secondary"
                        className="btn  btn-label"
                        onClick={handleReopen}
                      >
                        <i className="label-icon">
                          <ReopenIcon className="label-icon" />
                        </i>
                        Reopen
                      </Button>
                    </div>
                    {/*  submit button  */}
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        color="primary"
                        className="btn btn-label"
                        onClick={handleSubmit}
                      >
                        <i className="label-icon">
                          <SaveIcon className="label-icon" />
                        </i>
                        Submit
                      </Button>
                    </div>
                  </Row>
                </>
              )}
            </>
          )}

          {pageType === "approval" && (
            <>
              <Row className="justify-content-center mb-4">
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    color="secondary"
                    className="btn  btn-label"
                    onClick={handleBack}
                  >
                    <i className="label-icon">
                      <ArrowBackIcon className="label-icon" />
                    </i>
                    Back
                  </Button>
                  <ApprovalAction
                    docNo={requestNo}
                    docType={documentType}
                    companyId={companyId}
                  />
                  {documentType != "Time Sheets" && (
                    <>
                      <Attachments
                        defaultCompany={companyId}
                        docType={documentType}
                        docNo={requestNo}
                        status={status}
                        tableId={tableId}
                      />

                      <ApprovalEntries
                        defaultCompany={companyId}
                        docType={documentType}
                        docNo={requestNo}
                      />
                    </>
                  )}
                </div>
              </Row>
            </>
          )}
          {pageType === "time-sheet" && (
            <>
              {/*  reopen buttion */}
              <Row className="justify-content-center mb-4">
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    color="secondary"
                    className="btn btn-label"
                    onClick={handleBack}
                  >
                    <i className="label-icon">
                      <ArrowBackIcon className="label-icon" />
                    </i>
                    Back
                  </Button>
                  <Button
                    color="primary"
                    className="btn  btn-label"
                    onClick={handleReopen}
                  >
                    <i className="label-icon">
                      <ReopenIcon
                        className="label-icon"
                        style={{ padding: "6px" }}
                      />
                    </i>
                    Reopen
                  </Button>

                  {/*  submit button  */}

                  <Button
                    color="success"
                    className="btn btn-label"
                    onClick={handleSubmit}
                  >
                    <i className="label-icon">
                      <SaveIcon className="label-icon" />
                    </i>
                    Submit
                  </Button>
                </div>
              </Row>
            </>
          )}

          {showError && (
            <Row>
              <MuiAlert severity="error" onClose={toggleError} className="mb-2">
                <i className="mdi mdi-block-helper me-2"></i>
                {docError}
              </MuiAlert>
            </Row>
          )}

          <Row>
            <Card>
              <CardContent>
                <div
                  className="accordion accordion-flush"
                  id="accordionFlushContainer"
                >
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="headingGeneral">
                      <button
                        className={classNames("accordion-button", "fw-medium", {
                          collapsed: !generalTab,
                        })}
                        type="button"
                        onClick={toggleGeneral}
                        style={{ cursor: "pointer" }}
                      >
                        General
                      </button>
                    </h2>
                    <Collapse
                      isOpen={generalTab}
                      className="accordion-collapse"
                      style={{ paddingBottom: 40 }}
                    >
                      <div className="accordion-body">
                        <Row>
                          {fields.map((field, index) => (
                            <Row className="mb-2" key={index}>
                              {field.map(
                                (
                                  {
                                    label,
                                    type,
                                    value,
                                    disabled,
                                    onChange,
                                    options,
                                    id,
                                    rows,
                                    onBlur,
                                    placeholder,
                                    checked,
                                    className,
                                  },
                                  idx
                                ) => (
                                  <Col sm={3} key={idx}>
                                    <Label htmlFor={id}>{label}</Label>
                                    {type === "select" ? (
                                      <Select
                                        options={options}
                                        isDisabled={disabled}
                                        value={value}
                                        onChange={onChange}
                                        id={id}
                                        classNamePrefix="select"
                                        isSearchable={true}
                                        onBlur={onBlur}
                                        styles={{
                                          control: (baseStyles, state) => ({
                                            ...baseStyles,
                                            backgroundColor: "white",
                                            borderColor: state.isFocused
                                              ? "#556ee6"
                                              : "#ced4da",
                                            "&:hover": {
                                              borderColor: "#556ee6",
                                            },
                                            boxShadow: state.isFocused
                                              ? "0 0 0 0.2rem rgba(85, 110, 230, 0.25)"
                                              : "none",
                                            minHeight: "36px",
                                          }),
                                          menu: (baseStyles) => ({
                                            ...baseStyles,
                                            backgroundColor: "white",
                                            zIndex: 9999,
                                          }),
                                          menuList: (baseStyles) => ({
                                            ...baseStyles,
                                            maxHeight: "200px",
                                            "::-webkit-scrollbar": {
                                              width: "8px",
                                              height: "0px",
                                            },
                                            "::-webkit-scrollbar-track": {
                                              background: "#f1f1f1",
                                            },
                                            "::-webkit-scrollbar-thumb": {
                                              background: "#888",
                                              borderRadius: "4px",
                                            },
                                            "::-webkit-scrollbar-thumb:hover": {
                                              background: "#555",
                                            },
                                          }),
                                          option: (baseStyles, state) => ({
                                            ...baseStyles,
                                            backgroundColor: state.isSelected
                                              ? "#556ee6"
                                              : state.isFocused
                                              ? "#f8f9fa"
                                              : "white",
                                            color: state.isSelected
                                              ? "white"
                                              : "#495057",
                                            cursor: "pointer",
                                            "&:active": {
                                              backgroundColor: "#556ee6",
                                            },
                                          }),
                                          placeholder: (baseStyles) => ({
                                            ...baseStyles,
                                            color: "#74788d",
                                          }),
                                          singleValue: (baseStyles) => ({
                                            ...baseStyles,
                                            color: "#495057",
                                          }),
                                        }}
                                        theme={(theme) => ({
                                          ...theme,
                                          colors: {
                                            ...theme.colors,
                                            primary: "#556ee6",
                                            primary25: "#f8f9fa",
                                            primary50: "#f8f9fa",
                                            neutral20: "#ced4da",
                                          },
                                        })}
                                      />
                                    ) : type === "date" ? (
                                      <Flatpickr
                                        className="form-control"
                                        value={value}
                                        disabled={disabled}
                                        onChange={onChange}
                                        options={{
                                          dateFormat: "Y-m-d",
                                        }}
                                        id={id}
                                        onBlur={onBlur}
                                      />
                                    ) : type === "toggle" ? (
                                      <Toggle
                                        checked={checked || false}
                                        onChange={(newValue) => {
                                          if (onChange) {
                                            onChange({
                                              target: { checked: newValue },
                                            });
                                          }
                                        }}
                                        disabled={disabled}
                                        id={id}
                                        size="md"
                                        onBlur={onBlur}
                                      />
                                    ) : (
                                      <Input
                                        type={type}
                                        value={value}
                                        disabled={disabled}
                                        onChange={onChange}
                                        placeholder={placeholder}
                                        rows={rows}
                                        id={id}
                                        onBlur={onBlur}
                                        checked={checked}
                                        className={className}
                                      />
                                    )}
                                  </Col>
                                )
                              )}
                            </Row>
                          ))}
                        </Row>
                      </div>
                    </Collapse>
                    {editableLines
                      ? // <LinesEditable
                        //     columns={columns ? columns : []}
                        //     handleSubmitLines={(data: any[]) => handleSubmitLines?.(data, '') || Promise.resolve({ success: false })}
                        //     documentType={documentType ? documentType : ''}
                        //     rowLines={rowLines}
                        //     handleDeleteLine={handleDeleteLine ? handleDeleteLine : () => { }}
                        //     handleEditLine={(data: any) => handleEditLine?.(data) || Promise.resolve({ success: false })}
                        //     createNewLine={createNewLine ? createNewLine : () => { }}
                        // />
                        ""
                      : lines}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Row>
        </Container>
      </div>
    </LoadingOverlayWrapper>
  );
};

export default HeaderMui;
