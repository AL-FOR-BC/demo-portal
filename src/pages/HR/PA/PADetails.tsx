import HeaderMui from "../../../Components/ui/Header/HeaderMui";
import { usePA } from "./hooks/usePA";
import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useAppSelector } from "../../../store/hook";
import { apiPALInes } from "../../../services/PaServices";

import PerformanceAppraisalLines from "../../../Components/ui/Lines/PerformanceAppraisalLines";
import { Collapse, Paper, Box, IconButton, Button } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import ModelMui from "../../../Components/ui/ModelMui/ModelMui";
import React from "react";
import { useAspirations } from "./hooks/useAspirations";
import { useQuestionQ1 } from "./hooks/useQuestionQ1";
import { useQuestionQ2 } from "./hooks/useQuestionQ2";
import { useQuestionQ3 } from "./hooks/useQuestionQ3";
import { useMobilityPreference } from "./hooks/useMobilityPreference";
import { useLanguageSkills } from "./hooks/useLanguageSkills";
import { useCareerMoveOptions } from "./hooks/useCareerMoveOptions";
import { useSkillsWorkCompetencyAreas } from "./hooks/useSkillsWorkCompetencyAreas";
import { useBehaviorsPersonalStyle } from "./hooks/useBehaviorsPersonalStyle";
import { updateQuestionQ1 } from "../../../services/QuestionQ1Service";
import {
  updateQuestionQ2,
  createQuestionQ2,
} from "../../../services/QuestionQ2Service";
import {
  updateAspirations,
  createAspirations,
} from "../../../services/AspirationsService";
import {
  updateQuestionQ3,
  createQuestionQ3,
} from "../../../services/QuestionQ3Service";
import { updateMobilityPreference } from "../../../services/MobilityPreferenceService";
import {
  updateLanguageSkills,
  createLanguageSkills,
} from "../../../services/LanguageSkillsService";
import {
  updateCareerMoveOptions,
  createCareerMoveOptions,
} from "../../../services/CareerMoveOptionsService";
import { updateSkillsWorkCompetencyAreas } from "../../../services/SkillsWorkCompetencyAreasService";
import { updateBehaviorsPersonalStyle } from "../../../services/BehaviorsPersonalStyleService";
import SectionHeader from "../../../Components/ui/SectionHeader";
import { getErrorMessage } from "../../../utils/common";

function PADetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const [currentUser, setCurrentUser] = useState<"Appraisee" | "Appraiser">(
    "Appraisee"
  );
  const {
    formData,
    getFormFields,
    populateDocumentDetail,
    lines,
    deletePA,
    sendPAForApproval,
    sendToAppraiser,
    cancelPAApprovalRequest,
  } = usePA({ mode: "detail" });

  useEffect(() => {
    const currentUser =
      formData.appraiser === employeeNo ? "Appraiser" : "Appraisee";
    setCurrentUser(currentUser);
  }, [formData.stage]);
  console.log("formData", formData);
  console.log("currentUser", currentUser);
  const columns =
    "Open" == "Open"
      ? [
          {
            dataField: "jobObjective",
            text: "Job Objective",
            sort: true,
          },
          {
            dataField: "keyPerformanceIndicator",
            text: "Key Performance Indicator(s)",
            sort: true,
          },
          {
            dataField: "measuresDeliverables",
            text: "Measures/Deliverables",
            sort: true,
          },
          {
            dataField: "byWhichTargetDate",
            text: "By which Target Date?",
            sort: true,
          },
          {
            dataField: "limitingFactor",
            text: "What has been your limiting Factor(s)",
            sort: true,
          },
          {
            dataField: "enhancedPerformance",
            text: "Suggestion for future enhanced Performance",
            sort: true,
          },
          {
            dataField: "appraiseeRating",
            text: "Appraisee Rating",
            sort: true,
          },
          {
            dataField: "appraiseeScore",
            text: "Appraisee Score",
            sort: true,
          },
          {
            dataField: "appraiserRating",
            text: "Appraiser Rating",
            sort: true,
          },
          {
            dataField: "agreedScore",
            text: "Agreed Score",
            sort: true,
          },
          formData.status === "Open" && {
            dataField: "action",
            isDummyField: true,
            text: "Action",
            formatter: (cellContent, row) => (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click event
                  handleEditClick(row, "paLines");
                }}
              >
                <EditIcon fontSize="small" sx={{ color: "#1976d2" }} />
              </IconButton>
            ),
          },
        ]
      : [
          {
            dataField: "jobObjective",
            text: "Job Objective",
            sort: true,
          },
          {
            dataField: "keyPerformanceIndicator",
            text: "Key Performance Indicator(s)",
            sort: true,
          },
          {
            dataField: "measuresDeliverables",
            text: "Measures/Deliverables",
            sort: true,
          },
          {
            dataField: "byWhichTargetDate",
            text: "By which Target Date?",
            sort: true,
          },
          {
            dataField: "limitingFactor",
            text: "What has been your limiting Factor(s)",
            sort: true,
          },
          {
            dataField: "enhancedPerformance",
            text: "Suggestion for future enhanced Performance",
            sort: true,
          },
          {
            dataField: "appraiseeRating",
            text: "Appraisee Rating",
            sort: true,
          },
          {
            dataField: "appraiseeScore",
            text: "Appraisee Score",
            sort: true,
          },
          {
            dataField: "appraiserRating",
            text: "Appraiser Rating",
            sort: true,
          },
          {
            dataField: "agreedScore",
            text: "Agreed Score",
            sort: true,
          },
        ];

  const handleDeleteLine = async () => {
    console.log("Delete Line");
  };

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalFields, setModalFields] = React.useState<any[]>([]);
  const [editRow, setEditRow] = React.useState<any | null>(null);
  const [editData, setEditData] = React.useState<any>({});
  const [modalTitle, setModalTitle] = React.useState("");
  const [modalMode, setModalMode] = React.useState("");
  const [isAddMode, setIsAddMode] = React.useState(false);
  const { employeeNo } = useAppSelector((state) => state.auth.user);

  const handleEditClick = (row: any, sectionType: string) => {
    setEditRow(row);
    setEditData({ ...row });
    setModalMode(sectionType);
    setIsAddMode(false);

    // Prepare fields based on section type
    let fields: any[] = [];

    switch (sectionType) {
      case "questionQ1":
        setModalTitle("Edit Question Q1");
        fields = [
          {
            label: "Question",
            type: "text",
            value: row.question || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("question", newValue);
            },
            id: "question",
            disabled: true,
          },
          {
            label: "Description",
            type: "textarea",
            value: row.description || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("description", newValue);
            },
            id: "description",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            rows: 4,
          },
        ];
        break;
      case "questionQ2":
        setModalTitle("Edit Question Q2");
        fields = [
          {
            label: "Question",
            type: "text",
            value: row.question || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("question", newValue);
            },
            id: "question",
            disabled: true,
          },
          {
            label: "Element",
            type: "text",
            value: row.element || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("element", newValue);
            },
            id: "element",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
          },
          {
            label: "What Do You Think Causes The Difficulty",
            type: "textarea",
            value: row.whatDoYouThinkCausesTheDifficulty || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("whatDoYouThinkCausesTheDifficulty", newValue);
            },
            id: "whatDoYouThinkCausesTheDifficulty",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            rows: 3,
          },
        ];
        break;
      case "aspirations":
        setModalTitle("Edit Aspirations");
        fields = [
          {
            label: "Aspirations Type",
            type: "text",
            value: row.aspirationsType || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("aspirationsType", newValue);
            },
            id: "aspirationsType",
            disabled: false,
          },
          {
            label: "Description",
            type: "textarea",
            value: row.description || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("description", newValue);
            },
            id: "description",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            rows: 3,
          },
          {
            label: "By When",
            type: "date",
            value: row.byWhen || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("byWhen", newValue);
            },
            id: "byWhen",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
          },
        ];
        break;
      case "questionQ3":
        setModalTitle("Edit Question Q3");
        fields = [
          {
            label: "Question",
            type: "text",
            value: row.question || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("question", newValue);
            },
            id: "question",
            disabled: true,
          },
          {
            label: "Aim",
            type: "text",
            value: row.aim || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("aim", newValue);
            },
            id: "aim",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
          },
          {
            label: "Tasks",
            type: "textarea",
            value: row.tasks || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("tasks", newValue);
            },
            id: "tasks",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            rows: 3,
          },
          {
            label: "Why Important",
            type: "textarea",
            value: row.whyImportant || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("whyImportant", newValue);
            },
            id: "whyImportant",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            rows: 3,
          },
        ];
        break;
      case "mobilityPreference":
        setModalTitle("Edit Mobility Preference");
        fields = [
          {
            label: "Mobility",
            type: "text",
            value: row.mobility || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("mobility", newValue);
            },
            id: "mobility",
            disabled: true,
          },
          {
            label: "Comments",
            type: "textarea",
            value: row.comments || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("comments", newValue);
            },
            id: "comments",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            rows: 3,
          },
        ];
        break;
      case "languageSkills":
        setModalTitle("Edit Language Skills");
        fields = [
          {
            label: "Language",
            type: "text",
            value: row.language || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("language", newValue);
            },
            id: "language",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
          },
          {
            label: "Proficiency",
            type: "text",
            value: row.proficiency || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("proficiency", newValue);
            },
            id: "proficiency",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
          },
        ];
        break;
      case "careerMoveOptions":
        setModalTitle("Edit Career Move Options");
        fields = [
          {
            label: "Option",
            type: "textarea",
            rows: 3,
            value: row.option || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("option", newValue);
            },
            id: "option",
            disabled: false,
          },
          {
            label: "Possible Timing",
            type: "textarea",
            rows: 3,
            value: row.possibleTiming || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("possibleTiming", newValue);
            },
            id: "possibleTiming",
            disabled: false,
          },
        ];
        break;
      case "skillsWorkCompetencyAreas":
        setModalTitle("Edit Skills & Work Competency Areas");
        fields = [
          {
            label: "Description",
            type: "textarea",
            value: row.description || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("description", newValue);
            },
            id: "description",
            disabled: true,
            rows: 3,
          },
          {
            label: "Essential/Desirable",
            type: "select",
            value: row.essentialOrDesirable
              ? {
                  value: row.essentialOrDesirable,
                  label: row.essentialOrDesirable,
                }
              : "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("essentialOrDesirable", newValue);
            },
            id: "essentialOrDesirable",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            options: [
              {
                value: "Essential",
                label: "Essential",
              },
              {
                value: "Desirable",
                label: "Desirable",
              },
            ],
          },
          {
            label: "Self Assess",
            type: "number",
            value: row.selfAssess || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              if (Number(newValue) > 10 || Number(newValue) < 0) {
                return;
              }
              handleEditChange("selfAssess", newValue);
            },
            id: "selfAssess",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            inputProps: {
              max: 10,
              min: 0,
            },
          },
          {
            label: "Second View",
            type: "number",
            value: row.secondView || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              if (Number(newValue) > 10 || Number(newValue) < 0) {
                return;
              }
              handleEditChange("secondView", newValue);
            },
            id: "secondView",
            disabled:
              formData.stage === "Appraiser Rating" &&
              currentUser === "Appraisee",
            inputProps: {
              max: 10,
              min: 0,
            },
          },
          {
            label: "ED",
            type: "select",
            value: row.ed
              ? {
                  value: row.ed,
                  label: row.ed,
                }
              : "",
            onChange: (e: any) => {
              const newValue = e?.value || e;
              handleEditChange("ed", newValue);
            },
            id: "ed",
            disabled:
              formData.stage === "Appraiser Rating" &&
              currentUser === "Appraisee",
            options: [
              {
                value: "Essential",
                label: "Essential",
              },
              {
                value: "Desirable",
                label: "Desirable",
              },
            ],
          },
        ];
        break;
      case "behaviorsPersonalStyle":
        setModalTitle("Edit Behaviors and Personal Style");
        fields = [
          {
            label: "Description",
            type: "textarea",
            value: row.description || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("description", newValue);
            },
            id: "description",
            disabled: false,
            rows: 3,
          },
          {
            label: "Essential/Desirable",
            type: "select",
            value: row.essentialOrDesirable
              ? {
                  value: row.essentialOrDesirable,
                  label: row.essentialOrDesirable,
                }
              : "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("essentialOrDesirable", newValue);
            },
            id: "essentialOrDesirable",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            options: [
              {
                value: "Essential",
                label: "Essential",
              },
              {
                value: "Desirable",
                label: "Desirable",
              },
            ],
          },
          {
            label: "Self Assess",
            type: "number",
            value: row.selfAssess || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              if (Number(newValue) > 10 || Number(newValue) < 0) {
                return;
              }
              handleEditChange("selfAssess", newValue);
            },
            id: "selfAssess",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            inputProps: {
              max: 10,
              min: 0,
            },
          },
          {
            label: "Second View",
            type: "number",
            value: row.secondView || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              if (Number(newValue) > 10 || Number(newValue) < 0) {
                return;
              }
              handleEditChange("secondView", newValue);
            },
            id: "secondView",
            disabled:
              formData.stage === "Appraiser Rating" &&
              currentUser === "Appraisee",
            inputProps: {
              max: 10,
              min: 0,
            },
          },
          {
            label: "ED",
            type: "select",
            value: row.ed
              ? {
                  value: row.ed,
                  label: row.ed,
                }
              : "",
            onChange: (e: any) => {
              const newValue = e?.value || e;
              handleEditChange("ed", newValue);
            },
            id: "ed",
            disabled:
              formData.stage === "Appraiser Rating" &&
              currentUser === "Appraisee",
            options: [
              {
                value: "Essential",
                label: "Essential",
              },
              {
                value: "Desirable",
                label: "Desirable",
              },
            ],
          },
        ];
        break;
      case "paLines":
        setModalTitle("Edit Performance Appraisal Line");
        fields = [
          {
            label: "Job Objective",
            type: "text",
            value: row.jobObjective || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("jobObjective", newValue);
            },
            id: "jobObjective",
            disabled: true,
          },
          {
            label: "Key Performance Indicator(s)",
            type: "textarea",
            value: row.keyPerformanceIndicator || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("keyPerformanceIndicator", newValue);
            },
            id: "keyPerformanceIndicator",
            disabled: true,
            rows: 3,
          },
          {
            label: "Measures/Deliverables",
            type: "textarea",
            value: row.measuresDeliverables || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("measuresDeliverables", newValue);
            },
            id: "measuresDeliverables",
            disabled: true,
            rows: 3,
          },
          {
            label: "By which Target Date?",
            type: "date",
            value: row.byWhichTargetDate || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("byWhichTargetDate", newValue);
            },
            id: "byWhichTargetDate",
            disabled: true,
          },
          {
            label: "What has been your limiting Factor(s)",
            type: "textarea",
            value: row.limitingFactor || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("limitingFactor", newValue);
            },
            id: "limitingFactor",
            disabled: formData.stage === "Appraiser Rating",
            rows: 3,
          },
          {
            label: "Suggestion for future enhanced Performance",
            type: "textarea",
            value: row.enhancedPerformance || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("enhancedPerformance", newValue);
            },
            id: "enhancedPerformance",
            disabled: formData.stage === "Appraiser Rating",
            rows: 3,
          },
          {
            label: "Appraisee Rating",
            type: "text",
            inputProps: {
              max: 4,
              min: 1,
            },
            value: row.appraiseeRating || "",
            onChange: (e: any) => {
              if (Number(e.target.value) > 4 || Number(e.target.value) < 0) {
                return;
              }
              const newValue = e.target ? e.target.value : e;
              handleEditChange("appraiseeRating", newValue);
            },
            id: "appraiseeRating",
            disabled:
              (formData.stage === "Appraiser Rating" &&
                currentUser === "Appraiser") ||
              (formData.stage === "Appraiser Rating" &&
                currentUser === "Appraisee"),
          },
          {
            label: "Appraisee Score",
            type: "number",
            max: 4,
            min: 1,
            value: row.appraiseeScore || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("appraiseeScore", newValue);
            },
            id: "appraiseeScore",
            disabled: true,
          },
          {
            label: "Appraiser Rating",
            type: "text",
            value: row.appraiserRating || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("appraiserRating", newValue);
            },
            id: "appraiserRating",
            disabled: currentUser === "Appraisee",
          },
          {
            label: "Agreed Score",
            type: "number",
            value: row.agreedScore || "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("agreedScore", newValue);
            },
            id: "agreedScore",
            disabled: true,
          },
        ];
        break;
      default:
        setModalTitle("Edit Line");
        fields = [];
    }

    setModalFields([fields]);
    setModalOpen(true);
  };

  const handleAddNew = (sectionType: string) => {
    setEditRow(null);
    setEditData({});
    setModalMode(sectionType);
    setIsAddMode(true);

    // Prepare fields based on section type for adding new items
    let fields: any[] = [];

    switch (sectionType) {
      case "questionQ2":
        setModalTitle("Add New Question Q2");
        fields = [
          {
            label: "Question",
            type: "select",
            value: "",
            onChange: (e: any) => {
              const newValue = e?.value || e;
              handleEditChange("question", newValue);
            },
            id: "question",
            disabled: false,
            options: [
              {
                value: "What elements of your job do you find most difficult?",
                label: "What elements of your job do you find most difficult?",
              },
            ],
          },
          {
            label: "Element",
            type: "text",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("element", newValue);
            },
            id: "element",
            disabled: false,
          },
          {
            label: "What Do You Think Causes The Difficulty",
            type: "textarea",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("whatDoYouThinkCausesTheDifficulty", newValue);
            },
            id: "whatDoYouThinkCausesTheDifficulty",
            disabled: false,
            rows: 3,
          },
        ];
        break;
      case "aspirations":
        setModalTitle("Add New Aspiration");
        fields = [
          {
            label: "Aspirations Type",
            type: "select",
            value: "",
            onChange: (e: any) => {
              const newValue = e?.value || e;
              handleEditChange("aspirationsType", newValue);
            },
            id: "aspirationsType",
            disabled: false,
            options: [
              {
                value: "Personal",
                label: "Personal",
              },
              {
                value: "Career",
                label: "Career",
              },
            ],
          },
          {
            label: "Description",
            type: "textarea",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("description", newValue);
            },
            id: "description",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
            rows: 3,
          },
          {
            label: "By When",
            type: "date",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("byWhen", newValue);
            },
            id: "byWhen",
            disabled: formData.stage === "Appraisee Rating" ? false : true,
          },
        ];
        break;
      case "questionQ3":
        setModalTitle("Add New Question Q3");
        fields = [
          {
            label: "Question",
            type: "select",
            value: "",
            onChange: (e: any) => {
              const newValue = e?.value || e;
              handleEditChange("question", newValue);
            },
            id: "question",
            disabled: false,
            options: [
              {
                value:
                  "What do you consider to be your most important aims and tasks in the next year?",
                label:
                  "What do you consider to be your most important aims and tasks in the next year?",
              },
            ],
          },
          {
            label: "Aim",
            type: "text",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("aim", newValue);
            },
            id: "aim",
            disabled: false,
          },
          {
            label: "Tasks",
            type: "textarea",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("tasks", newValue);
            },
            id: "tasks",
            disabled: false,
            rows: 3,
          },
          {
            label: "Why Important",
            type: "textarea",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("whyImportant", newValue);
            },
            id: "whyImportant",
            disabled: false,
            rows: 3,
          },
        ];
        break;
      case "languageSkills":
        setModalTitle("Add New Language Skill");
        fields = [
          {
            label: "Language",
            type: "text",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("language", newValue);
            },
            id: "language",
            disabled: false,
          },
          {
            label: "Proficiency",
            type: "text",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("proficiency", newValue);
            },
            id: "proficiency",
            disabled: false,
          },
        ];
        break;
      case "careerMoveOptions":
        setModalTitle("Add New Career Move Option");
        fields = [
          {
            label: "Option",
            type: "text",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("option", newValue);
            },
            id: "option",
            disabled: false,
          },
          {
            label: "Possible Timing",
            type: "text",
            value: "",
            onChange: (e: any) => {
              const newValue = e.target ? e.target.value : e;
              handleEditChange("possibleTiming", newValue);
            },
            id: "possibleTiming",
            disabled: false,
          },
        ];
        break;
      default:
        setModalTitle("Add New Item");
        fields = [];
    }

    setModalFields([fields]);
    setModalOpen(true);
  };

  const handleEditChange = (fieldName: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [fieldName]: value }));

    // Update modalFields to reflect the change
    setModalFields((prev) =>
      prev.map((row) =>
        row.map((field: any) => {
          if (field.id === fieldName) {
            // For select fields, update the value to the proper format
            if (field.type === "select") {
              return {
                ...field,
                value: value
                  ? {
                      value: value,
                      label: value,
                    }
                  : "",
              };
            }
            return { ...field, value };
          }
          return field;
        })
      )
    );
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditRow(null);
    setEditData({});
    setModalFields([]);
  };

  const handleModalSubmit = async () => {
    try {
      if (isAddMode) {
        // Handle adding new items
        let response;

        // Process the data to extract values from select fields
        const processedData = { ...editData };

        // Extract values from select fields (objects with value property) and handle date arrays
        Object.keys(processedData).forEach((key) => {
          if (
            processedData[key] &&
            typeof processedData[key] === "object" &&
            processedData[key].value
          ) {
            processedData[key] = processedData[key].value;
          }
          // Handle date arrays (Flatpickr returns arrays)
          if (
            Array.isArray(processedData[key]) &&
            processedData[key].length > 0
          ) {
            // Convert ISO date string to YYYY-MM-DD format for Edm.Date
            const dateValue = processedData[key][0];
            if (typeof dateValue === "string" && dateValue.includes("T")) {
              processedData[key] = dateValue.split("T")[0];
            } else if (dateValue instanceof Date) {
              // Handle Date objects
              processedData[key] = dateValue.toISOString().split("T")[0];
            } else {
              processedData[key] = dateValue;
            }
          }
          // Handle direct date strings (in case they're not in arrays)
          if (
            typeof processedData[key] === "string" &&
            processedData[key].includes("T") &&
            processedData[key].includes("Z")
          ) {
            processedData[key] = processedData[key].split("T")[0];
          }
          // Handle direct Date objects (in case they're not in arrays)
          if (processedData[key] instanceof Date) {
            processedData[key] = processedData[key].toISOString().split("T")[0];
          }
        });

        // Add documentNo to the data
        const dataWithDocumentNo = {
          ...processedData,
          documentNo: formData.no,
        };

        switch (modalMode) {
          case "questionQ2":
            response = await createQuestionQ2(companyId, dataWithDocumentNo);
            break;
          case "aspirations":
            response = await createAspirations(companyId, dataWithDocumentNo);
            break;
          case "questionQ3":
            response = await createQuestionQ3(companyId, dataWithDocumentNo);
            break;
          case "languageSkills":
            response = await createLanguageSkills(
              companyId,
              dataWithDocumentNo
            );
            break;
          case "careerMoveOptions":
            response = await createCareerMoveOptions(
              companyId,
              dataWithDocumentNo
            );
            break;
          default:
            toast.error("Unknown section type for adding");
            return;
        }

        if (response?.status === 201 || response?.status === 200) {
          toast.success("Item added successfully");
          // Refresh the data
          if (id) {
            populateDocumentDetail(id);
          }
          // Refresh specific section data
          switch (modalMode) {
            case "questionQ2":
              refreshQuestionQ2();
              break;
            case "aspirations":
              refreshAspirations();
              break;
            case "questionQ3":
              refreshQuestionQ3();
              break;
            case "languageSkills":
              refreshLanguageSkills();
              break;
            case "careerMoveOptions":
              refreshCareerMoveOptions();
              break;
          }
          handleModalClose();
        } else {
          toast.error("Failed to add item");
        }
        return;
      }

      if (!editRow?.systemId) {
        toast.error("No record selected for update");
        return;
      }

      // Process the data for updates (same as add mode)
      const processedEditData = { ...editData };

      // Extract values from select fields (objects with value property) and handle date arrays
      Object.keys(processedEditData).forEach((key) => {
        if (
          processedEditData[key] &&
          typeof processedEditData[key] === "object" &&
          processedEditData[key].value
        ) {
          processedEditData[key] = processedEditData[key].value;
        }
        // Handle date arrays (Flatpickr returns arrays)
        if (
          Array.isArray(processedEditData[key]) &&
          processedEditData[key].length > 0
        ) {
          // Convert ISO date string to YYYY-MM-DD format for Edm.Date
          const dateValue = processedEditData[key][0];
          if (typeof dateValue === "string" && dateValue.includes("T")) {
            processedEditData[key] = dateValue.split("T")[0];
          } else if (dateValue instanceof Date) {
            // Handle Date objects
            processedEditData[key] = dateValue.toISOString().split("T")[0];
          } else {
            processedEditData[key] = dateValue;
          }
        }
        // Handle direct date strings (in case they're not in arrays)
        if (
          typeof processedEditData[key] === "string" &&
          processedEditData[key].includes("T") &&
          processedEditData[key].includes("Z")
        ) {
          processedEditData[key] = processedEditData[key].split("T")[0];
        }
        // Handle direct Date objects (in case they're not in arrays)
        if (processedEditData[key] instanceof Date) {
          processedEditData[key] = processedEditData[key]
            .toISOString()
            .split("T")[0];
        }
      });

      let response;

      // Call the appropriate update service based on modal mode
      switch (modalMode) {
        case "paLines":
          // Submit different fields based on the stage
          let paLineData;

          if (formData.stage === "Appraisee Rating") {
            // For Appraisee Rating stage, submit only these fields
            paLineData = {
              enhancedPerformance: editData.enhancedPerformance,
              limitingFactor: editData.limitingFactor,
              appraiseeRating: editData.appraiseeRating,
            };
          } else if (formData.stage === "Appraiser Rating") {
            // For Appraiser Rating stage, submit only these fields
            paLineData = {
              appraiserRating: Number(editData.appraiserRating),
              // agreedScore: editData.agreedScore,
            };
          } else {
            // Default case - submit all editable fields
            paLineData = {
              enhancedPerformance: editData.enhancedPerformance,
              limitingFactor: editData.limitingFactor,
              appraiseeRating: editData.appraiseeRating,
              appraiserRating: editData.appraiserRating,
              agreedScore: editData.agreedScore,
            };
          }

          response = await apiPALInes(
            companyId,
            "PATCH",
            paLineData,
            editRow.systemId,
            editRow["@odata.etag"]
          );
          break;
        case "questionQ1":
          response = await updateQuestionQ1(
            companyId,
            editRow.systemId,
            processedEditData
          );
          break;
        case "questionQ2":
          response = await updateQuestionQ2(
            companyId,
            editRow.systemId,
            processedEditData
          );
          break;
        case "aspirations":
          response = await updateAspirations(
            companyId,
            editRow.systemId,
            processedEditData
          );
          break;
        case "questionQ3":
          response = await updateQuestionQ3(
            companyId,
            editRow.systemId,
            processedEditData
          );
          break;
        case "mobilityPreference":
          response = await updateMobilityPreference(
            companyId,
            editRow.systemId,
            processedEditData
          );
          break;
        case "languageSkills":
          response = await updateLanguageSkills(
            companyId,
            editRow.systemId,
            processedEditData
          );
          break;
        case "careerMoveOptions":
          response = await updateCareerMoveOptions(
            companyId,
            editRow.systemId,
            processedEditData
          );
          break;
        case "skillsWorkCompetencyAreas":
          let skillsWorkCompetencyAreasData;

          if (formData.stage === "Appraisee Rating") {
            skillsWorkCompetencyAreasData = {
              competencyArea: processedEditData.competencyArea,
              competencyAreaDescription:
                processedEditData.competencyAreaDescription,
            };
          } else if (formData.stage === "Appraiser Rating") {
            skillsWorkCompetencyAreasData = {
              competencyArea: processedEditData.competencyArea,
              competencyAreaDescription:
                processedEditData.competencyAreaDescription,
            };
          } else {
            skillsWorkCompetencyAreasData = {
              competencyArea: processedEditData.competencyArea,
              competencyAreaDescription:
                processedEditData.competencyAreaDescription,
            };
          }

          response = await updateSkillsWorkCompetencyAreas(
            companyId,
            editRow.systemId,
            processedEditData
          );
          break;
        case "behaviorsPersonalStyle":
          response = await updateBehaviorsPersonalStyle(
            companyId,
            editRow.systemId,
            processedEditData
          );
          break;
        default:
          toast.error("Unknown section type");
          return;
      }

      if (response?.status === 200) {
        toast.success("Data updated successfully");
        // Refresh the data
        if (id) {
          populateDocumentDetail(id);
        }
        // Refresh specific section data
        switch (modalMode) {
          case "questionQ1":
            refreshQuestionQ1();
            break;
          case "questionQ2":
            refreshQuestionQ2();
            break;
          case "aspirations":
            refreshAspirations();
            break;
          case "questionQ3":
            refreshQuestionQ3();
            break;
          case "mobilityPreference":
            refreshMobilityPreference();
            break;
          case "languageSkills":
            refreshLanguageSkills();
            break;
          case "careerMoveOptions":
            refreshCareerMoveOptions();
            break;
          case "skillsWorkCompetencyAreas":
            refreshSkillsWorkCompetencyAreas();
            break;
          case "behaviorsPersonalStyle":
            refreshBehaviorsPersonalStyle();
            break;
        }
        handleModalClose();
      } else {
        toast.error("Failed to update data");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(`Error updating data: ${errorMessage}`);
    }
  };

  const [showPALines, setShowPALines] = React.useState(true);
  const [showQuestionQ1, setShowQuestionQ1] = React.useState(true);
  const [showQuestionQ2, setShowQuestionQ2] = React.useState(true);
  const [showAspirations, setShowAspirations] = React.useState(true);
  const {
    data: aspirationsData,
    loading: loadingAspirations,
    refresh: refreshAspirations,
  } = useAspirations(companyId, formData.no);
  const { data: questionQ1Data, refresh: refreshQuestionQ1 } = useQuestionQ1(
    companyId,
    formData.no
  );

  const { data: questionQ2Data, refresh: refreshQuestionQ2 } = useQuestionQ2(
    companyId,
    formData.no
  );

  const [showQuestionQ3, setShowQuestionQ3] = React.useState(true);
  const [showMobilityPreference, setShowMobilityPreference] =
    React.useState(true);
  const [showLanguageSkills, setShowLanguageSkills] = React.useState(true);
  const [showCareerMoveOptions, setShowCareerMoveOptions] =
    React.useState(true);
  const [showSkillsWorkCompetencyAreas, setShowSkillsWorkCompetencyAreas] =
    React.useState(true);
  const [showBehaviorsPersonalStyle, setShowBehaviorsPersonalStyle] =
    React.useState(true);

  const { data: questionQ3Data, refresh: refreshQuestionQ3 } = useQuestionQ3(
    companyId,
    formData.no
  );
  const { data: mobilityPreferenceData, refresh: refreshMobilityPreference } =
    useMobilityPreference(companyId, formData.no);
  const { data: languageSkillsData, refresh: refreshLanguageSkills } =
    useLanguageSkills(companyId, formData.no);
  const { data: careerMoveOptionsData, refresh: refreshCareerMoveOptions } =
    useCareerMoveOptions(companyId, formData.no);
  const {
    data: skillsWorkCompetencyAreasData,
    refresh: refreshSkillsWorkCompetencyAreas,
  } = useSkillsWorkCompetencyAreas(companyId, formData.no);
  const {
    data: behaviorsPersonalStyleData,
    refresh: refreshBehaviorsPersonalStyle,
  } = useBehaviorsPersonalStyle(companyId, formData.no);

  useEffect(() => {
    if (id) {
      populateDocumentDetail(id);
    }
  }, [id]);

  return (
    <>
      <HeaderMui
        title="PA Details"
        subtitle="Performance Appraisal"
        breadcrumbItem="Performance Appraisal"
        handleBack={() => navigate("/performance-appraisal")}
        handleSubmit={() => {}}
        status={formData.status}
        stage={formData.stage}
        currentUser={
          formData.appraiser === employeeNo ? "Appraiser" : "Appraisee"
        }
        isLoading={false}
        tableId={50452}
        companyId={companyId}
        requestNo={formData.no || ""}
        documentType="Performance Management"
        pageType="detail"
        fields={getFormFields()}
        handleDeletePurchaseRequisition={() => {
          if (id) {
            deletePA(id);
          }
        }}
        handleSendApprovalRequest={() => {
          if (id) {
            sendPAForApproval(id);
          }
        }}
        handleCancelApprovalRequest={() => {
          if (id) {
            cancelPAApprovalRequest(id);
          }
        }}
        handleSendToAppraiser={() => {
          if (id) {
            sendToAppraiser(id);
          }
        }}
        lines={
          <>
            {/* <Lines
                documentName="Question Q2"
                title="Question Q2"
                subTitle="SECTION D: QUESTION:Q(2)"
                breadcrumbItem="Question Q2"
                addLabel=""
                iconClassName=""
                noDataMessage="No Question Q2 found"
                clearLineFields={() => {}}
                handleValidateHeaderFields={() => true}
                data={[]}
                multipleLines={true}
              /> */}

            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section C: Performance Appraisal Lines"
                open={showPALines}
                onToggle={() => setShowPALines((prev) => !prev)}
              />
              <Collapse in={showPALines}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={
                      lines.map((line) => ({
                        ...line,
                        // documentType: "Performance Appraisal",
                      })) as any
                    }
                    columns={columns
                      .filter(
                        (col) =>
                          col && typeof col === "object" && "dataField" in col
                      )
                      .map(({ dataField, text, sort, formatter }) => ({
                        dataField,
                        text,
                        sort,
                        formatter,
                      }))}
                    status={formData.status || ""}
                  />
                </Box>
              </Collapse>
            </Paper>
            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section D: Question:Q(1)"
                open={showQuestionQ1}
                onToggle={() => setShowQuestionQ1((prev) => !prev)}
              />
              <Collapse in={showQuestionQ1}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={questionQ1Data}
                    columns={[
                      { dataField: "question", text: "Question", sort: true },
                      {
                        dataField: "description",
                        text: "Description",
                        sort: true,
                      },
                      {
                        dataField: "action",
                        text: "Action",
                        formatter: (cellContent: any, row: any) => (
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(row, "questionQ1")}
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#1976d2" }}
                            />
                          </IconButton>
                        ),
                      },
                    ]}
                    status={formData.status || ""}
                    mode="questionQ1"
                  />
                </Box>
              </Collapse>
            </Paper>
            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 4,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section E: Question:Q(2)"
                open={showQuestionQ2}
                onToggle={() => setShowQuestionQ2((prev) => !prev)}
                action={
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAddNew("questionQ2")}
                    sx={{ mr: 1 }}
                  >
                    Add New
                  </Button>
                }
              />
              <Collapse in={showQuestionQ2}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={questionQ2Data}
                    columns={[
                      { dataField: "question", text: "Question", sort: true },
                      { dataField: "element", text: "Element", sort: true },
                      {
                        dataField: "whatDoYouThinkCausesTheDifficulty",
                        text: "What Do You Think Causes The Difficulty",
                        sort: true,
                      },
                      {
                        dataField: "action",
                        text: "Action",
                        formatter: (cellContent: any, row: any) => (
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(row, "questionQ2")}
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#1976d2" }}
                            />
                          </IconButton>
                        ),
                      },
                    ]}
                    status={formData.status || ""}
                    mode="questionQ2"
                  />
                </Box>
              </Collapse>
            </Paper>
            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section F: Question:Q(3)"
                open={showQuestionQ3}
                onToggle={() => setShowQuestionQ3((prev) => !prev)}
                action={
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAddNew("questionQ3")}
                    sx={{ mr: 1 }}
                  >
                    Add New
                  </Button>
                }
              />
              <Collapse in={showQuestionQ3}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={questionQ3Data}
                    columns={[
                      { dataField: "question", text: "Question", sort: true },
                      { dataField: "aim", text: "Aim", sort: true },
                      { dataField: "tasks", text: "Tasks", sort: true },
                      {
                        dataField: "whyImportant",
                        text: "Why Important",
                        sort: true,
                      },
                      {
                        dataField: "action",
                        text: "Action",
                        formatter: (cellContent: any, row: any) => (
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(row, "questionQ3")}
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#1976d2" }}
                            />
                          </IconButton>
                        ),
                      },
                    ]}
                    status={formData.status || ""}
                    mode="questionQ2"
                  />
                </Box>
              </Collapse>
            </Paper>
            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section G: Aspirations (What is your long term personal and career aspiration...)"
                open={showAspirations}
                onToggle={() => setShowAspirations((prev) => !prev)}
                action={
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAddNew("aspirations")}
                    sx={{ mr: 1 }}
                  >
                    Add New
                  </Button>
                }
              />
              <Collapse in={showAspirations}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={aspirationsData}
                    columns={[
                      {
                        dataField: "aspirationsType",
                        text: "Aspirations Type",
                        sort: true,
                      },
                      {
                        dataField: "description",
                        text: "Description",
                        sort: true,
                      },
                      { dataField: "byWhen", text: "By When", sort: true },
                      {
                        dataField: "action",
                        text: "Action",
                        formatter: (cellContent: any, row: any) => (
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(row, "aspirations")}
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#1976d2" }}
                            />
                          </IconButton>
                        ),
                      },
                    ]}
                    status={formData.status || ""}
                    mode="questionQ2"
                  />
                </Box>
              </Collapse>
            </Paper>

            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section H: Current level of Mobility and working hours preference"
                open={showMobilityPreference}
                onToggle={() => setShowMobilityPreference((prev) => !prev)}
              />
              <Collapse in={showMobilityPreference}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={mobilityPreferenceData}
                    columns={[
                      { dataField: "mobility", text: "Mobility", sort: true },
                      { dataField: "comments", text: "Comments", sort: true },
                      {
                        dataField: "action",
                        text: "Action",
                        formatter: (cellContent: any, row: any) => (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleEditClick(row, "mobilityPreference")
                            }
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#1976d2" }}
                            />
                          </IconButton>
                        ),
                      },
                    ]}
                    status={formData.status || ""}
                    mode="questionQ2"
                  />
                </Box>
              </Collapse>
            </Paper>
            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section I: Language Skills"
                open={showLanguageSkills}
                onToggle={() => setShowLanguageSkills((prev) => !prev)}
                action={
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAddNew("languageSkills")}
                    sx={{ mr: 1 }}
                  >
                    Add New
                  </Button>
                }
              />
              <Collapse in={showLanguageSkills}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={languageSkillsData}
                    columns={[
                      { dataField: "language", text: "Language", sort: true },
                      {
                        dataField: "proficiency",
                        text: "Proficiency",
                        sort: true,
                      },
                      {
                        dataField: "action",
                        text: "Action",
                        formatter: (cellContent: any, row: any) => (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleEditClick(row, "languageSkills")
                            }
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#1976d2" }}
                            />
                          </IconButton>
                        ),
                      },
                    ]}
                    status={formData.status || ""}
                    mode="questionQ2"
                  />
                </Box>
              </Collapse>
            </Paper>
            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section J: Possible Next Career Move Options"
                open={showCareerMoveOptions}
                onToggle={() => setShowCareerMoveOptions((prev) => !prev)}
                action={
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAddNew("careerMoveOptions")}
                    sx={{ mr: 1 }}
                  >
                    Add New
                  </Button>
                }
              />
              <Collapse in={showCareerMoveOptions}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={careerMoveOptionsData}
                    columns={[
                      { dataField: "option", text: "Option", sort: true },
                      {
                        dataField: "possibleTiming",
                        text: "Possible Timing",
                        sort: true,
                      },
                      {
                        dataField: "action",
                        text: "Action",
                        formatter: (cellContent: any, row: any) => (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleEditClick(row, "careerMoveOptions")
                            }
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#1976d2" }}
                            />
                          </IconButton>
                        ),
                      },
                    ]}
                    status={formData.status || ""}
                    mode="questionQ2"
                  />
                </Box>
              </Collapse>
            </Paper>
            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section K: Skills & Work Competency Areas"
                open={showSkillsWorkCompetencyAreas}
                onToggle={() =>
                  setShowSkillsWorkCompetencyAreas((prev) => !prev)
                }
              />
              <Collapse in={showSkillsWorkCompetencyAreas}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={skillsWorkCompetencyAreasData}
                    columns={[
                      {
                        dataField: "description",
                        text: "Description",
                        sort: true,
                      },
                      {
                        dataField: "essentialOrDesirable",
                        text: "Essential/Desirable",
                        sort: true,
                      },
                      {
                        dataField: "selfAssess",
                        text: "Self Assess",
                        sort: true,
                      },
                      {
                        dataField: "secondView",
                        text: "Second View",
                        sort: true,
                      },
                      { dataField: "ed", text: "ED", sort: true },
                      {
                        dataField: "action",
                        text: "Action",
                        formatter: (cellContent: any, row: any) => (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleEditClick(row, "skillsWorkCompetencyAreas")
                            }
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#1976d2" }}
                            />
                          </IconButton>
                        ),
                      },
                    ]}
                    status={formData.status || ""}
                    mode="questionQ2"
                  />
                </Box>
              </Collapse>
            </Paper>
            <Paper
              sx={{
                background: "#e9f0fb",
                borderRadius: 0,
                boxShadow: "none",
                mb: 2,
                p: 0,
              }}
            >
              <SectionHeader
                title="Section L: Behaviors and Personal Style"
                open={showBehaviorsPersonalStyle}
                onToggle={() => setShowBehaviorsPersonalStyle((prev) => !prev)}
              />
              <Collapse in={showBehaviorsPersonalStyle}>
                <Box px={0} pb={2}>
                  <PerformanceAppraisalLines
                    lines={behaviorsPersonalStyleData}
                    columns={[
                      {
                        dataField: "description",
                        text: "Description",
                        sort: true,
                      },
                      {
                        dataField: "essentialOrDesirable",
                        text: "Essential/Desirable",
                        sort: true,
                      },
                      {
                        dataField: "selfAssess",
                        text: "Self Assess",
                        sort: true,
                      },
                      {
                        dataField: "secondView",
                        text: "Second View",
                        sort: true,
                      },
                      { dataField: "ed", text: "ED", sort: true },
                      {
                        dataField: "action",
                        text: "Action",
                        formatter: (cellContent: any, row: any) => (
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleEditClick(row, "behaviorsPersonalStyle")
                            }
                          >
                            <EditIcon
                              fontSize="small"
                              sx={{ color: "#1976d2" }}
                            />
                          </IconButton>
                        ),
                      },
                    ]}
                    status={formData.status || ""}
                    mode="questionQ2"
                  />
                </Box>
              </Collapse>
            </Paper>
          </>
        }
      />
      <ModelMui
        title={modalTitle}
        isOpen={modalOpen}
        toggleModal={handleModalClose}
        size="lg"
        isModalLoading={false}
        fields={modalFields}
        isEdit={!isAddMode}
        canEdit={formData.status === "Open" ? true : false}
        handleSubmit={handleModalSubmit}
        handleUpdateLine={handleModalSubmit}
      />
    </>
  );
}

export default PADetails;
