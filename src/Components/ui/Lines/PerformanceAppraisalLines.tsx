import React from "react";
import { toast } from "react-toastify";
import { apiPALInes } from "../../../services/PaServices";
import { getErrorMessage } from "../../../utils/common";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
  CleanCell,
} from "../Table/StyledTable";
import EditIcon from "@mui/icons-material/Edit";
import ModelMui from "../ModelMui/ModelMui";

interface PerformanceAppraisalLine {
  systemId: string;
  jobObjective: string;
  keyPerformanceIndicators: string;
  deliverables: string;
  byWhichTargetDate: string;
  appraiserKpiAssessment?: string;
  appraiserLimitingFactors?: string;
  appraiserSuggestions?: string;
  [key: string]: any;
}

interface QuestionQ2Line {
  systemId: string;
  question: string;
  element: string;
  whatDoYouThinkCausesTheDifficulty: string;
  [key: string]: any;
}

interface QuestionQ1Line {
  systemId: string;
  question: string;
  description: string;
  [key: string]: any;
}

interface PerformanceAppraisalLinesProps {
  lines:
    | PerformanceAppraisalLine[]
    | QuestionQ2Line[]
    | QuestionQ1Line[]
    | any[];
  columns: {
    dataField: string;
    text: string;
    sort?: boolean;
    formatter?: (cellContent: any, row: any) => React.ReactElement;
  }[];
  status: string;
  mode?:
    | "pa"
    | "questionQ2"
    | "questionQ1"
    | "otherPersonalTraits"
    | "trainingNeedsIdentified";
  expandedRows?: Set<number>;
  onToggleExpansion?: (rowIndex: number) => void;
  companyId?: string;
  onRefresh?: () => void;
}

