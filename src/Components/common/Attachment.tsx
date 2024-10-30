// import React, { useState, useEffect } from 'react';
// import {
//     Col,
//     Button,
//     Row,
//     Modal,
// } from "reactstrap";

// import { approvalEntryProps } from '../../@types/approval.dto';
// import { apiApprovalEntries } from '../../services/CommonServices';
// import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
// import LoadingOverlayWrapper from "react-loading-overlay-ts";
// import RiseLoader from 'react-spinners/RiseLoader';

// import BootstrapTable from 'react-bootstrap-table-next';
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import filterFactory from 'react-bootstrap-table2-filter';

// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
// import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
// import { formatDateTime } from '../../utils/common';
// import Swal from 'sweetalert2';

// const Attachments = props => {
//     const [isModalLoading, setIsModalLoading] = useState(false);
//     const [largeModal, setLargeModal] = useState(false);
//     const [selectedFile, setSelectedFile] = useState([]);
//     const [newSelectedFile, setNewSelectedFile] = useState([]);

//     const { state, dispatch } = useContext(Store)
//     const { attachmentCount } = state

//     const removeBodyCss = () => {
//         document.body.classList.add("no_padding");
//     }

//     const handleAttachDocuments = () => {
//         toggleLargeModal();
//         getDocumentAttachments();
//     }

//     const toggleLargeModal = () => {
//         setLargeModal(!largeModal);
//         removeBodyCss();
//     }

//     const handleSelectedFiles = (e) => {
//         const files = e.target.files
//         setNewSelectedFile(Array.from(files))
//     }

//     const removeFile = (index) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: "You won't be able to revert this!",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Yes, remove it!'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 setNewSelectedFile((prevFiles) => {
//                     const updatedFiles = [...prevFiles];
//                     updatedFiles.splice(index, 1);
//                     return updatedFiles;
//                 });
//             }
//         });
//     }

//     const handleDownload = (clickedFile) => {
//         const base64String = clickedFile.FileContentsBase64;
//         const fileName = clickedFile.FileName;
//         const fileExtension = clickedFile.FileExtension;
//         const contentType = clickedFile.fileContentType;
//         downloadBase64File(base64String, fileName, fileExtension, contentType);
//     }

//     const removeAttachment = (clickedFile) => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: "You won't be able to revert this!",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Yes, delete it!'
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 setIsModalLoading(true)
//                 axios.delete(`${url.ATTACHDOCUMENTS}(${clickedFile.SystemId})?company=${props.defaultCompany}`, Config(props.ehub_username, props.ehub_pass, "*")).then((r) => {
//                     toastr.warning('File has been deleted');
//                     getDocumentAttachments();
//                     setIsModalLoading(false);
//                 }).catch((e) => {
//                     toastr.error(e)
//                     setIsModalLoading(false)
//                 })
//             }
//         });
//     }

//     const getDocumentAttachments = async () => {
//         setIsModalLoading(true);
//         setNewSelectedFile((prevFiles) => {
//             const updatedFiles = [...prevFiles];
//             updatedFiles.splice(0);
//             return updatedFiles;
//         });
//         if (props?.exclude_doc_no == true) {
//             await axios.get(`${url.ATTACHDOCUMENTS}?company='${props.defaultCompany}'&$filter=TableID eq ${props.tableId}`, HRConfig()).then((res) => {
//                 setSelectedFile(res.data.value);
//                 if (props?.check_attachment == true) {
//                     dispatch({ type: "SET_ATTACHMENT_COUNT", payload: res.data.value.length })
//                 }
//                 if (props?.check_attachment == true && props?.docType == 'Accountability') {
//                     dispatch(({
//                         type: "SET_ATTACHMENT_COUNT_ACCOUNTABILITY",
//                         attachmentCount: res.data.value.length
//                     }))
//                 }
//                 if (props?.check_attachment == true && props?.docType == 'Purchase Requisition') {
//                     dispatch({ type: "SET_ATTACHMENT_COUNT_PURCHASE_REQ", payload: res.data.value.length })
//                 } setIsModalLoading(false);

