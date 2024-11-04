import { useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  TextField,
  InputAdornment
} from '@mui/material';
import { Button, Col, Row } from 'reactstrap';
import SearchIcon from '@mui/icons-material/Search';
import { approvalEntryProps } from '../../@types/approval.dto';
import { apiApprovalEntries } from '../../services/CommonServices';
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import RiseLoader from 'react-spinners/RiseLoader';
import { formatDateTime } from '../../utils/common';
import { HistoryIcon } from './icons/icons';

// Styled components
const StyledDialogTitle = styled(DialogTitle)(() => ({
  padding: 0,
  '& .modal-header': {
    padding: '1rem',
    borderBottom: '1px solid #eff2f7',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    '& .modal-title': {
      margin: 0,
      lineHeight: 1.5,
      fontSize: '14px',
      fontWeight: 500,
      fontFamily: 'inherit',
      color: '#495057',
    },
    '& .close': {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      padding: '0.5rem',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
      '& span': {
        display: 'block',
        color: '#000',
        fontSize: '24px',
        fontWeight: 'bold',
        lineHeight: 1,
        opacity: 1,
        textShadow: 'none',
        '&:hover': {
          opacity: 0.7
        }
      }
    }
  }
}));

const StyledTableCell = styled(TableCell)({
  fontSize: 'inherit',
  fontFamily: 'inherit',
  padding: '0.5rem',
});

interface ApprovalEntry {
  entryNo: number;
  documentNo: string;
  status: string;
  approverID: string;
  lastDateTimeModified: string;
}

const ApprovalEntries = ({
  defaultCompany,
  docType,
  docNo
}: approvalEntryProps) => {
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [approvalEntries, setApprovalEntries] = useState<ApprovalEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getApprovalEntries = async () => {
    try {
      setIsModalLoading(true);
      const filter = `&$filter=DocumentType eq '${docType}' and DocumentNo eq '${docNo}'`;
      const response = await apiApprovalEntries(defaultCompany ?? '', filter);
      if (response.status === 200) {
        setApprovalEntries(response.data.value);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleClickApprovalEntries = async () => {
    setOpen(true);
    await getApprovalEntries();
  };

  const filteredEntries = approvalEntries.filter(entry => 
    Object.values(entry).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <Button 
        color="warning" 
        type="button" 
        className="btn btn-warning btn-label waves-effect waves-light" 
        onClick={handleClickApprovalEntries}
      >
        <HistoryIcon className="label-icon" />
        Approval History
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            fontFamily: 'inherit'
          }
        }}
      >
        <StyledDialogTitle>
          <div className="modal-header">
            <h6 className="modal-title mt-0" id="myModalLabel">Approval Entries</h6>
            <button 
              type="button" 
              onClick={() => setOpen(false)} 
              className="close" 
              data-dismiss="modal" 
              aria-label="Close"
            >
              <span aria-hidden="true" style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                color: '#000',
                fontSize: '24px',
                fontWeight: 'bold',
                lineHeight: '20px',
                textAlign: 'center'
              }}>×</span>
            </button>
          </div>
        </StyledDialogTitle>
        <DialogContent>
          <LoadingOverlayWrapper
            active={isModalLoading}
            spinner={<RiseLoader />}
            text='Please wait...'
          >
            <Row className="mb-2">
              <Col sm="4">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Col>
            </Row>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Document No</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Approver ID</StyledTableCell>
                    <StyledTableCell>Last Modified</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntries.map((entry, index) => (
                    <TableRow key={entry.entryNo || index}>
                      <StyledTableCell>{entry.documentNo}</StyledTableCell>
                      <StyledTableCell>{entry.status}</StyledTableCell>
                      <StyledTableCell>{entry.approverID}</StyledTableCell>
                      <StyledTableCell>{formatDateTime(entry.lastDateTimeModified)}</StyledTableCell>
                    </TableRow>
                  ))}
                  {filteredEntries.length === 0 && (
                    <TableRow>
                      <StyledTableCell colSpan={4} align="center">
                        No Approval Entries
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </LoadingOverlayWrapper>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApprovalEntries;
