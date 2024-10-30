import * as React from 'react';
import { Collapse } from 'reactstrap';
import classNames from 'classnames';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
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
import {

  randomId,

} from '@mui/x-data-grid-generator';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../../common/icons/icons';



interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  documentType: string;  // Add this line
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, documentType } = props;

  const handleClick = () => {
    setRows((oldRows) => {
      // Check if there's already an empty row
      const hasEmptyRow = oldRows.some(row =>
        !row.leaveType && !row.startDate && !row.endDate && !row.description && !row.quantity
      );

      if (hasEmptyRow) {
        // If an empty row exists, don't add a new one
        console.log("An empty row already exists. Please fill it before adding a new one.");
        return oldRows;
      }

      // If no empty row, add a new one
      const id = randomId();
      const newRow = {
        id,
        leaveType: '',
        startDate: null,
        endDate: null,
        description: '',
        quantity: null,
        isNew: true
      };

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'leaveType' },
      }));

      return [...oldRows, newRow];
    });
  };

  return (
    <GridToolbarContainer>
      <Link
        className="btn btn-primary btn-label"
        to="#"
        onClick={handleClick}
      >
        <PlusIcon className="label-icon" />
        {`Add ${documentType} line`}
      </Link>
    </GridToolbarContainer>
  );
}

interface LinesEditableProps {
  columns: GridColDef[];
  rowLines: any[]
  documentType: string;
  handleSubmitLines: (data: any, id: string) => void
}

export default function LinesEditable({ columns, rowLines, documentType, handleSubmitLines }: LinesEditableProps) {
  const [rows, setRows] = React.useState < GridRowsProp > ([]);

  React.useEffect(() => {
    console.log("Initial rowLines:", rowLines);
    if (rowLines && rowLines.length > 0) {
      const formattedRows = rowLines.map(row => ({
        ...row,
        id: row.SystemId || row.id,
        startDate: row.startDate ? new Date(row.startDate) : null,
        endDate: row.endDate ? new Date(row.endDate) : null,
      }));
      setRows(formattedRows);
    }
  }, [rowLines]);

  React.useEffect(() => {
    console.log("Rows state:", rows);
  }, [rows]);

  const [rowModesModel, setRowModesModel] = React.useState < GridRowModesModel > ({});
  const [lineTab, setLineTab] = React.useState(true);

  const toggleLines = () => setLineTab(!lineTab);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    console.log(rows, id)
    handleSubmitLines(rows, id.toString())


  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
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

  const CustomToolbar = (props: GridToolbarProps) => (
    <EditToolbar
      {...props}
      setRows={setRows}
      setRowModesModel={setRowModesModel}
      documentType={documentType}
    />
  );

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
            <DataGrid
              rows={rows}
              columns={columnsWithActions}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={setRowModesModel}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                toolbar: { setRows, setRowModesModel, documentType },
              }}
              getRowId={(row) => row.id || row.SystemId}
              hideFooterSelectedRowCount
              hideFooterPagination
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: 'none',
                },
                '& .MuiDataGrid-columnHeaders': {
                  borderBottom: 'none',
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: 'none',
                },
              }}
            />
          </Box>
        </div>
      </Collapse>
    </div>
  );
}