//             }).catch((err) => {
//                 toastr.error(helper.getErrorMessage(err.response.data.error.message));
//                 setIsModalLoading(false);
//             });
//             return;
//         } else {
//             await axios.get(`${url.ATTACHDOCUMENTS}?company='${props.defaultCompany}'&$filter=No eq '${props.docNo}' and TableID eq ${props.tableId}`, HRConfig()).then((res) => {
//                 setSelectedFile(res.data.value);
//                 if (props?.check_attachment == true) {
//                     dispatch({ type: "SET_ATTACHMENT_COUNT", payload: res.data.value.length })
//                 }
//                 if (props?.check_attachment == true && props?.docType == 'Accountability') {

//                     dispatch(({
//                         type: "SET_ATTACHMENT_COUNT_ACCOUNTABILITY",

//                         attachmentCount: res.data.value.length
//                     }))
//                 }
//                 if (props?.check_attachment == true && props?.docType == 'Purchase Requisition') {
//                     dispatch({ type: "SET_ATTACHMENT_COUNT_PURCHASE_REQ", payload: res.data.value.length })
//                 } setIsModalLoading(false);
//             }).catch((err) => {
//                 toastr.error(helper.getErrorMessage(err.response.data.error.message));
//                 setIsModalLoading(false);
//             });
//         }
//     }

//     const handleSaveAttachment = async () => {
//         if (newSelectedFile.length > 0) {
//             setIsModalLoading(true);
//             newSelectedFile.forEach((f) => {
//                 const reader = new FileReader();
//                 reader.readAsDataURL(f);
//                 reader.onloadend = () => {
//                     const base64Data = reader.result;
//                     const fileName = f.name;
//                     const fileExtension = fileName.split('.').pop();
//                     const fileData = {
//                         No: props.docNo,
//                         TableID: props.tableId,
//                         DocumentType: props.docType,
//                         FileName: fileName,
//                         FileExtension: fileExtension,
//                         fileContentType: getContentTypeFromBase64(base64Data),
//                         FileContentsBase64: base64Data.split(',')[1]
//                     }
//                     axios.post(url.ATTACHDOCUMENTS + "?company=" + props.defaultCompany, JSON.stringify(fileData), HRConfig()).then((r) => {
//                         toastr.success(`Document No ${props.docNo} updated`);
//                         getDocumentAttachments();
//                         setNewSelectedFile([]);
//                     }).catch((e) => {
//                         toastr.error(helper.getErrorMessage(e.response.data.error.message));
//                         setIsModalLoading(false);
//                     })
//                 }
//             })
//         }
//     }

//     useEffect(() => {
//     }, []);

//     return (
//         <>
//             <React.Fragment>
//                 <Modal isOpen={largeModal} toggle={() => { toggleLargeModal(); }} size="xl" centered backdrop={'static'}  >
//                     <div className="modal-header">
//                         <h6 className="modal-title mt-0" id="myModalLabel">{`Document Attachments`}</h6>
//                         <button type="button" onClick={() => { setLargeModal(false); }} className="close" data-dismiss="modal" aria-label="Close">
//                             <span aria-hidden="true">&times;</span>
//                         </button>
//                     </div>
//                     <div className="modal-body">
//                         <LoadingOverlayWrapper
//                             active={isModalLoading}
//                             spinner={<RiseLoader />}
//                             text='Please wait...'
//                         >
//                             <>
//                                 {(props.status == 'Open') && (
//                                     <Row className="mb-2">
//                                         <Col md={6} sm={12}>
//                                             <div className="mb-3">
//                                                 <label htmlFor="floatingnameInput">Attach File</label>
//                                                 <input type="file" className="form-control" disabled={props.status == "Open" ? false : true} onChange={(e) => handleSelectedFiles(e)} />
//                                             </div>
//                                         </Col>
//                                         <Col md={4}>

