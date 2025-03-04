import { Badge } from "reactstrap";
import React, { ReactNode } from "react";
import { Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { DeleteIcon, PencilIcon } from "../../common/icons/icons.tsx";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
type HttpMethod = "DELETE" | "GET" | "POST" | "PUT" | "PATCH";

interface RowType {
  status: "Open" | "Approved" | "Pending Approval" | string; // Additional statuses can be added as needed
  Status?: "Open" | "Approved" | "Pending Approval" | string;
}
export const statusFormatter = (
  cellContent: ReactNode,
  row: RowType
): JSX.Element => {
  console.log("row:", row);
  if (row.status == "Open" || row?.Status == "Open") {
    return (
      <div>
        <Badge className="me-2 bg-danger">{cellContent}</Badge>
      </div>
    );
  } else if (row.status == "Approved") {
    return (
      <div>
        <Badge className="me-2 bg-success">{cellContent}</Badge>
      </div>
    );
  } else if (
    row.status == "Pending Approval" ||
    row.status == "Pending_x0020_Approval"
  ) {
    return (
      <div>
        <Badge className="me-2 bg-warning">
          {cellContent == "Pending Approval"
            ? "Pending Approval"
            : "Pending Approval"}
        </Badge>
      </div>
    );
  } else {
    return (
      <div>
        <Badge className="me-2 bg-secondary">{cellContent}</Badge>
      </div>
    );
  }
};

interface ActionFormatterProps {
  cellContent: React.ReactNode; // Text or content inside the button
  row: { systemId: string | number; DocumentNo: string; SystemId?: string }; // Shape of the row, at least having an id
  buttonText?: string; // Custom button text
  buttonColor?: string; // Custom button color, e.g., "primary", "danger", etc.
  onClick?: (row: { systemId: string | number }) => void; // Custom onClick handler
  navigateTo?: string; // Custom navigation path
  pageType?: string;
}
// { systemId: string | undefined; "@odata.etag": string | undefined };
interface ActionsFormatterLinesProps {
  row: any;
  handleEditLine: (row: { systemId: string | number }) => void;
  companyId: string;
  apiHandler: (
    companyId: string,
    method: HttpMethod,
    data?: any,
    systemId?: string,
    etag?: string,
    filterQuery?: string
  ) => Promise<any>;
  populateData: () => void;
  handleDeleteLine: (row: { systemId: string | number }) => void;
}
export const ActionFormatter: React.FC<ActionFormatterProps> = ({
  cellContent,
  row,
  buttonText = "Details",
  buttonColor = "primary",
  onClick,
  navigateTo,
  pageType = "",
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(row); // Use the custom onClick handler if provided
    } else if (pageType === "" && navigateTo) {
      navigate(row.systemId ? `${navigateTo}/${row.systemId}` : row.SystemId ? `${navigateTo}/${row.SystemId}` : `${navigateTo}`); // Default navigation behavior
    } else if (pageType === "approval" && navigateTo) {
      console.log("navigateTo:", `${navigateTo}/${row.DocumentNo}`);
      navigate(`${navigateTo}`);
    }
  };

  if (pageType === "approval") {
    return (
      <Link to={`${navigateTo}`}>
        <Button
          type="button"
          color={buttonColor}
          className="btn-sm btn-rounded"
          onClick={handleClick}
        >
          {cellContent || buttonText}
        </Button>
      </Link>
    );
  } else {
    return (
      <Link to={`${navigateTo}/${row.systemId || row.SystemId}`}>
        <Button
          type="button"
          color={buttonColor}
          className="btn-sm btn-rounded"
          onClick={handleClick}
        >
          {cellContent || buttonText}
        </Button>
      </Link>
    );
  }
};

export const noFormatter = (cellContent: any) => {
  return <strong>{cellContent}</strong>;
};

export function numberFormatter(cellContent: number, row: any) {
  console.log("row:", row);
  return (
    //textAlign: right,
    <div style={{ maxWidth: "100px" }}>{formatNumber(cellContent)}</div>
  );
}

export const formatNumber = (num: number) => {
  const options = {
    maximumFractionDigits: 2,
  };

  return Intl.NumberFormat("en-US", options).format(num);
};

export const ActionFormatterLines: React.FC<ActionsFormatterLinesProps> = ({
  row,
  handleEditLine,
  apiHandler,
  companyId,
  populateData,
}) => {
  const handleDeleteLine = async () => {
    if (!row) {
      console.error("Row data is missing");
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log(row);
          const resDelteLine = await apiHandler(
            companyId,
            "DELETE",
            undefined,
            row.systemId || row.SystemId,
            row["@odata.etag"]
          );
          if (resDelteLine.status === 204) {
            toast.success("Line deleted successfully");
            populateData();
          }
        } catch (error) {
          console.log(row);
          console.error("Error deleting line", error);
          toast.error("Error deleting line");
        }
      }
    });
  };
  return (
    <div className="d-flex gap-3">
      <Link
        to="#"
        className="text-success"
        onClick={() => {
          handleEditLine(row);
        }}
      >
        <PencilIcon className="font-size-18" />
      </Link>
      <Link to="#" className="text-danger" onClick={handleDeleteLine}>
        <DeleteIcon className="font-size-18" />
      </Link>
    </div>
  );
};
