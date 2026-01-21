import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { RiseLoader } from "react-spinners";
import { TableComponentProps } from "../../../@types/ui.dto";
import {
  ArrowRightIcon,
  FormatListCheckbox,
  PlusIcon,
  SearchIcon,
} from "../../common/icons/icons";

// Material UI imports
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components for Material UI
const StyledTableCell = styled(TableCell)(() => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: "#f8f9fa",
    color: "#495057",
    fontWeight: 600,
    padding: "8px 16px",
    borderSpacing: "8px",
    fontFamily: "inherit",
    fontSize: "0.875rem",
  },
  [`&.MuiTableCell-body`]: {
    padding: "8px 16px",
    fontFamily: "inherit",
    fontSize: "0.875rem",
    color: "#495057",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fbfbfd",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: "#f3f3f9",
  },
}));

const TableMui: React.FC<TableComponentProps> = ({
  isLoading,
  data,
  columns,
  title,
  subTitle,
  addLink,
  addLabel,
  noDataMessage,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    console.log("event", event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search term
  const filteredData = data?.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate pagination
  const paginatedData = filteredData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const CustomTablePagination = () => (
    <div className="d-flex justify-content-end align-items-center mt-3">
      <TablePagination
        component="div"
        count={filteredData?.length || 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          ".MuiTablePagination-toolbar": {
            padding: 0,
          },
          ".MuiTablePagination-selectLabel": {
            marginBottom: 0,
          },
          ".MuiTablePagination-displayedRows": {
            marginBottom: 0,
          },
          ".MuiTablePagination-select": {
            paddingTop: 0,
            paddingBottom: 0,
          },
        }}
      />
    </div>
  );

  return (
    <LoadingOverlayWrapper
      active={isLoading}
      spinner={<RiseLoader />}
      text="Please wait..."
    >
      <div className="page-content">
        <Container fluid={true}>
          <h4 className="page-title">{title}</h4>
          <p className="page-sub-title">{subTitle}</p>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  {data && data.length > 0 ? (
                    <>
                      <Row className="mb-2">
                        <Col sm="4">
                          <div className="search-box me-2 mb-2 d-inline-block">
                            <div className="position-relative">
                              <TextField
                                size="small"
                                placeholder="Search..."
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                  startAdornment: (
                                    <SearchIcon
                                      style={{
                                        marginRight: "8px",
                                        color: "#6c757d",
                                        width: "16px",
                                        height: "16px",
                                      }}
                                    />
                                  ),
                                  sx: {
                                    height: "36px",
                                    fontSize: "0.875rem",
                                    fontFamily: "inherit",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      borderColor: "#ced4da",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline":
                                      {
                                        borderColor: "#ced4da",
                                      },
                                  },
                                }}
                              />
                            </div>
                          </div>
                        </Col>
                        {title !== "Time Sheets" && addLabel && addLabel.length > 0 && (
                          <Col sm="8">
                            <div className="text-sm-end">
                              <Link
                                className="btn btn-primary btn-label"
                                to={addLink}
                              >
                                <PlusIcon className="label-icon" />
                                {addLabel}
                              </Link>
                            </div>
                          </Col>
                        )}
                      </Row>
                      <TableContainer
                        component={Paper}
                        sx={{
                          boxShadow: "none",
                          border: "none",
                        }}
                      >
                        <Table
                          sx={{
                            minWidth: 650,
                            borderCollapse: "separate",
                            borderSpacing: "0 8px",
                            fontFamily: "inherit",
                          }}
                          size="small"
                        >
                          <TableHead>
                            <TableRow>
                              {columns.map((column, index) => (
                                <StyledTableCell key={index}>
                                  {column.text}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {paginatedData?.map((row, rowIndex) => (
                              <StyledTableRow key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                  <StyledTableCell key={colIndex}>
                                    {column.formatter
                                      ? column.formatter(
                                          row[column.dataField],
                                          row
                                        )
                                      : row[column.dataField]}
                                  </StyledTableCell>
                                ))}
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                        <CustomTablePagination />
                      </TableContainer>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="avatar-md mx-auto mb-3 mt-1">
                        <span className="avatar-title rounded-circle bg-soft border bg-primary primary text-primary font-size-16">
                          <FormatListCheckbox />
                        </span>
                      </div>
                      <div>
                        <h6>{noDataMessage}</h6>
                      </div>
                      {title !== "Time Sheets" && (
                        <>
                          {addLabel && addLabel.length > 0 && (
                            <div className="text-center mt-4">
                              <Link
                                to={addLink}
                                className="btn btn-primary btn-sm"
                              >
                                {addLabel}
                                <ArrowRightIcon className="mdi mdi-arrow-right ms-1" />
                              </Link>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </LoadingOverlayWrapper>
  );
};

export default TableMui;
