import { useState, useRef } from 'react';
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
    styled
} from '@mui/material';
import { Button, Col, Row, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import RiseLoader from 'react-spinners/RiseLoader';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import { apiAttachments, apiDeleteAttachment } from '../../services/CommonServices';
import { DeleteIcon, FileQuestionIcon, LabelIcon, SaveIcon } from './icons/icons';
import { downloadBase64File, getContentTypeFromBase64 } from '../../utils/helpers';
import { getErrorMessage } from '../../utils/common';
import { toast } from 'react-toastify';


interface Attachment {
    FileName: string;
    FileExtension: string;
    FileContentsBase64: string;
    SystemId: string;
    fileContentType: string;
}


const StyledTableCell = styled(TableCell)({
    fontSize: 'inherit',
    fontFamily: 'inherit',
});

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


const StyledDialogContent = styled(DialogContent)({
    fontFamily: 'inherit',
    fontSize: 'inherit',
});

const StyledTable = styled(Table)({
    '& .table-striped > tbody > tr:nth-of-type(odd)': {
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
    '& .table-sm td, & .table-sm th': {
        padding: '.5rem',
    }
});

const Attachments = (props) => {
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<Attachment[]>([]);
    const [newSelectedFile, setNewSelectedFile] = useState < File[] > ([]);
    const fileInputRef = useRef < HTMLInputElement > (null);

    //   const { state, dispatch } = useContext(Store);
    //   const { attachmentCount } = state;

    const handleAttachDocuments = () => {
        setOpen(true);
        getDocumentAttachments();
    };

    const handleSelectedFiles = (e) => {
        const files = e.target.files;
        setNewSelectedFile(Array.from(files));
    };

    const removeFile = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!',
            backdrop: 'rgba(0,0,0,0.4)',
            customClass: {
                container: 'swal-on-top'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setNewSelectedFile((prevFiles) => {
                    const updatedFiles = [...prevFiles];
                    updatedFiles.splice(index, 1);
                    return updatedFiles;
                });
                setNewSelectedFile([]);
            }
        });
    };

    const handleDownload = (clickedFile) => {
        const base64String = clickedFile.FileContentsBase64;
        const fileName = clickedFile.FileName;
        const fileExtension = clickedFile.FileExtension;
        const contentType = clickedFile.fileContentType;
        downloadBase64File(base64String, fileName, fileExtension, contentType);
    };

    const removeAttachment = (clickedFile) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            backdrop: 'rgba(0,0,0,0.4)',
            customClass: {
                container: 'swal-on-top'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsModalLoading(true);
                try {
                    await apiDeleteAttachment(props.defaultCompany, clickedFile.SystemId,);
                    toast.warning('File has been deleted');
                    getDocumentAttachments();
                } catch (e) {
                    toast.error(getErrorMessage(e));
                } finally {
                    setIsModalLoading(false);
                }
            }
        });
    };

    const getDocumentAttachments = async () => {
        setIsModalLoading(true);
        setNewSelectedFile([]);

        try {
            const filterQuery = props?.exclude_doc_no
                ? `$filter=TableID eq ${props.tableId}`
                : `$filter=No eq '${props.docNo}' and TableID eq ${props.tableId}`;

            const response = await apiAttachments(props.defaultCompany, filterQuery);
            setSelectedFile(response.data.value);

            if (props?.check_attachment) {
                // dispatch({ type: "SET_ATTACHMENT_COUNT", payload: response.data.value.length });

                if (props.docType === 'Accountability') {
                    //   dispatch({
                    //     type: "SET_ATTACHMENT_COUNT_ACCOUNTABILITY",
                    //     attachmentCount: response.data.value.length
                    //   });
                } else if (props.docType === 'Purchase Requisition') {
                    //   dispatch({ 
                    //     type: "SET_ATTACHMENT_COUNT_PURCHASE_REQ", 
                    //     payload: response.data.value.length 
                    //   });
                }
            }
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleSaveAttachment = async () => {
        if (newSelectedFile.length > 0) {
            setIsModalLoading(true);
            newSelectedFile.forEach((f) => {
                const reader = new FileReader();
                reader.readAsDataURL(f);
                reader.onloadend = async () => {
                    const base64Data = reader.result as string;
                    // Get filename without extension
                    const fullFileName = f.name;
                    const fileName = fullFileName.substring(0, fullFileName.lastIndexOf('.'));
                    const fileExtension = fullFileName.split('.').pop() || '';

                    const fileData = {
                        No: props.docNo,
                        TableID: props.tableId,
                        DocumentType: props.docType === "Performance Appraisal" ? "Performance Management" : props.docType,
                        FileName: fileName,
                        FileExtension: fileExtension,
                        fileContentType: getContentTypeFromBase64(base64Data),
                        FileContentsBase64: base64Data.split(',')[1]
                    };

                    try {
                        await apiAttachments(
                            props.defaultCompany,
                            '',
                            'POST',
                            fileData
                        );
                        toast.success(`Document No ${props.docNo} updated`);
                        getDocumentAttachments();
                        setNewSelectedFile([]);
                        // clear the file input
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                    } catch (e) {
                        toast.error(getErrorMessage(e));
                        setIsModalLoading(false);
                    }
                };
            });
        }
    };

    const handleCheckIFUserHasSaved = () => {
        console.log(newSelectedFile.length > 0);
        return newSelectedFile.length > 0;
    };

    return (
        <>
            <Button
                color="success"
                type="button"
                className="btn btn-success btn-label waves-effect waves-light"
                onClick={handleAttachDocuments}
            >
                <LabelIcon className="label-icon" />
                Attachments
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
                        <h6 className="modal-title mt-0" id="myModalLabel">Document Attachments</h6>
                        <button
                            type="button"
                            onClick={() => {
                                handleCheckIFUserHasSaved() ?

                                    Swal.fire({
                                        title: 'Are you sure?',
                                        text: "Are you sure you want to close this window without saving?",
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonColor: '#3085d6',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Yes, close it!',
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            setOpen(false);
                                        }
                                    })
                                    :
                                    setOpen(false)
                            }}
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
                                // fontWeight: 'bold',
                                lineHeight: '20px',
                                textAlign: 'center'
                            }}>×</span>
                        </button>
                    </div>
                </StyledDialogTitle>
                <StyledDialogContent>
                    <LoadingOverlayWrapper
                        active={isModalLoading}
                        spinner={<RiseLoader />}
                        text='Please wait...'
                    >
                        <>
                            {props.status === 'Open' && (
                                <Row className="mb-2">
                                    <Col md={6} sm={12}>
                                        <div className="mb-3">
                                            <label htmlFor="floatingnameInput">Attach File</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                disabled={props.status !== "Open"}
                                                onChange={handleSelectedFiles}
                                                ref={fileInputRef}

                                            />
                                        </div>
                                    </Col>
                                    <Col md={4}></Col>
                                    <Col md={2} sm={12}>
                                        <Button
                                            color="primary"
                                            type="button"
                                            className="btn btn-primary btn-label"
                                            onClick={handleSaveAttachment}
                                        >
                                            <SaveIcon className="label-icon" />
                                            Save Attachment
                                        </Button>
                                    </Col>
                                </Row>
                            )}

                            <Row className='mb-2'>
                                <Col md={12}>
                                    {((selectedFile.length > 0) || (newSelectedFile.length > 0)) ? (
                                        <div className="table-responsive">
                                            <TableContainer component={Paper}>
                                                <StyledTable className="table table-striped table-sm mb-4">
                                                    <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell>No</StyledTableCell>
                                                            <StyledTableCell>File</StyledTableCell>
                                                            <StyledTableCell></StyledTableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {newSelectedFile.map((a, k) => (
                                                            <TableRow key={k}>
                                                                <StyledTableCell>{k + 1}</StyledTableCell>
                                                                <StyledTableCell>{a.name}</StyledTableCell>
                                                                <StyledTableCell style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                                                                    <div className="d-flex gap-3">
                                                                        <Link
                                                                            to="#"
                                                                            className="text-danger"
                                                                            onClick={() => removeFile(k)}
                                                                        >
                                                                            <DeleteIcon
                                                                                className="font-size-18"
                                                                                id="deletetooltip"
                                                                            />

                                                                        </Link>
                                                                    </div>
                                                                </StyledTableCell>
                                                            </TableRow>
                                                        ))}
                                                        {selectedFile.map((a, k) => (
                                                            <TableRow key={k}>
                                                                <StyledTableCell>{k + 1}</StyledTableCell>
                                                                <StyledTableCell>
                                                                    <Link to="#" onClick={() => handleDownload(selectedFile[k])}>
                                                                        <p style={{ textDecoration: 'underline' }}>
                                                                            {`${a.FileName}.${a.FileExtension}`}
                                                                        </p>
                                                                    </Link>
                                                                </StyledTableCell>
                                                                <StyledTableCell style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                                                                    {props.status === 'Open' && (
                                                                        <div className="d-flex gap-3">
                                                                            <Link
                                                                                to="#"
                                                                                className="text-danger"
                                                                                onClick={() => removeAttachment(selectedFile[k])}
                                                                            >

                                                                                <DeleteIcon
                                                                                    className="font-size-18"
                                                                                    id={`deletetooltip-${k}`}
                                                                                />
                                                                                {/* <i className="mdi mdi-file-remove font-size-18" id={`deletetooltip-${k}`} /> */}
                                                                                <UncontrolledTooltip placement="top" target={`deletetooltip-${k}`}>
                                                                                    Delete
                                                                                </UncontrolledTooltip>
                                                                            </Link>
                                                                        </div>
                                                                    )}
                                                                </StyledTableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </StyledTable>
                                            </TableContainer>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="mb-4">
                                                <FileQuestionIcon />
                                            </div>
                                            <h6>No file attached</h6>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </>
                    </LoadingOverlayWrapper>
                </StyledDialogContent>
            </Dialog>
        </>
    );
};

Attachments.propTypes = {
    defaultCompany: PropTypes.string,
    docType: PropTypes.string,
    docNo: PropTypes.string,
    ehub_username: PropTypes.string,
    ehub_pass: PropTypes.string,
    status: PropTypes.string,
    tableId: PropTypes.number,
    exclude_doc_no: PropTypes.bool,
    check_attachment: PropTypes.bool
};

export default Attachments;
