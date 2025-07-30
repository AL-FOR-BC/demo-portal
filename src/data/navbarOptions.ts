// // import {NavigationTree} from "../@types/ui.dto.ts";

import { NavigationTree } from "../@types/ui.dto.ts";

export const navbarOptions: NavigationTree[] = [
  {
    id: 1,
    name: "Home",
    path: "/dashboard",
    icon: "home",
  },
  {
    id: 2,
    name: "Approvals",
    path: "/approvals",
    icon: "alignJustify",
  },
  {
    id: 3,
    name: "Human Resources",
    path: "/hr",
    icon: "human",
    subOptions: [
      {
        id: 4,
        name: "Bio Data",
        path: "/bio-data",
        // subOptions: [],
      },
      {
        id: 5,
        name: "Orientation",
        path: "/orientation",
        subOptions: [],
      },
      {
        id: 6,
        name: "Leave Management",
        path: "/leave-management",
        subOptions: [
          {
            id: 7,
            name: "Leave Calendar",
            path: "/leave-calendar",
            subOptions: [],
          },
          {
            id: 8,
            name: "Leave Plans",
            path: "/leave-plans",
            subOptions: [],
          },
          {
            id: 9,
            name: "Leave Requests",
            path: "/leave-requests",
            subOptions: [],
          },
          {
            id: 10,
            name: "Posted Leave Requests",
            path: "/posted-leave-requests",
            subOptions: [],
          },
        ],
      },
      {
        id: 11,
        name: "Performance Appraisals",
        path: "/performance-appraisals",
        subOptions: [
          {
            id: 12,
            name: "Individual Performance Appraisal",
            path: "/individual-performance-appraisal",
            subOptions: [],
          },
          {
            id: 13,
            name: "Performance Appraisals",
            path: "/performance-appraisal",
            subOptions: [],
          },
          {
            id: 14,
            name: "Performance Appraisals to Review",
            path: "/performance-appraisal-review",
            subOptions: [],
          },
          {
            id: 15,
            name: "Performance Improvement Plan",
            path: "/performance-improvement-plan",
            subOptions: [],
          },
          {
            id: 16,
            name: "Performance Improvement Plans to Review",
            path: "/performance-improvement-plan-supervisor",
            subOptions: [],
          },
        ],
      },
      {
        id: 17,
        name: "Disciplinary & Grievances",
        path: "/disciplinary-grievances",
        subOptions: [
          {
            id: 18,
            name: "Disciplinary Types",
            path: "/disciplinary-types",
            subOptions: [],
          },
          {
            id: 19,
            name: "Grievance Cases",
            path: "/grievances",
            subOptions: [],
          },
          {
            id: 20,
            name: "Grievance Types",
            path: "/grievance-types",
            subOptions: [],
          },
          {
            id: 21,
            name: "Grievances To Respond To",
            path: "/grievances-to-respond-to",
            subOptions: [],
          },
        ],
      },
      {
        id: 22,
        name: "Training",
        path: "/training",
        subOptions: [
          {
            id: 23,
            name: "Training Needs Assessment",
            path: "/training-needs-assessment",
            subOptions: [],
          },
          {
            id: 24,
            name: "Training Plans",
            path: "/training-plans",
            subOptions: [],
          },
          {
            id: 25,
            name: "Training Requests",
            path: "/training-requests",
            subOptions: [],
          },
          {
            id: 26,
            name: "Training Evaluations",
            path: "/training-evaluations",
            subOptions: [],
          },
          {
            id: 27,
            name: "Training Feedback Forms",
            path: "/training-feedback-forms",
            subOptions: [],
          },
        ],
      },
      {
        id: 28,
        name: "Staff Exit",
        path: "/staff-exit",
        subOptions: [
          {
            id: 29,
            name: "Exit Interview",
            path: "/exit-interview",
            subOptions: [],
          },
          {
            id: 30,
            name: "Exit Interview List",
            path: "/exit-interview-list",
            subOptions: [],
          },
          {
            id: 31,
            name: "Exit Clearance Form",
            path: "/exit-clearance-form",
            subOptions: [],
          },
          {
            id: 32,
            name: "Staff Handover Form",
            path: "/staff-handover-form",
            subOptions: [],
          },
          {
            id: 33,
            name: "Staff Handover Form To Clear",
            path: "/staff-handover-form-to-clear",
            subOptions: [],
          },
        ],
      },
    ],
  },
  {
    id: 34,
    name: "Time Sheets",
    path: "/time-sheets",
    icon: "clock",
    subOptions: [
      {
        id: 35,
        name: "Time Sheets",
        path: "/time-sheets",
      },
    ],
  },
  {
    id: 36,
    name: "Requisition",
    path: "/requisition",
    icon: "cart",
    subOptions: [
      {
        id: 37,
        name: "Purchase Requisition",
        path: "/purchase-requisition",
        subOptions: [
          {
            id: 38,
            name: "Purchase Requisitions",
            path: "/purchase-requisitions",
            subOptions: [],
          },
          {
            id: 39,
            name: "Archived Purchase Requisitions",
            path: "/archived-purchase-requisitions",
            subOptions: [],
          },
        ],
      },
      {
        id: 40,
        name: "Payment Requisition",
        path: "/payment-requisitions",
        // subOptions: [],
      },
      {
        id: 41,
        name: "Stores Requests",
        path: "/stores-requests",
        // subOptions: [],
      },
    ],
  },
  {
    id: 41,
    name: "Travel Requests",
    path: "/travel-requests",
    icon: "train",
    subOptions: [
      {
        id: 42,
        name: "Travel Requests",
        path: "/travel-requests",
        // subOptions: []
      },
      {
        id: 43,
        name: "Archived Travel Requests",
        path: "/archived-travel-requests",
        // subOptions: []
      },
    ],
  },
  {
    id: 44,
    name: "Accountability",
    path: "/accountability",
    icon: "accountCheck",
    subOptions: [
      {
        id: 45,
        name: "Imprest Pending Accountability",
        path: "/imprest-pending-accountability",
        subOptions: [],
      },
      {
        id: 46,
        name: "Accountability List",
        path: "/accountability-list",
        subOptions: [],
      },
    ],
  },
];
