import * as React from 'react';
import { Collapse } from 'reactstrap';
import classNames from 'classnames';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridToolbarProps,
} from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../../common/icons/icons';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

// Custom styled DataGrid
const StyledDataGrid = styled(DataGrid)(() => ({
  border: 'none',
  fontFamily: 'inherit',
  '& .MuiDataGrid-main': {
    borderCollapse: 'separate',
  },
  '& .MuiDataGrid-columnHeaders': {
    padding: '0px 8px',
    backgroundColor: '#f8f9fa',
    color: '#495057',
    fontSize: '0.875rem',
    fontWeight: 600,
    borderBottom: 'none',
    minHeight: '40px !important',
    maxHeight: '40px !important',
  },
  '& .MuiDataGrid-cell': {
    border: 'none',
    padding: '2px 8px',
    fontSize: '0.875rem',
    color: '#495057',
  },
  '& .MuiDataGrid-row': {
    backgroundColor: '#fbfbfd',
    minHeight: '35px !important',
    maxHeight: '35px !important',
    '&:nth-of-type(odd)': {
      backgroundColor: '#fbfbfd',
    },
    '&:hover': {
      backgroundColor: '#f3f3f9',
    },
    '& .MuiDataGrid-cell': {
      borderBottom: 'none',
    },
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: 'none',
  },
  '& .MuiDataGrid-virtualScroller': {
    marginTop: '0 !important',
  },
  // Style for edit mode
  '& .MuiDataGrid-row.Mui-editing': {
    backgroundColor: '#fff',
    '& .MuiDataGrid-cell': {
      padding: '2px 8px',
    },
  },
  // Style for action buttons
  '& .actions': {
    color: '#495057',
    '& .MuiIconButton-root': {
      padding: '2px',
      fontSize: '0.8rem',
    },
  },
}));

// Styled toolbar container
const StyledToolbarContainer = styled(GridToolbarContainer)({
  // padding: '16px 0',
  justifyContent: 'flex-end',
});

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  documentType: string;
  columns: GridColDef[];
  createNewLine: (lineNo: number) => any;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, createNewLine } = props;

  const handleClick = () => {
    const newLineNo = Math.floor(Math.random() * 1000000);
    const newRow = createNewLine(newLineNo);
    setRows((oldRows) => [newRow, ...oldRows]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [newRow.id]: { mode: GridRowModes.Edit, fieldToFocus: 'description' },
    }));
  };

  return (
    <StyledToolbarContainer>
      <Link
        className="btn btn-primary btn-label"
        to="#"
        onClick={handleClick}
      >
        <PlusIcon className="label-icon" />
        {`Add ${props.documentType} line`}
      </Link>
    </StyledToolbarContainer>
  );
}

interface LinesEditableProps {
  columns: GridColDef[];
  rowLines: any[];
  documentType: string;
  handleSubmitLines: (data: any[]) => Promise<{ success: boolean }>;
  handleDeleteLine: (id: GridRowId) => void;
  handleEditLine: (data: any) => Promise<{ success: boolean }>;
  createNewLine: (lineNo: number) => any;
}

export default function LinesEditable({ 
  columns, 
  rowLines, 
  documentType, 
  handleSubmitLines, 
  handleDeleteLine, 
  handleEditLine,
  createNewLine 
}: LinesEditableProps) {
  const [rows, setRows] = React.useState < any[] > ([]);
  const [isEditing, setIsEditing] = React.useState < boolean > (false);
  const [rowModesModel, setRowModesModel] = React.useState < GridRowModesModel > ({});
  const [lineTab, setLineTab] = React.useState < boolean > (true);
  console.log("documentType:", documentType);
  React.useEffect(() => {
    console.log("Initial rowLines:", rowLines);
    if (rowLines && rowLines.length > 0) {
      const formattedRows = rowLines.map((row, index) => ({
        ...row,
        id: row.systemId || row.lineNo || `temp-id-${index}`,
      }));
      console.log("Formatted rows:", formattedRows);
      setRows(formattedRows);
    }
  }, [rowLines]);

  React.useEffect(() => {
    console.log("Rows state:", rows);
  }, [rows]);

  const toggleLines = () => {
    setLineTab(prev => !prev);
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setIsEditing(true)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setRows(rows.filter((row) => row.id !== id));
        handleDeleteLine(id);
      }
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    try {
      if (isEditing) {
        const response = await handleEditLine(newRow);
        if (response.success) {
          const updatedRow = { ...newRow, isNew: false };
          setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
          return updatedRow;
        } else {
          throw new Error("Failed to save changes");
        }
      } else {
        const response = await handleSubmitLines([newRow]);
        if (response.success) {
          const updatedRow = { ...newRow, isNew: false };
          setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
          return updatedRow;
        } else {
          throw new Error("Failed to save changes");
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to save changes");
      throw error;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columnsWithActions: GridColDef[] = [
    ...columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
          />,
        ];
      },
    },
  ];

  const ToolbarWrapper = (props: GridToolbarProps) => {
    return (
      <EditToolbar
        {...props}
        setRows={setRows as any}
        setRowModesModel={setRowModesModel}
        documentType={documentType}
        columns={columns}
        createNewLine={createNewLine}
      />
    );
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingLines">
        <button
          className={classNames(
            "accordion-button",
            "fw-medium",
            { collapsed: !lineTab }
          )}
          type="button"
          onClick={toggleLines}
          style={{ cursor: "pointer" }}
        >
          Lines
        </button>
      </h2>
      <Collapse
        isOpen={lineTab}
        className="accordion-collapse"
      >
        <div className="accordion-body">
          <Box
            sx={{
              width: '100%',
              '& .actions': {
                color: 'text.secondary',
              },
              '& .textPrimary': {
                color: 'text.primary',
              },
            }}
          >
            <StyledDataGrid
              rows={rows}
              columns={columnsWithActions}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{
                toolbar: ToolbarWrapper,
              }}
              slotProps={{
                toolbar: {},
              }}
              getRowId={(row) => row.id || row.systemId || `temp-${row.lineNo}`}
              hideFooterSelectedRowCount
              hideFooterPagination
              autoHeight
              disableColumnMenu
              density="compact"
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
            />
          </Box>
        </div>
      </Collapse>
    </div>
  );
}
