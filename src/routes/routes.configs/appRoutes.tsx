import { Routes } from "../../@types/routes.dto.ts";
import { lazy } from "react";

const appRoutes: Routes = [
  {
    key: "app-setup",
    path: "/app-setup",
    // component: lazy(() => import('../../pages/settings/AppSetup.tsx')),
    component: lazy(() => import("../../pages/setup/Setup.js")),
  },
  {
    key: "dashboard",
    path: "/dashboard",
    component: lazy(() => import("../../pages/dashboard/Dashboard.tsx")),
  },
  {
    key: "purchase-requisitions",
    path: "/purchase-requisitions",
    component: lazy(
      () => import("../../pages/purchases/PurchaseRequisition.tsx")
    ),
  },

  {
    key: "add-purchase-requisitions",
    path: "/add-purchase-requisition",
    component: lazy(
      () => import("../../pages/purchases/AddPurchaseRequisition.tsx")
    ),
  },
  {
    key: "purchase-requisition-detail",
    path: "/purchase-requisition-details/:id",
    component: lazy(
      () => import("../../pages/purchases/PurchaseRequisitionDetail.tsx")
    ),
  },
  // ---------------------  payment requisitions -----------------------------------------
  {
    key: "payment-requisitions",
    path: "/payment-requisitions",
    component: lazy(() => import("../../pages/payment/PaymentRequisition.tsx")),
  },
  {
    key: "payment-requisitions",
    path: "/add-payment-requisition",
    component: lazy(
      () => import("../../pages/payment/AddPaymentRequisition.tsx")
    ),
  },
  {
    key: "payment-requisition-detail",
    path: "/payment-requisition-details/:id",
    component: lazy(
      () => import("../../pages/payment/PaymentRequisitionDetail.tsx")
    ),
  },

  // ---------------------  travel requisitions -----------------------------------------
  {
    key: "travel-requests",
    path: "/travel-requests",
    component: lazy(() => import("../../pages/travel/TravelRequsts.tsx")),
  },
  {
    key: "add-travel-request",
    path: "/add-travel-request",
    component: lazy(() => import("../../pages/travel/AddTravelRequest.tsx")),
  },
  {
    key: "travel-request-detail",
    path: "/travel-request-details/:id",
    component: lazy(
      () => import("../../pages/travel/TravelRequestDetails.tsx")
    ),
  },

  // ----------------------------- leave -----------------------------------------
  {
    key: "leave-plans",
    path: "/leave-plans",
    component: lazy(() => import("../../pages/leave/LeavePlan.tsx")),
  },
  {
    key: "add-leave-plan",
    path: "/add-leave-plan",
    component: lazy(() => import("../../pages/leave/AddLeavePlan.tsx")),
  },
  {
    key: "leave-plan-details",
    path: "/leave-plan-details/:id",
    component: lazy(() => import("../../pages/leave/LeavePlanDetails.tsx")),
  },

  // ---------------------------  stores --------------------------------
  {
    key: "stores-requests",
    path: "/stores-requests",
    component: lazy(() => import("../../pages/stores/StoresRequisitions.tsx")),
  },
  {
    key: "add-store-request",
    path: "/add-store-request",
    component: lazy(() => import("../../pages/stores/AddStoreRequests.tsx")),
  },
  {
    key: "store-request-details",
    path: "/store-request-details/:id",
    component: lazy(() => import("../../pages/stores/StoreRequestDetail.tsx")),
  },
  {
    key: "approve-store-request",
    path: "/approve-store-request/:documentNo",
    component: lazy(() => import("../../pages/stores/ApproveStoreRequest.tsx")),
  },

  // ------------------------- approval ----------------------------------------
  {
    key: "approvals",
    path: "/approvals",
    component: lazy(() => import("../../pages/approvals/Approval.tsx")),
  },
  {
    key: "approve-purchase-requisition",
    path: "/approve-purchase-requisition/:documentNo",
    component: lazy(
      () => import("../../pages/purchases/ApprovePurchaseRequisition.tsx")
    ),
  },
  {
    key: "approve-payment-requisition",
    path: "/approve-payment-requisition/:documentNo",
    component: lazy(
      () => import("../../pages/payment/ApprovePaymentRequisition.tsx")
    ),
  },
  // ------------------------ HR SECTION ----------------------------------------
  {
    key: "bio-data",
    path: "/bio-data",
    component: lazy(() => import("../../pages/bio-data/BioData.tsx")),
  },

  // ------------------------ Time Sheets ----------------------------------------
  {
    key: "time-sheets",
    path: "/time-sheets",
    component: lazy(() => import("../../pages/time-sheets/TimeSheets.tsx")),
  },
  {
    key: "time-sheet-details",
    path: "/time-sheet-details/:id",
    component: lazy(
      () => import("../../pages/time-sheets/TimeSheetDetails.tsx")
    ),
  },

  {
    key: "approved-time-sheets",
    path: "/approved-time-sheets/:id",
    component: lazy(
      () => import("../../pages/time-sheets/ApproveTimeSheet.tsx")
    ),
  },

  // ------------------------ HR Leave ----------------------------------------
  {
    key: "leave-requests",
    path: "/leave-requests",
    component: lazy(() => import("../../pages/HR/Leave/LeaveRequests.tsx")),
  },
  {
    key: "add-leave-request",
    path: "/add-leave-request",
    component: lazy(() => import("../../pages/HR/Leave/AddLeaveRequest.tsx")),
  },
  {
    key: "leave-request-detail",
    path: "/leave-request-details/:id",
    component: lazy(
      () => import("../../pages/HR/Leave/LeaveRequestDetail.tsx")
    ),
  },
  {
    key: "approve-leave-request",
    path: "/approve-leave-request/:id",
    component: lazy(
      () => import("../../pages/HR/Leave/ApproveLeaveRequest.tsx")
    ),
  },
  {
    key: "approve-leave-plan",
    path: "/approve-leave-plan/:documentNo",
    component: lazy(() => import("../../pages/HR/Leave/ApproveLeavePlan.tsx")),
  },

  {
    key: "leave-calendar",
    path: "/leave-calendar",
    component: lazy(() => import("../../pages/HR/Leave/LeaveCalendarView.tsx")),
  },
  {
    key: "approve-travel-request",
    path: "/approve-travel-request/:documentNo",
    component: lazy(
      () => import("../../pages/travel/ApproveTravelRequest.tsx")
    ),
  },

  // ------------------------ IPA ----------------------------------------
  {
    key: "ipa",
    path: "/individual-performance-appraisal",
    component: lazy(() => import("../../pages/HR/IPA/Ipa.tsx")),
  },
  {
    key: "ipa-details",
    path: "/ipa-details/:id",
    component: lazy(() => import("../../pages/HR/IPA/IPADetails.tsx")),
  },
  {
    key: "add-ipa",
    path: "/add-ipa",
    component: lazy(() => import("../../pages/HR/IPA/AddIPA.tsx")),
  },
  {
    key: "approve-ipa",
    path: "/approve-ipa/:documentNo",
    component: lazy(() => import("../../pages/HR/IPA/ApproveIPA.tsx")),
  },

  // ------------------------ PA ----------------------------------------
  {
    key: "pa",
    path: "/performance-appraisal",
    component: lazy(() => import("../../pages/HR/PA/Pa.tsx")),
  },
  {
    key: "pa-review",
    path: "/performance-appraisal-review",
    component: lazy(() => import("../../pages/HR/PA/PaReview.tsx")),
  },
  {
    key: "pa-details",
    path: "/pa-details/:id",
    component: lazy(() => import("../../pages/HR/PA/PADetails.tsx")),
  },
  // {
  //   key: "add-pa",
  //   path: "/add-pa",
  //   component: lazy(() => import("../../pages/HR/PA/AddPA.tsx")),
  // },
  {
    key: "approve-pa",
    path: "/approve-pa/:documentNo",
    component: lazy(() => import("../../pages/HR/PA/ApprovePA.tsx")),
  },

  // ------------------------ Exit Interview ----------------------------------------
  {
    key: "exit-interviews",
    path: "/exit-interviews",
    component: lazy(() => import("../../pages/HR/Exit/ExitInterviews.tsx")),
  },
  {
    key: "add-exit-interview",
    path: "/add-exit-interview",
    component: lazy(() => import("../../pages/HR/Exit/AddExitInterview.tsx")),
  },
  {
    key: "exit-interview-details",
    path: "/exit-interview-details/:id",
    component: lazy(
      () => import("../../pages/HR/Exit/ExitInterviewDetails.tsx")
    ),
  },
  {
    key: "approve-exit-interview",
    path: "/approve-exit-interview/:id",
    component: lazy(
      () => import("../../pages/HR/Exit/ApproveExitInterview.tsx")
    ),
  },

  // ------------------------ Exit Clearance ----------------------------------------
  {
    key: "exit-clearances",
    path: "/exit-clearance-form",
    component: lazy(
      () => import("../../pages/HR/ExitClearance/ExitClearance.tsx")
    ),
  },
  {
    key: "add-exit-clearance",
    path: "/add-exit-clearance",
    component: lazy(
      () => import("../../pages/HR/ExitClearance/AddExitClearance.tsx")
    ),
  },
  {
    key: "exit-clearance-details",
    path: "/exit-clearance-details/:id",
    component: lazy(
      () => import("../../pages/HR/ExitClearance/ExitClearanceDetails.tsx")
    ),
  },
  // {
  //   key: "approve-exit-clearance",
  //   path: "/approve-exit-clearance/:id",
  //   component: lazy(
  //     () => import("../../pages/HR/exitClearance/ApproveexitClearance.tsx")
  //   ),
  // },
  {
    key: "exit-clearance-form-to-clear",
    path: "/exit-clearance-form-to-clear",
    component: lazy(
      () => import("../../pages/HR/ExitClearance/ExitClearanceFormToClear.tsx")
    ),
  },

  // ------------------------ Training Requests ----------------------------------------
  {
    key: "training-requests",
    path: "/training-requests",
    component: lazy(
      () => import("../../pages/HR/Training/TrainingRequests.tsx")
    ),
  },
  {
    key: "add-training-request",
    path: "/add-training-request",
    component: lazy(
      () => import("../../pages/HR/Training/TrainingRequestForm.tsx")
    ),
  },
  {
    key: "training-request-details",
    path: "/training-request-details/:id",
    component: lazy(
      () => import("../../pages/HR/Training/TrainingRequestDetails.tsx")
    ),
  },
  {
    key: "approve-training-request",
    path: "/approve-training-request/:id",
    component: lazy(
      () => import("../../pages/HR/Training/ApproveTrainingRequest.tsx")
    ),
  },

  // ------------------------ Training Plans ----------------------------------------
  {
    key: "training-plans",
    path: "/training-plans",
    component: lazy(() => import("../../pages/HR/Training/TrainingPlans.tsx")),
  },
  {
    key: "add-training-plan",
    path: "/add-training-plan",
    component: lazy(
      () => import("../../pages/HR/Training/AddTrainingPlan.tsx")
    ),
  },
  {
    key: "training-plan-details",
    path: "/training-plan-details/:id",
    component: lazy(
      () => import("../../pages/HR/Training/TrainingPlanDetails.tsx")
    ),
  },
  {
    key: "approve-training-plan",
    path: "/approve-training-plan/:id",
    component: lazy(
      () => import("../../pages/HR/Training/ApproveTrainingPlan.tsx")
    ),
  },
  // {
  //     key: 'approved-time-sheets',
  //     path: '/approved-time-sheets',
  //     component: lazy(() => import("../../pages/time-sheets/ApprovedTimeSheets.tsx"))
  // }

  // ------------------------ Disciplinary Types ----------------------------------------
  {
    key: "disciplinary-types",
    path: "/disciplinary-types",
    component: lazy(() => import("../../pages/HR/D_&_G/DisciplinaryTypes.tsx")),
  },
  {
    key: "grievance-types",
    path: "/grievance-types",
    component: lazy(() => import("../../pages/HR/D_&_G/GrievanceTypes.tsx")),
  },
  {
    key: "grievance-cases",
    path: "/grievances",
    component: lazy(() => import("../../pages/HR/D_&_G/GrievanceCases.tsx")),
  },
  {
    key: "add-grievance-case",
    path: "/add-grievance-case",
    component: lazy(() => import("../../pages/HR/D_&_G/AddGrievanceCase.tsx")),
  },
  {
    key: "grievance-case-details",
    path: "/grievance-case-details/:systemId",
    component: lazy(
      () => import("../../pages/HR/D_&_G/GrievanceCaseDetails.tsx")
    ),
  },
];

export default appRoutes;