const PerformanceAppraisalLines: React.FC<PerformanceAppraisalLinesProps> = ({
  lines,
  columns,
  mode = "pa",
  expandedRows: externalExpandedRows,
  onToggleExpansion,
  companyId,
  onRefresh,
}) => {
  const [internalExpandedRows, setInternalExpandedRows] = React.useState<
    Set<number>
  >(new Set());

  // Use external expanded rows if provided, otherwise use internal state
  const expandedRows = externalExpandedRows || internalExpandedRows;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalFields, setModalFields] = React.useState<any[]>([]);
  const [editRow, setEditRow] = React.useState<any>(null);
  const handleRowToggle = (rowIndex: number) => {
    if (onToggleExpansion) {
      // Use external toggle function
      onToggleExpansion(rowIndex);
    } else {
      // Use internal state
      const newExpandedRows = new Set(expandedRows);
      if (newExpandedRows.has(rowIndex)) {
        newExpandedRows.delete(rowIndex);
      } else {
        newExpandedRows.add(rowIndex);
      }
      setInternalExpandedRows(newExpandedRows);
    }
  };

  const handleEditClick = (row: any) => {
    // Store the row being edited
    setEditRow(row);
    // Prepare fields for ModelMui
    // Define the fields in a specific order and grouping
    const baseFields = [
      // Objective and KPI Group
      {
        label: "Job Objective",
        type: "text",
        value: row.jobObjective || "",
        onChange: (e: any) => handleEditChange("jobObjective", e.target.value),
        id: "jobObjective",
        disabled: true, // Job objective should be read-only
        colSize: 12, // Full width
      },
      {
        label: "Key Performance Indicator(s)",
        type: "text",
        value: row.keyPerformanceIndicator || "",
        onChange: (e: any) =>
          handleEditChange("keyPerformanceIndicator", e.target.value),
        id: "keyPerformanceIndicator",
        disabled: true, // KPI should be read-only
        colSize: 12,
      },
      {
        label: "Measures/Deliverables",
        type: "text",
        value: row.measuresDeliverables || "",
        onChange: (e: any) =>
          handleEditChange("measuresDeliverables", e.target.value),
        id: "measuresDeliverables",
        disabled: true,
        colSize: 12,
      },
      {
        label: "By which Target Date?",
        type: "text",
        value: row.byWhichTargetDate || "",
        onChange: (e: any) =>
          handleEditChange("byWhichTargetDate", e.target.value),
        id: "byWhichTargetDate",
        disabled: true,
        colSize: 6,
      },

      // Appraisee Assessment Group
      {
        label: "What has been your limiting Factor(s)",
        type: "textarea",
        value: row.limitingFactor || "",
        onChange: (e: any) =>
          handleEditChange("limitingFactor", e.target.value),
        id: "limitingFactor",
        disabled: row.stage === "Appraiser Rating",
        rows: 4,
        colSize: 12,
      },
      {
        label: "Suggestion for future enhanced Performance",
        type: "textarea",
        value: row.enhancedPerformance || "",
        onChange: (e: any) =>
          handleEditChange("enhancedPerformance", e.target.value),
        id: "enhancedPerformance",
        disabled: row.stage === "Appraiser Rating",
        rows: 4,
        colSize: 12,
      },
      {
        label: "Appraisee Rating (1-4)",
        type: "number",
        value: row.appraiseeRating || "",
        onChange: (e: any) =>
          handleEditChange("appraiseeRating", e.target.value),
        id: "appraiseeRating",
        disabled: row.stage === "Appraiser Rating",
        colSize: 6,
        min: 1,
        max: 4,
      },
    ];

    // Add appraiser fields
    // Appraiser Assessment Group
    const appraiserFields = [
      {
        label: "Appraiser Rating (1-4)",
        type: "number",
        value: row.appraiserRating || "",
        onChange: (e: any) =>
          handleEditChange("appraiserRating", e.target.value),
        id: "appraiserRating",
        disabled: row.stage !== "Appraiser Rating",
        colSize: 6,
        min: 1,
        max: 4,
      },
      {
        label: "Appraiser KPI Assessment",
        type: "textarea",
        value: row.appraiserKpiAssessment || "",
        onChange: (e: any) =>
          handleEditChange("appraiserKpiAssessment", e.target.value),
        id: "appraiserKpiAssessment",
        disabled: row.stage !== "Appraiser Rating",
        rows: 4,
        colSize: 12,
      },
      {
        label: "Appraiser Limiting Factors",
        type: "textarea",
        value: row.appraiserLimitingFactors || "",
        onChange: (e: any) =>
          handleEditChange("appraiserLimitingFactors", e.target.value),
        id: "appraiserLimitingFactors",
        disabled: row.stage !== "Appraiser Rating",
        rows: 4,
        colSize: 12,
      },
      {
        label: "Appraiser Suggestions",
        type: "textarea",
        value: row.appraiserSuggestions || "",
        onChange: (e: any) =>
          handleEditChange("appraiserSuggestions", e.target.value),
        id: "appraiserSuggestions",
        disabled: row.stage !== "Appraiser Rating",
        rows: 4,
        colSize: 12,
      },
    ];

    const fields = [...baseFields, ...appraiserFields];

    setModalFields([fields]);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleEditChange = (fieldName: string, value: string) => {
    // Update modalFields with the new value
    setModalFields((prev) =>
      prev.map((row) =>
        row.map((field: any) =>
          field.id === fieldName ? { ...field, value } : field
        )
      )
    );
  };

  const handleEditSave = async () => {
    try {
      // Get the current field values from modalFields
      const updatedData = modalFields[0].reduce((acc, field) => {
        acc[field.id] = field.value;
        return acc;
      }, {});

      // Call the API to update the PA line
      if (!companyId) {
        toast.error("Company ID is required");
        return;
      }

      const response = await apiPALInes(
        companyId,
        "PATCH",
        updatedData,
        editRow.systemId,
        editRow["@odata.etag"]
      );

      if (response?.status === 200) {
        toast.success("Data updated successfully");
        // Refresh the data if needed
        if (onRefresh) {
          onRefresh();
        }
        setModalOpen(false);
      } else {
        toast.error("Failed to update data");
      }
    } catch (error) {
      toast.error("Error updating data: " + getErrorMessage(error));
    }
  };

  // No pagination needed since TablePagination was removed
  const displayData = lines;

  const actionColumn = {
    dataField: "action",
    text: "Action",
    formatter: (_: any, row: any) => (
      <IconButton size="small" onClick={() => handleEditClick(row)}>
        <EditIcon fontSize="small" sx={{ color: "#1976d2" }} />
      </IconButton>
    ),
  };
  const allColumns = React.useMemo(() => {
    // Only add action column if not already present
    if (columns.some((col) => col.dataField === "action")) return columns;
    return [...columns, actionColumn];
  }, [columns]);

  return (
    <TableContainer
      component={Paper}
      sx={{ boxShadow: "none", border: "none" }}
    >
      {/* Search input removed */}
      <Table size="small">
        <TableHead>
          <TableRow>
            {allColumns.map((column, index) => (
              <StyledTableCell key={index}>{column.text}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((row, rowIndex) => {
            if (
              mode === "questionQ2" ||
              mode === "questionQ1" ||
              mode === "otherPersonalTraits" ||
              mode === "trainingNeedsIdentified"
            ) {
              return (
                <StyledTableRow key={row.systemId || rowIndex}>
                  {allColumns.map((column, colIndex) => (
                    <StyledTableCell key={colIndex}>
                      {column.dataField === "action" ? (
                        column.formatter?.(null, row)
                      ) : (
                        <CleanCell value={row[column.dataField]} />
                      )}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              );
            }
            // Default: PA lines with collapsible
            const isExpanded = expandedRows.has(rowIndex);
            return (
              <React.Fragment key={row.systemId || rowIndex}>
                <StyledTableRow
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "#f0f4ff !important",
                      transition: "background-color 0.2s ease",
                    },
                  }}
                  onClick={() => handleRowToggle(rowIndex)}
                >
                  {allColumns.map((column, colIndex) => (
                    <StyledTableCell key={colIndex}>
                      {column.dataField === "action" ? (
                        column.formatter?.(null, row)
                      ) : (
                        <>
                          {colIndex === 0 && (
                            <span
                              style={{
                                marginRight: "8px",
                                color: "#1976d2",
                                fontSize: "0.75rem",
                              }}
                            >
                              {isExpanded ? "▼" : "▶"}
                            </span>
                          )}
                          <CleanCell
                            value={row[column.dataField]}
                            isClickable={true}
                          />
                        </>
                      )}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={allColumns.length}
                  >
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Card
                          variant="outlined"
                          sx={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #e3f2fd",
                            borderRadius: 2,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <CardContent sx={{ padding: 3 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                color: "#1976d2",
                                marginBottom: 3,
                                borderBottom: "2px solid #e3f2fd",
                                paddingBottom: 1,
                              }}
                            >
                              Performance Details
                            </Typography>
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                  sx={{ fontWeight: 600, color: "#555" }}
                                >
                                  Job Objective
                                </Typography>
                                <Box
                                  sx={{
                                    backgroundColor: "#f8f9fa",
                                    padding: 2,
                                    borderRadius: 1.5,
                                    minHeight: "60px",
                                    border: "1px solid #e9ecef",
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ lineHeight: 1.5 }}
                                  >
                                    {row.jobObjective || "Not specified"}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                  sx={{ fontWeight: 600, color: "#555" }}
                                >
                                  Key Performance Indicator(s)
                                </Typography>
                                <Box
                                  sx={{
                                    backgroundColor: "#f8f9fa",
                                    padding: 2,
                                    borderRadius: 1.5,
                                    minHeight: "60px",
                                    border: "1px solid #e9ecef",
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ lineHeight: 1.5 }}
                                  >
                                    {row.keyPerformanceIndicators ||
                                      "Not specified"}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                  sx={{ fontWeight: 600, color: "#555" }}
                                >
                                  Measures/Deliverables
                                </Typography>
                                <Box
                                  sx={{
                                    backgroundColor: "#f8f9fa",
                                    padding: 2,
                                    borderRadius: 1.5,
                                    minHeight: "60px",
                                    border: "1px solid #e9ecef",
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ lineHeight: 1.5 }}
                                  >
                                    {row.deliverables || "Not specified"}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                  sx={{ fontWeight: 600, color: "#555" }}
                                >
                                  By which Target Date?
                                </Typography>
                                <Box
                                  sx={{
                                    backgroundColor: "#f8f9fa",
                                    padding: 2,
                                    borderRadius: 1.5,
                                    minHeight: "60px",
                                    border: "1px solid #e9ecef",
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ lineHeight: 1.5 }}
                                  >
                                    {row.byWhichTargetDate || "Not specified"}
                                  </Typography>
                                </Box>
                              </Grid>

                              {/* Appraiser Section */}
                              <Grid item xs={12}>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  sx={{
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    color: "#1976d2",
                                    marginTop: 4,
                                    marginBottom: 3,
                                    borderBottom: "2px solid #e3f2fd",
                                    paddingBottom: 1,
                                  }}
                                >
                                  Appraiser Assessment
                                </Typography>
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                  sx={{ fontWeight: 600, color: "#555" }}
                                >
                                  Appraiser KPI Assessment
                                </Typography>
                                <Box
                                  sx={{
                                    backgroundColor: "#f8f9fa",
                                    padding: 2,
                                    borderRadius: 1.5,
                                    minHeight: "60px",
                                    border: "1px solid #e9ecef",
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ lineHeight: 1.5 }}
                                  >
                                    {row.appraiserKpiAssessment ||
                                      "Not specified"}
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                  sx={{ fontWeight: 600, color: "#555" }}
                                >
                                  Appraiser Limiting Factors
                                </Typography>
                                <Box
                                  sx={{
                                    backgroundColor: "#f8f9fa",
                                    padding: 2,
                                    borderRadius: 1.5,
                                    minHeight: "60px",
                                    border: "1px solid #e9ecef",
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ lineHeight: 1.5 }}
                                  >
                                    {row.appraiserLimitingFactors ||
                                      "Not specified"}
                                  </Typography>
                                </Box>
                              </Grid>

                              <Grid item xs={12} sm={6} md={4}>
                                <Typography
                                  variant="subtitle2"
                                  color="textSecondary"
                                  gutterBottom
                                  sx={{ fontWeight: 600, color: "#555" }}
                                >
                                  Appraiser Suggestions
                                </Typography>
                                <Box
                                  sx={{
                                    backgroundColor: "#f8f9fa",
                                    padding: 2,
                                    borderRadius: 1.5,
                                    minHeight: "60px",
                                    border: "1px solid #e9ecef",
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ lineHeight: 1.5 }}
                                  >
                                    {row.appraiserSuggestions ||
                                      "Not specified"}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Box>
                    </Collapse>
                  </StyledTableCell>
                </StyledTableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      {/* TablePagination removed for all modes */}
      <ModelMui
        title="Line"
        isOpen={modalOpen}
        toggleModal={handleModalClose}
        size="lg"
        isModalLoading={false}
        fields={modalFields}
        isEdit={true}
        handleUpdateLine={handleEditSave}
      />
    </TableContainer>
  );
};

export default PerformanceAppraisalLines;
