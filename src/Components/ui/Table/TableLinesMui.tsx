import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  styled,
  TablePagination,
  TextField,
} from '@mui/material';
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {  closeModalRequisition, editRequisitionLine, openModalRequisition } from "../../../store/slices/Requisitions";
import { PlusIcon, SearchIcon } from "../../common/icons/icons";
import ModelMui from '../ModelMui/ModelMui';


const StyledTableCell = styled(TableCell)(() => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: '#f8f9fa',
    color: '#495057',
    fontWeight: 600,
    padding: '12px 16px',
    borderSpacing: '8px',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
  },
  [`&.MuiTableCell-body`]: {
    padding: '12px 16px',
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    color: '#495057',
  }
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: '#fbfbfd',
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    backgroundColor: '#f3f3f9',
  },
}));

interface TableLinesMuiProps {
  data: any[];
  columns: any[];
  status: string;
  modelFields: any[];
  handleSubmitLines: () => void;
  clearLineFields: () => void;
  handleSubmitUpdatedLine: () => void;
  handleValidateHeaderFields: () => boolean;
}

const TableLinesMui: React.FC<TableLinesMuiProps> = ({
  data,
  columns,
  status,
  modelFields,
  handleSubmitLines,
  clearLineFields,
  handleSubmitUpdatedLine,
  handleValidateHeaderFields
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState('');

  const {  isEdit, isModalRequisition, isModalRequisitionLoading } = useAppSelector((state) => state.purchaseRequisition.purchaseRequisition);
  const dispatch = useAppDispatch();

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    console.log("", event);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleModel = () => {
    console.log("handleValidateHeaderFields", handleValidateHeaderFields());
    if (handleValidateHeaderFields()) {
      console.log("isModalOpen", isModalRequisition)
      if (isModalRequisition) {
        console.log("isModalOpen", isModalRequisition)
        clearLineFields();
        dispatch(editRequisitionLine(false));
        dispatch(closeModalRequisition())
      } else {
        clearLineFields();
        dispatch(openModalRequisition())
      }
    }
  };

  // Filter data based on search term
  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Simplified pagination component
  const CustomTablePagination = () => (
    <div className="d-flex justify-content-end align-items-center mt-3">
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          '.MuiTablePagination-toolbar': {
            padding: 0,
          },
          '.MuiTablePagination-selectLabel': {
            marginBottom: 0,
          },
          '.MuiTablePagination-displayedRows': {
            marginBottom: 0,
          },
          '.MuiTablePagination-select': {
            paddingTop: 0,
            paddingBottom: 0,
          }
        }}
      />
    </div>
  );

  return (
    <>
      <ModelMui
        isOpen={isModalRequisition}
        toggleModal={toggleModel}
        isEdit={isEdit}
        title="Requisition Line"
        isModalLoading={isModalRequisitionLoading}
        fields={modelFields}
        handleSubmit={handleSubmitLines}
        handleUpdateLine={handleSubmitUpdatedLine}
      
      />


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
                        marginRight: '8px',
                        color: '#6c757d',
                        width: '16px',
                        height: '16px'
                      }} 
                    />
                  ),
                  sx: {
                    height: '36px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ced4da'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ced4da'
                    }
                  }
                }}
              />
            </div>
          </div>
        </Col>

        <Col sm="8">
          {status === 'Open' && (
            <div className="text-sm-end">
              <Link
                className="btn btn-primary btn-label"
                to="#"
                onClick={toggleModel}
              >
                <PlusIcon className="label-icon" />
                Add Requisition Line
              </Link>
            </div>
          )}
        </Col>
      </Row>

      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: 'none',
          border: 'none'
        }}
      >
        <Table 
          sx={{ 
            minWidth: 650,
            borderCollapse: 'separate',
            borderSpacing: '0 8px',
            fontFamily: 'inherit',
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
            {paginatedData.map((row, rowIndex) => (
              <StyledTableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <StyledTableCell key={colIndex}>
                    {column.formatter
                      ? column.formatter(row[column.dataField], row)
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
  );
};

export default TableLinesMui;
