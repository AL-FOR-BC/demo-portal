import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExitClearance } from "./hooks/useExitClearance";
import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import SectionHeader from "../../../Components/ui/SectionHeader";
import { Collapse, Paper, Box } from "@mui/material";
import { Row, Col, Input, Label } from "reactstrap";
import Toggle from "../../../Components/ui/Toggle/Toggle";
import { useAppSelector } from "../../../store/hook";
import { toast } from "react-toastify";
import { decodeValue, getErrorMessage } from "../../../utils/common";
import { exitClearanceService } from "../../../services/ExitClearanceService";
import { exitClearanceOrgPropertyService } from "../../../services/ExitClearanceOrgPropertyService";
import Swal from "sweetalert2";

const ExitClearanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    general: true,
    hrOfficer: true,
    finance: true,
    admin: true,
    jobInformation: true,
    organizationalProperty: true,
    headOfDepartment: true,
    hrManagerFinal: true,
  });

  const {
    state,
    formData,
    handleInputChange,
    deleteExitClearance,
    sendForApproval,
    cancelApproval,
    submitHandover,
    handleSaveOnBlur,
    getFormFields,
    isFieldDisabled,
    orgProperties,
    createOrgProperty,
    updateOrgProperty,
    updateLocalOrgProperty,
  } = useExitClearance({ mode: "edit", systemId: id });

  // Get logged-in user info from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const { companyId } = useAppSelector((state) => state.auth.session);

  // Check if current user is the owner of this Exit Clearance
  // const isOwner = user?.employeeNo === formData.employeeNo;

  // Check if current user is the supervisor
  const isSupervisor = user?.employeeNo === formData.supervisorNo;

  // Check if current user is the HR Officer
  const isHROfficer = user?.employeeNo === formData.hrOfficerNo;

  // Check if current user is the HR Manager
  const isHRManager = user?.employeeNo === formData.hrManagerNo;

  // Check if current user is the Finance Manager
  const isFinanceManager = user?.employeeNo === formData.financeManager;

  // Check if current user is the Admin
  const isAdmin = user?.employeeNo === formData.admin;

  // Check if Admin section should be disabled
  const isAdminSectionDisabled = !isAdmin;

  // Check if current user is the IT
  const isICTManager = user?.employeeNo === formData.ictManagerNo;

  // Check if IT section should be disabled
  const isITSectionDisabled = !isICTManager;

  // Determine if sections should be disabled based on ownership
  // const isSectionDisabled = !isOwner;

  // HR Officer section should be enabled only if user is the HR Officer
  // OR if status is "Pending Approval" and HR stage is "Pending Clearance" and user is HR Officer
  const isHROfficerSectionDisabled =
    !isHROfficer &&
    !(
      state.exitClearance?.status === "Pending Approval" &&
      formData.hrOfficerStage === "Pending Clearance" &&
      isHROfficer
    );

  // HR Manager section should be enabled only if user is the HR Manager
  // OR if status is "Pending Approval" and HR Manager stage is "Pending Clearance" and user is HR Manager
  const isHRManagerSectionDisabled =
    !isHRManager &&
    !(
      state.exitClearance?.status === "Pending Approval" &&
      formData.hrManagerStage === "Pending Clearance" &&
      isHRManager
    );

  // Finance Manager section should be enabled only if user is the Finance Manager
  // OR if status is "Pending Approval" and HR stage is "Pending Clearance" and user is Finance Manager
  const isFinanceManagerSectionDisabled =
    !isFinanceManager &&
    !(
      state.exitClearance?.status === "Pending Approval" &&
      formData.hrOfficerStage === "Pending Clearance" &&
      isFinanceManager
    );

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubmit = async () => {
    if (id) {
      const success = await submitHandover(state.exitClearance?.no || "");
      if (success) {
        navigate("/exit-clearance-form");
      }
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete this Exit Clearance?")
    ) {
      try {
        await deleteExitClearance();
      } catch (error) {
        // Error is already handled in deleteStaffHandover
      }
    }
  };

  const handleSendForApproval = async () => {
    try {
      await sendForApproval();
    } catch (error) {
      // Error is already handled in sendForApproval
    }
  };

  const handleCancelApproval = async () => {
    try {
      await cancelApproval();
    } catch (error) {
      // Error is already handled in cancelApproval
    }
  };

  const handleHROfficerClearance = async () => {
    try {
      if (!state.exitClearance?.no) {
        toast.error("Exit Clearance document number not found");
        return;
      }

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Confirm HR Officer Clearance",
        text: "Are you sure you want to process HR Officer clearance for this Exit Clearance?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, Process HR Officer Clearance",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading dialog
      Swal.fire({
        title: "Processing HR Officer Clearance...",
        text: "Please wait while we process your request",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await exitClearanceService.processHROfficerClearance(companyId, {
        no: state.exitClearance.no,
      });

      // Show success dialog
      await Swal.fire({
        title: "Success!",
        text: "HR Officer Clearance has been processed successfully",
        icon: "success",
        confirmButtonColor: "#28a745",
      });

      // Navigate back to the clearance list
      navigate("/exit-clearance-form-to-clear");
    } catch (error) {
      console.error("Error submitting HR Officer clearance:", error);

      // Show error dialog
      await Swal.fire({
        title: "Error!",
        text: `Error processing HR Officer clearance: ${getErrorMessage(
          error
        )}`,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleFinanceClearance = async () => {
    try {
      if (!state.exitClearance?.no) {
        toast.error("Exit Clearance document number not found");
        return;
      }

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Confirm Finance Clearance",
        text: "Are you sure you want to process Finance clearance for this Exit Clearance?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ffc107",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, Process Finance Clearance",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading dialog
      Swal.fire({
        title: "Processing Finance Clearance...",
        text: "Please wait while we process your request",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await exitClearanceService.processFinanceClearance(companyId, {
        no: state.exitClearance.no,
      });

      // Show success dialog
      await Swal.fire({
        title: "Success!",
        text: "Finance Clearance has been processed successfully",
        icon: "success",
        confirmButtonColor: "#ffc107",
      });

      // Navigate back to the clearance list
      navigate("/exit-clearance-form-to-clear");
    } catch (error) {
      console.error("Error submitting Finance clearance:", error);

      // Show error dialog
      await Swal.fire({
        title: "Error!",
        text: `Error processing Finance clearance: ${getErrorMessage(error)}`,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleITClearance = async () => {
    try {
      if (!state.exitClearance?.no) {
        toast.error("Exit Clearance document number not found");
        return;
      }

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Confirm IT Clearance",
        text: "Are you sure you want to process IT clearance for this Exit Clearance?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#17a2b8",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, Process IT Clearance",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading dialog
      Swal.fire({
        title: "Processing IT Clearance...",
        text: "Please wait while we process your request",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await exitClearanceService.processITClearance(companyId, {
        no: state.exitClearance.no,
      });

      // Show success dialog
      await Swal.fire({
        title: "Success!",
        text: "IT Clearance has been processed successfully",
        icon: "success",
        confirmButtonColor: "#17a2b8",
      });

      // Refresh the data to show updated status
      navigate("/exit-clearance-form-to-clear");
    } catch (error) {
      console.error("Error submitting IT clearance:", error);

      // Show error dialog
      await Swal.fire({
        title: "Error!",
        text: `Error processing IT clearance: ${getErrorMessage(error)}`,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleSupervisorClearance = async () => {
    try {
      if (!state.exitClearance?.no) {
        toast.error("Exit Clearance document number not found");
        return;
      }

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Confirm Supervisor Clearance",
        text: "Are you sure you want to process Supervisor clearance for this Exit Clearance?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#6c757d",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, Process Supervisor Clearance",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading dialog
      Swal.fire({
        title: "Processing Supervisor Clearance...",
        text: "Please wait while we process your request",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await exitClearanceService.processSupervisorClearance(companyId, {
        no: state.exitClearance.no,
      });

      // Show success dialog
      await Swal.fire({
        title: "Success!",
        text: "Supervisor Clearance has been processed successfully",
        icon: "success",
        confirmButtonColor: "#6c757d",
      });

      // Navigate back to the clearance list
      navigate("/exit-clearance-form-to-clear");
    } catch (error) {
      console.error("Error submitting Supervisor clearance:", error);

      // Show error dialog
      await Swal.fire({
        title: "Error!",
        text: `Error processing Supervisor clearance: ${getErrorMessage(
          error
        )}`,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleHRManagerClearance = async () => {
    try {
      if (!state.exitClearance?.no) {
        toast.error("Exit Clearance document number not found");
        return;
      }

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Confirm HR Manager Clearance",
        text: "Are you sure you want to process HR Manager clearance for this Exit Clearance?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#17a2b8",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, Process HR Manager Clearance",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading dialog
      Swal.fire({
        title: "Processing HR Manager Clearance...",
        text: "Please wait while we process your request",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await exitClearanceService.processHRManagerClearance(companyId, {
        no: state.exitClearance.no,
      });

      // Show success dialog
      await Swal.fire({
        title: "Success!",
        text: "HR Manager Clearance has been processed successfully",
        icon: "success",
        confirmButtonColor: "#17a2b8",
      });

      // Navigate back to the clearance list
      navigate("/exit-clearance-form-to-clear");
    } catch (error) {
      console.error("Error submitting HR Manager clearance:", error);

      // Show error dialog
      await Swal.fire({
        title: "Error!",
        text: `Error processing HR Manager clearance: ${getErrorMessage(
          error
        )}`,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleHeadOfDepartmentClearance = async () => {
    try {
      if (!state.exitClearance?.no) {
        toast.error("Exit Clearance document number not found");
        return;
      }

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Confirm Head of Department Clearance",
        text: "Are you sure you want to process Head of Department clearance for this Exit Clearance?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#007bff",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, Process Head of Department Clearance",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading dialog
      Swal.fire({
        title: "Processing Head of Department Clearance...",
        text: "Please wait while we process your request",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await exitClearanceService.processHeadOfDepartmentClearance(companyId, {
        no: state.exitClearance.no,
      });

      // Show success dialog
      await Swal.fire({
        title: "Success!",
        text: "Head of Department Clearance has been processed successfully",
        icon: "success",
        confirmButtonColor: "#007bff",
      });

      // Navigate back to the clearance list
      navigate("/exit-clearance-form-to-clear");
    } catch (error) {
      console.error("Error submitting Head of Department clearance:", error);

      // Show error dialog
      await Swal.fire({
        title: "Error!",
        text: `Error processing Head of Department clearance: ${getErrorMessage(
          error
        )}`,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleMedicalAdminClearance = async () => {
    try {
      if (!state.exitClearance?.no) {
        toast.error("Exit Clearance document number not found");
        return;
      }

      // Show confirmation dialog
      const result = await Swal.fire({
        title: "Confirm Admin Clearance",
        text: "Are you sure you want to process Admin clearance for this Exit Clearance?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Yes, Process Admin Clearance",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading dialog
      Swal.fire({
        title: "Processing Admin Clearance...",
        text: "Please wait while we process your request",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await exitClearanceService.processMedicalAdminClearance(companyId, {
        no: state.exitClearance.no,
      });

      // Show success dialog
      await Swal.fire({
        title: "Success!",
        text: "Admin Clearance has been processed successfully",
        icon: "success",
        confirmButtonColor: "#28a745",
      });

      // Refresh the data to show updated status
      navigate("/exit-clearance-form-to-clear");
    } catch (error) {
      console.error("Error submitting Admin clearance:", error);

      // Show error dialog
      await Swal.fire({
        title: "Error!",
        text: `Error processing Admin clearance: ${getErrorMessage(error)}`,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  // Determine which clearance buttons to show based on user role and stage
  const shouldShowHROfficerClearance =
    state.exitClearance?.status === "Pending Approval" &&
    formData.hrOfficerStage === "Pending Clearance" &&
    isHROfficer;

  const shouldShowFinanceClearance =
    state.exitClearance?.status === "Pending Approval" &&
    formData.financeStage === "Pending Clearance" &&
    isFinanceManager;

  const shouldShowITClearance =
    state.exitClearance?.status === "Pending Approval" &&
    formData.ictStage === "Pending Clearance" &&
    isICTManager;

  const shouldShowAdminClearance =
    state.exitClearance?.status === "Pending Approval" &&
    formData.adminStage === "Pending Clearance" &&
    isAdmin;

  const shouldShowSupervisorClearance =
    state.exitClearance?.status === "Pending Approval" &&
    formData.supervisorStage === "Pending Clearance" &&
    isSupervisor &&
    user?.employeeNo !== formData.headOfDepartmentNo; // Don't show if user is also Head of Department

  const shouldShowHeadOfDepartmentClearance =
    state.exitClearance?.status === "Pending Approval" &&
    formData.headOfDepartmentStage === "Pending Clearance" &&
    user?.employeeNo === formData.headOfDepartmentNo;

  const shouldShowHRManagerClearance =
    state.exitClearance?.status === "Pending Approval" &&
    formData.hrManagerStage === "Pending Clearance" &&
    isHRManager;

  // Debug logging for clearance buttons
  console.log("Clearance Buttons Check:", {
    status: state.exitClearance?.status,
    hrStage: formData.hrOfficerStage,
    financeStage: formData.financeStage,
    ictStage: formData.ictStage,
    adminStage: formData.adminStage,
    isHRManager,
    isFinanceManager,
    isICTManager,
    isAdmin,
    shouldShowHROfficerClearance,
    shouldShowFinanceClearance,
    shouldShowITClearance,
    shouldShowAdminClearance,
    shouldShowSupervisorClearance,
  });

  if (state.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <HeaderMui
      title="Exit Clearance"
      subtitle="Exit Clearance Details"
      breadcrumbItem="Exit Clearance"
      fields={getFormFields()}
      status={state.exitClearance?.status}
      documentType={decodeValue(
        state.exitClearance?.approvalDocumentType || "Exit Clearance"
      )}
      tableId={50470}
      requestNo={state.exitClearance?.no || ""}
      companyId={companyId}
      isLoading={state.isLoading}
      pageType="detail"
      hrOfficerStage={formData.hrOfficerStage}
      financeStage={formData.financeStage}
      adminStage={formData.adminStage}
      supervisorStage={formData.supervisorStage}
      ictStage={formData.ictStage}
      headOfDepartmentStage={formData.headOfDepartmentStage}
      hrManagerStage={formData.hrManagerStage}
      handleBack={() => navigate(-1)}
      handleSubmit={handleSubmit}
      handleDelete={handleDelete}
      handleSendApprovalRequest={handleSendForApproval}
      handleCancelApprovalRequest={handleCancelApproval}
      handleHROfficerClearance={
        shouldShowHROfficerClearance ? handleHROfficerClearance : undefined
      }
      handleFinanceClearance={
        shouldShowFinanceClearance ? handleFinanceClearance : undefined
      }
      handleITClearance={shouldShowITClearance ? handleITClearance : undefined}
      handleMedicalAdminClearance={
        shouldShowAdminClearance ? handleMedicalAdminClearance : undefined
      }
      handleSupervisorClearance={
        shouldShowSupervisorClearance ? handleSupervisorClearance : undefined
      }
      handleHeadOfDepartmentClearance={
        shouldShowHeadOfDepartmentClearance
          ? handleHeadOfDepartmentClearance
          : undefined
      }
      handleHRManagerClearance={
        shouldShowHRManagerClearance ? handleHRManagerClearance : undefined
      }
      lines={
        <>
          {/* Job Information Section */}
          <Paper elevation={2} className="mt-4">
            <SectionHeader
              title="Job Information (to be verified by the supervisor)"
              open={openSections.jobInformation}
              onToggle={() => toggleSection("jobInformation")}
            />
            <Collapse in={openSections.jobInformation}>
              <Box p={3}>
                <Row>
                  <Col md={12}>
                    <Label for="informationRequiringPasswords">
                      (a) Any Information that Require passwords (state where it
                      is saved, name and password)
                    </Label>
                    <Input
                      type="textarea"
                      id="informationRequiringPasswords"
                      value={formData.informationRequiringPasswords || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "informationRequiringPasswords",
                          e.target.value
                        )
                      }
                      onBlur={handleSaveOnBlur}
                      disabled={
                        isFieldDisabled ||
                        state.exitClearance?.status === "Approved"
                      }
                      rows={4}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={12}>
                    <Label for="pendingActivitiesAndFuturePlan">
                      (b) Pending Activities and Future plan/progress
                    </Label>
                    <Input
                      type="textarea"
                      id="pendingActivitiesAndFuturePlan"
                      value={formData.pendingActivitiesAndFuturePlan || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "pendingActivitiesAndFuturePlan",
                          e.target.value
                        )
                      }
                      onBlur={handleSaveOnBlur}
                      disabled={
                        isFieldDisabled ||
                        state.exitClearance?.status === "Approved"
                      }
                      rows={4}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Label for="supervisorNo">Supervisor No.</Label>
                    <Input
                      type="text"
                      id="supervisorNo"
                      value={formData.supervisorNo || ""}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="supervisorName">Supervisor Name</Label>
                    <Input
                      type="text"
                      id="supervisorName"
                      value={formData.supervisorName || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Toggle
                      id="supervisorVerification"
                      checked={(() => {
                        const value = formData.supervisorVerification;
                        const isChecked =
                          value === "YES" || (value as any) === true;
                        console.log("Supervisor Verification Debug:", {
                          rawValue: value,
                          type: typeof value,
                          isChecked: isChecked,
                        });
                        return isChecked;
                      })()}
                      onChange={(checked) => {
                        const value = checked ? "YES" : "NO";
                        console.log("Toggle onChange called:", {
                          checked,
                          value,
                        });
                        handleInputChange("supervisorVerification", value);
                        // Save immediately with the new value
                        handleSaveOnBlur("supervisorVerification", value);
                      }}
                      onBlur={() => {
                        // onBlur is redundant now since we save on change
                        console.log("Toggle onBlur called (redundant)");
                      }}
                      disabled={!isSupervisor}
                      label="Supervisor Verification"
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="supervisorStage">Supervisor Stage</Label>
                    <Input
                      type="text"
                      id="supervisorStage"
                      value={formData.supervisorStage || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Box>
            </Collapse>
          </Paper>

          {/* HR Officer Section */}
          <Paper elevation={2} className="mt-4">
            <SectionHeader
              title="3.	OUTSTANDING HR ISSUES (To be completed/ Verified by the HR Officer)"
              open={openSections.hrOfficer}
              onToggle={() => toggleSection("hrOfficer")}
            />
            <Collapse in={openSections.hrOfficer}>
              <Box p={3}>
                {isHROfficerSectionDisabled && (
                  <div className="alert alert-info mb-3">
                    <i className="bx bx-info-circle me-2"></i>
                    {state.exitClearance?.status === "Pending Approval" &&
                    formData.hrOfficerStage === "Pending Clearance" ? (
                      <>
                        This section is editable by the HR Officer during
                        clearance process. HR Officer:{" "}
                        {formData.hrOfficerNo || "Not assigned"}. Current user:{" "}
                        {user?.employeeNo || "Unknown"}
                      </>
                    ) : (
                      <>
                        This section is only editable by the HR Officer
                        (Employee No: {formData.hrOfficerNo || "Not assigned"}).
                        Current user: {user?.employeeNo || "Unknown"}
                      </>
                    )}
                  </div>
                )}
                <Row>
                  <Col md={6}>
                    <Label for="identityCard">(a) Identity Card</Label>
                    <Input
                      type="select"
                      id="identityCard"
                      value={formData.identityCard}
                      onChange={(e) =>
                        handleInputChange("identityCard", e.target.value)
                      }
                      onBlur={() => handleSaveOnBlur("identityCard")}
                      disabled={isHROfficerSectionDisabled}
                    >
                      <option value="">Select...</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </Input>
                  </Col>
                  <Col md={6}>
                    <Label for="medicalCard">(b) Health Insurance card</Label>
                    <Input
                      type="select"
                      id="medicalCard"
                      value={formData.medicalCard}
                      onChange={(e) =>
                        handleInputChange("medicalCard", e.target.value)
                      }
                      onBlur={() => handleSaveOnBlur("medicalCard")}
                      disabled={isHROfficerSectionDisabled}
                    >
                      <option value="">Select...</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </Input>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Label for="timeSheetForTheLastPeriod">
                      (c) Time sheet for the last period
                    </Label>
                    <Input
                      type="select"
                      id="timeSheetForTheLastPeriod"
                      value={formData.timeSheetForTheLastPeriod}
                      onChange={(e) =>
                        handleInputChange(
                          "timeSheetForTheLastPeriod",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleSaveOnBlur("timeSheetForTheLastPeriod")
                      }
                      disabled={isHROfficerSectionDisabled}
                    >
                      <option value="">Select...</option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </Input>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Label for="hrOfficerNo">HR Officer</Label>
                    <Input
                      type="text"
                      id="hrOfficerNo"
                      value={formData.hrOfficerNo || ""}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="hrOfficerName">HR Officer Name</Label>
                    <Input
                      type="text"
                      id="hrOfficerName"
                      value={formData.hrOfficerName || ""}
                      onBlur={handleSaveOnBlur}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="hrOfficerStage">HR Stage</Label>
                    <Input
                      type="text"
                      id="hrOfficerStage"
                      value={formData.hrOfficerStage || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Box>
            </Collapse>
          </Paper>

          {/* Finance Section */}
          <Paper elevation={2} className="mt-4">
            <SectionHeader
              title="OUTSTANDING FINANCIAL OBLIGATIONS:"
              open={openSections.finance}
              onToggle={() => toggleSection("finance")}
            />
            <Collapse in={openSections.finance}>
              <Box p={3}>
                {isFinanceManagerSectionDisabled && (
                  <div className="alert alert-info mb-3">
                    <i className="bx bx-info-circle me-2"></i>
                    {state.exitClearance?.status === "Pending Approval" &&
                    formData.hrOfficerStage === "Pending Clearance" ? (
                      <>
                        This section is editable by the Finance Manager during
                        clearance process. Finance Manager:{" "}
                        {formData.financeManager || "Not assigned"}. Current
                        user: {user?.employeeNo || "Unknown"}
                      </>
                    ) : (
                      <>
                        This section is only editable by the Finance Manager
                        (Employee No:{" "}
                        {formData.financeManager || "Not assigned"}). Current
                        user: {user?.employeeNo || "Unknown"}
                      </>
                    )}
                  </div>
                )}
                <Row className="mt-3">
                  <Col md={6}>
                    <Label for="hasLoan">Has Loan</Label>
                    <Input
                      type="select"
                      id="hasLoan"
                      value={formData.hasLoan ? "YES" : "NO"}
                      onChange={(e) =>
                        handleInputChange("hasLoan", e.target.value === "YES")
                      }
                      onBlur={() => handleSaveOnBlur("hasLoan")}
                      disabled={isFinanceManagerSectionDisabled}
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </Input>
                  </Col>
                  {formData.hasLoan && (
                    <Col md={6}>
                      <Label for="loanAmount">Loan Amount</Label>
                      <Input
                        type="number"
                        id="loanAmount"
                        value={formData.loanAmount}
                        onChange={(e) => {
                          // Only allow numbers and decimal point
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          handleInputChange("loanAmount", value);
                        }}
                        onKeyDown={(e) => {
                          // Prevent non-numeric characters except backspace, delete, tab, escape, enter
                          if (
                            ![8, 9, 27, 13, 46, 110, 190].includes(e.keyCode) &&
                            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                            (![65, 67, 86, 88].includes(e.keyCode) ||
                              !e.ctrlKey) &&
                            // Allow: home, end, left, right, down, up
                            ![35, 36, 37, 38, 39, 40].includes(e.keyCode) &&
                            // Ensure that it is a number and stop the keypress
                            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                            (e.keyCode < 96 || e.keyCode > 105)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        onBlur={() => handleSaveOnBlur("loanAmount")}
                        disabled={isFinanceManagerSectionDisabled}
                        min="0"
                        step="0.01"
                        placeholder="Enter loan amount"
                      />
                    </Col>
                  )}
                  <Col md={6}>
                    <Label for="hasSalaryAdvance">Has Salary Advance</Label>
                    <Input
                      type="select"
                      id="hasSalaryAdvance"
                      value={formData.hasSalaryAdvance ? "YES" : "NO"}
                      onChange={(e) =>
                        handleInputChange(
                          "hasSalaryAdvance",
                          e.target.value === "YES"
                        )
                      }
                      onBlur={() => handleSaveOnBlur("hasSalaryAdvance")}
                      disabled={isFinanceManagerSectionDisabled}
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </Input>
                  </Col>
                  {formData.hasSalaryAdvance && (
                    <Col md={6}>
                      <Label for="salaryAdvanceAmount">
                        Salary Advance Amount
                      </Label>
                      <Input
                        type="number"
                        id="salaryAdvanceAmount"
                        value={formData.salaryAdvanceAmount}
                        onChange={(e) => {
                          // Only allow numbers and decimal point
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          handleInputChange("salaryAdvanceAmount", value);
                        }}
                        onKeyDown={(e) => {
                          // Prevent non-numeric characters except backspace, delete, tab, escape, enter
                          if (
                            ![8, 9, 27, 13, 46, 110, 190].includes(e.keyCode) &&
                            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                            (![65, 67, 86, 88].includes(e.keyCode) ||
                              !e.ctrlKey) &&
                            // Allow: home, end, left, right, down, up
                            ![35, 36, 37, 38, 39, 40].includes(e.keyCode) &&
                            // Ensure that it is a number and stop the keypress
                            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                            (e.keyCode < 96 || e.keyCode > 105)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        onBlur={() => handleSaveOnBlur("salaryAdvanceAmount")}
                        disabled={isFinanceManagerSectionDisabled}
                        min="0"
                        step="0.01"
                        placeholder="Enter salary advance amount"
                      />
                    </Col>
                  )}
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Label for="outstandingAccountabilities">
                      Outstanding Accountabilities
                      <span
                        className="text-muted ms-2"
                        style={{ fontSize: "0.875em" }}
                      >
                        (Enter N/A if there are no outstanding accountabilities)
                      </span>
                    </Label>
                    <Input
                      type="text"
                      id="outstandingAccountabilities"
                      value={formData.outstandingAccountabilities || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "outstandingAccountabilities",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        handleSaveOnBlur("outstandingAccountabilities")
                      }
                      disabled={isFinanceManagerSectionDisabled}
                      placeholder="Enter N/A if none"
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="financeStage">Finance Stage</Label>
                    <Input
                      type="text"
                      id="financeStage"
                      value={formData.financeStage || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Label for="financeManager">Finance Manager No.</Label>
                    <Input
                      type="text"
                      id="financeManager"
                      value={formData.financeManager || ""}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="financeManagerName">Finance Manager Name</Label>
                    <Input
                      type="text"
                      id="financeManagerName"
                      value={formData.financeManagerName || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Box>
            </Collapse>
          </Paper>

          {/* Organizational Property (IT) Section */}
          <Paper elevation={2} className="mt-4">
            <SectionHeader
              title="Organizational Property (IT)"
              open={openSections.organizationalProperty}
              onToggle={() => toggleSection("organizationalProperty")}
            />
            <Collapse in={openSections.organizationalProperty}>
              <Box p={3}>
                {isITSectionDisabled && (
                  <div className="alert alert-info mb-3">
                    <i className="bx bx-info-circle me-2"></i>
                    This section is only accessible to the IT assigned to this
                    Exit Clearance.
                  </div>
                )}
                {/* IT Organizational Properties Form Fields */}
                <Row className="mt-4">
                  <Col md={12}>
                    <h6>IT Organizational Properties</h6>
                    <p className="text-muted mb-3">
                      Select Yes/No for each IT property handover status
                    </p>
                  </Col>
                </Row>

                {orgProperties &&
                orgProperties.filter((p) => p.propertyCategory === "IT")
                  .length > 0 ? (
                  <Row>
                    {orgProperties
                      .filter((property) => property.propertyCategory === "IT")
                      .map((property, index) => (
                        <Col
                          md={6}
                          key={
                            property.systemId ||
                            `${property.propertyCode}-${index}`
                          }
                        >
                          <div className="mb-3">
                            <Label for={`property_${property.propertyCode}`}>
                              {property.propertyCode} -{" "}
                              {property.propertyDescription || "IT Equipment"}
                            </Label>
                            <Input
                              type="select"
                              id={`property_${property.propertyCode}`}
                              value={property.handover ? "Yes" : "No"}
                              onChange={(e) => {
                                // Update the local state immediately for UI responsiveness
                                const newHandoverStatus =
                                  e.target.value === "Yes";
                                updateLocalOrgProperty(
                                  property.propertyCode,
                                  newHandoverStatus
                                );
                                // The actual save will happen on onBlur
                              }}
                              onBlur={async (e) => {
                                const newHandoverStatus =
                                  e.target.value === "Yes";

                                if (property.systemId) {
                                  // Update existing property
                                  try {
                                    // First try with the current etag
                                    try {
                                      await updateOrgProperty(
                                        property.systemId,
                                        {
                                          handover: newHandoverStatus
                                            ? "Yes"
                                            : "No",
                                        },
                                        property["@odata.etag"] || "*"
                                      );
                                    } catch (error) {
                                      if (
                                        error.message?.includes(
                                          "Another user has already changed the record"
                                        )
                                      ) {
                                        // Get fresh properties to get the new etag
                                        const existingProperties =
                                          await exitClearanceOrgPropertyService.getOrgPropertiesByExitClearance(
                                            companyId,
                                            state.exitClearance?.no || ""
                                          );

                                        // Find the updated property
                                        const updatedProperty =
                                          existingProperties.find(
                                            (prop) =>
                                              prop.propertyCode ===
                                              property.propertyCode
                                          );

                                        if (
                                          updatedProperty &&
                                          updatedProperty.systemId
                                        ) {
                                          // Retry with the new etag
                                          await updateOrgProperty(
                                            updatedProperty.systemId,
                                            {
                                              handover: newHandoverStatus
                                                ? "Yes"
                                                : "No",
                                            },
                                            updatedProperty["@odata.etag"] ||
                                              "*"
                                          );
                                        } else {
                                          throw new Error(
                                            "Could not find property after refresh"
                                          );
                                        }
                                      } else {
                                        throw error; // Re-throw if it's not a concurrency error
                                      }
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error updating property:",
                                      error
                                    );
                                    toast.error(
                                      `Error updating property: ${
                                        error.message || "Please try again"
                                      }`
                                    );
                                  }
                                } else {
                                  // Try to find existing property first, then create if not found
                                  try {
                                    // First, try to get existing properties for this Exit Clearance
                                    const existingProperties =
                                      await exitClearanceOrgPropertyService.getOrgPropertiesByExitClearance(
                                        companyId,
                                        state.exitClearance?.no || ""
                                      );

                                    // Find the property with matching propertyCode
                                    const existingProperty =
                                      existingProperties.find(
                                        (prop) =>
                                          prop.propertyCode ===
                                          property.propertyCode
                                      );

                                    if (
                                      existingProperty &&
                                      existingProperty.systemId
                                    ) {
                                      // Update existing property
                                      await updateOrgProperty(
                                        existingProperty.systemId,
                                        {
                                          handover: newHandoverStatus
                                            ? "Yes"
                                            : "No",
                                        },
                                        "*"
                                      );
                                    } else {
                                      // Create new property if not found
                                      await createOrgProperty({
                                        ExitClearanceNo:
                                          state.exitClearance?.no || "",
                                        propertyCode: property.propertyCode,
                                        handover: newHandoverStatus
                                          ? "Yes"
                                          : "No",
                                      });
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Error updating property:",
                                      error
                                    );
                                    toast.error(
                                      "Error updating property. Please try again."
                                    );
                                  }
                                }
                              }}
                              disabled={isITSectionDisabled}
                            >
                              <option value="No">No</option>
                              <option value="Yes">Yes</option>
                            </Input>
                          </div>
                        </Col>
                      ))}
                  </Row>
                ) : (
                  <div className="text-center text-muted py-3">
                    No IT organizational properties found
                  </div>
                )}

                {/* IT System Access Fields */}
                <Row className="mt-4">
                  <Col md={12}>
                    <h6>IT System Access</h6>
                    <p className="text-muted mb-3">
                      Confirm the status of IT system access and email deletion
                    </p>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={4}>
                    <Label for="deletionEmail">Deletion Email</Label>
                    <Input
                      type="select"
                      id="deletionEmail"
                      value={formData.deletionEmail === "YES" ? "Yes" : "No"}
                      onChange={(e) =>
                        handleInputChange(
                          "deletionEmail",
                          e.target.value === "Yes" ? "YES" : "NO"
                        )
                      }
                      onBlur={() => handleSaveOnBlur("deletionEmail")}
                      disabled={isITSectionDisabled}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </Input>
                  </Col>
                  <Col md={4}>
                    <Label for="allSystemLoginDeleted">
                      All System Login Deleted
                    </Label>
                    <Input
                      type="select"
                      id="allSystemLoginDeleted"
                      value={
                        formData.allSystemLoginDeleted === "YES" ? "Yes" : "No"
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "allSystemLoginDeleted",
                          e.target.value === "Yes" ? "YES" : "NO"
                        )
                      }
                      onBlur={() => handleSaveOnBlur("allSystemLoginDeleted")}
                      disabled={isITSectionDisabled}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </Input>
                  </Col>
                  <Col md={4}>
                    <Label for="biometricAccessDeactivated">
                      Biometric Access Deactivated
                    </Label>
                    <Input
                      type="select"
                      id="biometricAccessDeactivated"
                      value={
                        formData.biometricAccessDeactivated === "YES"
                          ? "Yes"
                          : "No"
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "biometricAccessDeactivated",
                          e.target.value === "Yes" ? "YES" : "NO"
                        )
                      }
                      onBlur={() =>
                        handleSaveOnBlur("biometricAccessDeactivated")
                      }
                      disabled={isITSectionDisabled}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </Input>
                  </Col>
                </Row>

                {/* IT Status Field */}
                <Row className="mt-4">
                  <Col md={6}>
                    <Label for="ictStage">IT Status</Label>
                    <Input
                      type="text"
                      id="ictStage"
                      value={formData.ictStage || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>

                {/* IT Information */}
                <Row className="mt-4">
                  <Col md={6}>
                    <Label for="ictManagerNo">IT No.</Label>
                    <Input
                      type="text"
                      id="ictManagerNo"
                      value={formData.ictManagerNo || ""}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="ictManagerName">IT Name</Label>
                    <Input
                      type="text"
                      id="ictManagerName"
                      value={formData.ictManagerName || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Box>
            </Collapse>
          </Paper>

          {/* HR Manager Final Review Section */}
          <Paper elevation={2} className="mt-4">
            <SectionHeader
              title="HR Manager Final Review"
              open={openSections.hrManagerFinal}
              onToggle={() => toggleSection("hrManagerFinal")}
            />
            <Collapse in={openSections.hrManagerFinal}>
              <Box p={3}>
                {(!isHRManager || isHRManagerSectionDisabled) && (
                  <div className="alert alert-info mb-3">
                    <i className="bx bx-info-circle me-2"></i>
                    {state.exitClearance?.status === "Pending Approval" &&
                    formData.hrManagerStage === "Pending Clearance" ? (
                      <>
                        This section is editable by the HR Manager during
                        clearance process. HR Manager:{" "}
                        {formData.hrManagerNo || "Not assigned"}. Current user:{" "}
                        {user?.employeeNo || "Unknown"}
                      </>
                    ) : (
                      <>
                        This section is only accessible to the HR Manager
                        (Employee No: {formData.hrManagerNo || "Not assigned"}).
                        Current user: {user?.employeeNo || "Unknown"}
                      </>
                    )}
                  </div>
                )}
                <Row>
                  <Col md={12}>
                    <Label for="hrManagerFinalComments">
                      HR Manager Final Comments
                      <span
                        className="text-muted ms-2"
                        style={{ fontSize: "0.875em" }}
                      >
                        (Enter N/A if there are no comments)
                      </span>
                    </Label>
                    <Input
                      type="textarea"
                      id="hrManagerFinalComments"
                      value={formData.hrManagerFinalComments || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "hrManagerFinalComments",
                          e.target.value
                        )
                      }
                      onBlur={() => handleSaveOnBlur("hrManagerFinalComments")}
                      disabled={!isHRManager || isHRManagerSectionDisabled}
                      rows={4}
                      placeholder="Enter N/A if no comments"
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Label for="hrManagerFinalStage">
                      HR Manager Final Stage
                    </Label>
                    <Input
                      type="text"
                      id="hrManagerFinalStage"
                      value={formData.hrManagerStage || ""}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="hrManagerNo">HR Manager No.</Label>
                    <Input
                      type="text"
                      id="hrManagerNo"
                      value={formData.hrManagerNo || ""}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="hrManagerName">HR Manager Name</Label>
                    <Input
                      type="text"
                      id="hrManagerName"
                      value={formData.hrManagerName || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Box>
            </Collapse>
          </Paper>

          {/* Head of Department Section */}
          <Paper elevation={2} className="mt-4">
            <SectionHeader
              title="Head of Department Review"
              open={openSections.headOfDepartment}
              onToggle={() => toggleSection("headOfDepartment")}
            />
            <Collapse in={openSections.headOfDepartment}>
              <Box p={3}>
                {user?.employeeNo !== formData.headOfDepartmentNo && (
                  <div className="alert alert-info mb-3">
                    <i className="bx bx-info-circle me-2"></i>
                    This section is only accessible to the Head of Department
                    assigned to this Exit Clearance. Head of Department:{" "}
                    {formData.headOfDepartmentNo || "Not assigned"}. Current
                    user: {user?.employeeNo || "Unknown"}
                  </div>
                )}
                <Row>
                  <Col md={12}>
                    <Label for="hodComments">Head of Department Comments</Label>
                    <Input
                      type="textarea"
                      id="hodComments"
                      value={formData.hodComments || ""}
                      onChange={(e) =>
                        handleInputChange("hodComments", e.target.value)
                      }
                      onBlur={() => handleSaveOnBlur("hodComments")}
                      disabled={
                        user?.employeeNo !== formData.headOfDepartmentNo ||
                        state.exitClearance?.status === "Approved"
                      }
                      rows={4}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Label for="hodStage">Head of Department Stage</Label>
                    <Input
                      type="text"
                      id="hodStage"
                      value={formData.headOfDepartmentStage || ""}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="headOfDepartmentNo">
                      Head of Department No.
                    </Label>
                    <Input
                      type="text"
                      id="headOfDepartmentNo"
                      value={formData.headOfDepartmentNo || ""}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="headOfDepartmentName">
                      Head of Department Name
                    </Label>
                    <Input
                      type="text"
                      id="headOfDepartmentName"
                      value={formData.headOfDepartmentName || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Box>
            </Collapse>
          </Paper>

          {/* Admin Section */}
          <Paper elevation={2} className="mt-4">
            <SectionHeader
              title="Admin"
              open={openSections.Admin}
              onToggle={() => toggleSection("Admin")}
            />
            <Collapse in={openSections.Admin}>
              <Box p={3}>
                {isAdminSectionDisabled && (
                  <div className="alert alert-info mb-3">
                    <i className="bx bx-info-circle me-2"></i>
                    This section is only accessible to the Admin assigned to
                    this Exit Clearance.
                  </div>
                )}
                {/* Admin Organizational Properties Table */}
                <Row className="mt-4">
                  <Col md={12}>
                    <div className="mb-3">
                      <h6>Admin Properties List</h6>
                    </div>
                    {orgProperties &&
                    orgProperties.filter((p) => p.propertyCategory === "Admin")
                      .length > 0 ? (
                      <Row>
                        {orgProperties
                          .filter(
                            (property) => property.propertyCategory === "Admin"
                          )
                          .map((property, index) => (
                            <Col
                              md={6}
                              key={
                                property.systemId ||
                                `${property.propertyCode}-${index}`
                              }
                            >
                              <div className="mb-3">
                                <Label
                                  for={`property_${property.propertyCode}`}
                                >
                                  {property.propertyCode} -{" "}
                                  {property.propertyDescription ||
                                    "Admin Equipment"}
                                </Label>
                                <Input
                                  type="select"
                                  id={`property_${property.propertyCode}`}
                                  value={property.handover ? "Yes" : "No"}
                                  onChange={(e) => {
                                    // Update the local state immediately for UI responsiveness
                                    const newHandoverStatus =
                                      e.target.value === "Yes";
                                    updateLocalOrgProperty(
                                      property.propertyCode,
                                      newHandoverStatus
                                    );
                                    // The actual save will happen on onBlur
                                  }}
                                  onBlur={async (e) => {
                                    const newHandoverStatus =
                                      e.target.value === "Yes";

                                    if (property.systemId) {
                                      // Update existing property
                                      try {
                                        await updateOrgProperty(
                                          property.systemId,
                                          {
                                            handover: newHandoverStatus
                                              ? "Yes"
                                              : "No",
                                          },
                                          property["@odata.etag"] || "*"
                                        );
                                      } catch (error) {
                                        console.error(
                                          "Error updating property:",
                                          error
                                        );
                                      }
                                    } else {
                                      // Try to find existing property first, then create if not found
                                      try {
                                        // First, try to get existing properties for this Exit Clearance
                                        const existingProperties =
                                          await exitClearanceOrgPropertyService.getOrgPropertiesByExitClearance(
                                            companyId,
                                            state.exitClearance?.no || ""
                                          );

                                        // Find the property with matching propertyCode
                                        const existingProperty =
                                          existingProperties.find(
                                            (prop) =>
                                              prop.propertyCode ===
                                              property.propertyCode
                                          );

                                        if (
                                          existingProperty &&
                                          existingProperty.systemId
                                        ) {
                                          // Update existing property
                                          await updateOrgProperty(
                                            existingProperty.systemId,
                                            {
                                              handover: newHandoverStatus
                                                ? "Yes"
                                                : "No",
                                            },

                                            "*"
                                          );
                                        } else {
                                          // Create new property if not found
                                          await createOrgProperty({
                                            ExitClearanceNo:
                                              state.exitClearance?.no || "",
                                            propertyCode: property.propertyCode,
                                            handover: newHandoverStatus
                                              ? "Yes"
                                              : "No",
                                          });
                                        }
                                      } catch (error) {
                                        console.error(
                                          "Error updating property:",
                                          error
                                        );
                                        toast.error(
                                          "Error updating property. Please try again."
                                        );
                                      }
                                    }
                                  }}
                                  disabled={isAdminSectionDisabled}
                                >
                                  <option value="No">No</option>
                                  <option value="Yes">Yes</option>
                                </Input>
                              </div>
                            </Col>
                          ))}
                      </Row>
                    ) : (
                      <div className="text-center text-muted py-3">
                        No Admin properties found
                      </div>
                    )}
                  </Col>
                </Row>

                {/* Admin Status Field */}
                <Row className="mt-4">
                  <Col md={6}>
                    <Label for="adminStage">Admin Status</Label>
                    <Input
                      type="text"
                      id="adminStage"
                      value={formData.adminStage || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>

                {/* Admin Information */}
                <Row className="mt-4">
                  <Col md={6}>
                    <Label for="admin">Admin</Label>
                    <Input
                      type="text"
                      id="admin"
                      value={formData.admin || ""}
                      disabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <Label for="adminName">Admin Name</Label>
                    <Input
                      type="text"
                      id="adminName"
                      value={formData.adminName || ""}
                      disabled={true}
                    />
                  </Col>
                </Row>
              </Box>
            </Collapse>
          </Paper>
        </>
      }
    />
  );
};

export default ExitClearanceDetails;