//                                         </Col>
//                                         <Col md={2} sm={12}>
//                                             <Button color="primary" type="button" className="btn btn-primary btn-label" onClick={handleSaveAttachment}>
//                                                 <i className="bx bx-save label-icon"></i>Save Attachment
//                                             </Button>
//                                         </Col>
//                                     </Row>
//                                 )}
//                                 <Row className='mb-2'>
//                                     <Col md={12}>
//                                         {((selectedFile.length > 0) || (newSelectedFile.length > 0)) ? (
//                                             <div className="table-responsive">
//                                                 <Table className="table table-striped table-sm mb-4">
//                                                     <thead>
//                                                         <tr>
//                                                             <th>No</th>
//                                                             <th>File</th>
//                                                             <th></th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {newSelectedFile.map((a, k) => (
//                                                             <tr key={k}>
//                                                                 <td>{k + 1}</td>
//                                                                 <td>{a.name}</td>
//                                                                 <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
//                                                                     <div className="d-flex gap-3">
//                                                                         <Link
//                                                                             to="#"
//                                                                             className="text-danger"
//                                                                             onClick={() => removeFile(k)}
//                                                                         >
//                                                                             <i className="mdi mdi-file-remove font-size-18" id="deletetooltip" />
//                                                                             <UncontrolledTooltip placement="top" target="deletetooltip">
//                                                                                 Delete
//                                                                             </UncontrolledTooltip>
//                                                                         </Link>
//                                                                     </div>
//                                                                 </td>
//                                                             </tr>
//                                                         ))}
//                                                         {selectedFile.map((a, k) => (
//                                                             <tr key={k}>
//                                                                 <td>{k + 1}</td>
//                                                                 <td>

//                                                                     <Link to="#" onClick={() => handleDownload(selectedFile[k])}>
//                                                                         <p style={{ textDecoration: 'underline' }}>{a.FileName}</p>

//                                                                     </Link></td>
//                                                                 <td style={{ verticalAlign: 'middle', textAlign: 'center' }}> <>
//                                                                     <div className="d-flex gap-3">
//                                                                         {(props.status == 'Open') && (
//                                                                             <Link
//                                                                                 to="#"
//                                                                                 className="text-danger"
//                                                                                 onClick={() => removeAttachment(selectedFile[k])}
//                                                                             >
//                                                                                 <i className="mdi mdi-file-remove font-size-18" id="deletetooltip" />
//                                                                                 <UncontrolledTooltip placement="top" target="deletetooltip">
//                                                                                     Delete
//                                                                                 </UncontrolledTooltip>
//                                                                             </Link>
//                                                                         )}
//                                                                     </div>
//                                                                 </>
//                                                                 </td>
//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                 </Table>
//                                             </div>
//                                         ) : (
//                                             <div className="text-center">
//                                                 <div className="mb-4">
//                                                     <i className="mdi mdi-file-question text-warning display-4" />
//                                                 </div>
//                                                 <h6>No file attached</h6>
//                                             </div>
//                                         )}
//                                     </Col>
//                                 </Row>
//                             </>
//                         </LoadingOverlay>
//                     </div>
//                     <div className="modal-footer">
//                     </div>
//                 </Modal>
//                 <Button color="success" type="button" className="btn btn-success btn-label waves-effect waves-light" onClick={handleAttachDocuments}>
//                     <i className="bx bx-tag label-icon"></i>Attachments
//                 </Button>
//             </React.Fragment>
//         </>
//     )
// }
// Attachments.propTypes = {
//     defaultCompany: PropTypes.any,
//     docType: PropTypes.any,
//     docNo: PropTypes.any,
//     ehub_username: PropTypes.any,
//     ehub_pass: PropTypes.any,
//     status: PropTypes.any,
//     tableId: PropTypes.any
// }
// export default Attachments