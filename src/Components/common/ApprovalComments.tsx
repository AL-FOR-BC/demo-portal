import { useState } from 'react';
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
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import RiseLoader from 'react-spinners/RiseLoader';
import { formatDateTime } from '../../utils/common';
import { HistoryIcon } from './icons/icons';
import { apiApprovalComments } from '../../services/CommonServices';

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
      zIndex: 1
    }
  }
}));

const StyledTableCell = styled(TableCell)({
  fontSize: 'inherit',
  fontFamily: 'inherit',
  padding: '0.5rem',
});

interface ApprovalComment {
  entryNo: number;
  comment: string;
  userID: string;
  dateAndTime: string;
}

interface ApprovalCommentsProps {
  defaultCompany: string;
  docType: string;
  docNo: string | number;
}

const ApprovalComments = ({
  defaultCompany,
  docType,
  docNo
}: ApprovalCommentsProps) => {
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [approvalComments, setApprovalComments] = useState<ApprovalComment[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getApprovalComments = async () => {
    try {
      setIsModalLoading(true);
      const filter = `&$filter=documentType eq '${docType}' and documentNo eq '${docNo}'`;
      const response = await apiApprovalComments(defaultCompany ?? '', filter);
      if (response.status === 200) {
        setApprovalComments(response.data.value);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleClickComments = async () => {
    setOpen(true);
    await getApprovalComments();
  };

  const filteredComments = approvalComments.filter(comment => 
    Object.values(comment).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <Button 
        color="success" 
        type="button" 
        className="btn btn-success btn-label waves-effect waves-light" 
        onClick={handleClickComments}
      >
        <HistoryIcon className="label-icon" />
        Comments
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
            <h6 className="modal-title mt-0" id="myModalLabel">Approval Comments</h6>
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
                    <StyledTableCell>Comment</StyledTableCell>
                    <StyledTableCell>Approver ID</StyledTableCell>
                    <StyledTableCell>Date and Time</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredComments.map((comment, index) => (
                    <TableRow key={comment.entryNo || index}>
                      <StyledTableCell>{comment.comment}</StyledTableCell>
                      <StyledTableCell>{comment.userID}</StyledTableCell>
                      <StyledTableCell>{formatDateTime(comment.dateAndTime)}</StyledTableCell>
                    </TableRow>
                  ))}
                  {filteredComments.length === 0 && (
                    <TableRow>
                      <StyledTableCell colSpan={3} align="center">
                        No Approval Comments
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

export default ApprovalComments;
