import { TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: "#f8f9fa",
    color: "#2c3e50",
    fontWeight: 600,
    padding: "16px 20px",
    borderSpacing: "8px",
    fontFamily: "inherit",
    fontSize: "0.875rem",
    borderBottom: "2px solid #e3f2fd",
  },
  [`&.MuiTableCell-body`]: {
    padding: "16px 20px",
    fontFamily: "inherit",
    fontSize: "0.875rem",
    color: "#495057",
    borderBottom: "1px solid #f0f0f0",
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fafbfc",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: "#f0f4ff",
    transition: "background-color 0.2s ease",
  },
}));

export const CleanCell = ({
  value,
  onRowClick,
  isClickable = false,
}: {
  value: any;
  onRowClick?: () => void;
  isClickable?: boolean;
}) => {
  if (!value)
    return (
      <span style={{ color: "#999", fontStyle: "italic" }}>Not specified</span>
    );

  const maxLength = 100;
  const strValue =
    typeof value === "string" ? value : value != null ? String(value) : "";
  const isLong = strValue.length > maxLength;
  const displayValue = strValue.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <div
      style={{
        display: "block",
        whiteSpace: "pre-line",
        wordBreak: "break-word",
        lineHeight: "1.4",
        maxHeight: "80px",
        overflow: "hidden",
        cursor: isClickable ? "pointer" : "default",
      }}
      onClick={() => {
        if (isClickable && onRowClick) {
          onRowClick();
        }
      }}
      title={isClickable ? "Click to view details" : ""}
    >
      {displayValue}
    </div>
  );
};
