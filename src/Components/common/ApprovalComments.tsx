// import React, { useState, useEffect, FC } from 'react';
// import {
//     Col,
//     Button,
//     Row,
//     Modal,
// } from "reactstrap";
// import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
// import paginationFactory from 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator';
// import filterFactory from 'react-bootstrap-table2-filter';
// import ToolkitProvider, { SearchBar } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
// import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import axios, { AxiosResponse } from 'axios';
// // import { HRConfig, formatDateTime } from "../../helpers/backend_helper";
// // Removed PropTypes as TypeScript handles type checking
// import * as helper from '../../helpers/routine_helper';
// import * as url from '../../helpers/url_helper';
// import toastr from 'toastr';
// import "flatpickr/dist/themes/material_blue.css";
// import RiseLoader from 'react-spinners/RiseLoader';
// import LoadingOverlay from '@ronchalant/react-loading-overlay';
// import { HistoryIcon } from './icons/icons';

// // Define the shape of an approval comment
// interface ApprovalComment {
//     entryNo: number;
//     comment: string;
//     userID: string;
//     dateAndTime: string;
// }

// // Define the props expected by the component
// interface ApprovalCommentsProps {
//     defaultCompany: string;
//     docType: string;
//     docNo: string | number;
// }

// const ApprovalComments: FC<ApprovalCommentsProps> = ({ defaultCompany, docType, docNo }) => {
//     const [isModalLoading, setIsModalLoading] = useState < boolean > (false);
//     const [approvalComments, setApprovalComments] = useState < ApprovalComment[] > ([]);
//     const [largeModal, setLargeModal] = useState < boolean > (false);
//     const { SearchBar } = Search;

//     // Function to add a CSS class to the body
//     const removeBodyCss = (): void => {
//         document.body.classList.add("no_padding");
//     }

//     // Handler for the comments button click
//     const handleClickComments = (): void => {
//         toggleLargeModal();
//         getApprovalComments();
//     }

//     // Toggle the visibility of the modal
//     const toggleLargeModal = (): void => {
//         setLargeModal(!largeModal);
//         removeBodyCss();
//     }

//     // Define the columns for the Bootstrap table with appropriate types
//     const commentColumns: ColumnDescription<ApprovalComment>[] = [
//         {
//             dataField: 'comment',
//             text: 'Comment',
//             sort: true
//         },
//         {
//             dataField: 'userID',
//             text: 'Approver ID',
//             sort: true
//         },
//         {
//             dataField: 'dateAndTime',
//             text: 'Date and Time',
//             sort: true,
//             formatter: dateFormat
//         }
//     ];

//     // Define default sorting for the table
//     const approvalsDefaultSorted = [{
//         dataField: 'entryNo',
//         order: 'asc' as const
//     }];

//     // Formatter function for the date and time column
//     function dateFormat(cellContent: string, row: ApprovalComment): JSX.Element {
//         return (
//             <span>{formatDateTime(cellContent)}</span>
//         );
//     }

//     // Function to fetch approval comments from the backend
//     const getApprovalComments = async (): Promise<void> => {
//         setIsModalLoading(true);
//         try {
//             const response: AxiosResponse<{ value: ApprovalComment[] }> = await axios.get(
//                 `${url.APPROVAL_COMMENTS}?company=${defaultCompany}&$filter=documentType eq '${docType}' and documentNo eq '${docNo}'`,
//                 HRConfig()
//             );
//             setApprovalComments(response.data.value);
//         } catch (err: any) {
//             const errorMessage: string = helper.getErrorMessage(err?.response?.data?.error?.message) || 'An error occurred';
//             toastr.error(errorMessage);
//         } finally {
//             setIsModalLoading(false);
//         }
//     }

//     // useEffect hook can be used for side effects if needed
//     useEffect(() => {
//         // Currently empty; add any side effects if necessary
//     }, []);

//     return (
//         <>
//             <Modal
//                 isOpen={largeModal}
//                 toggle={toggleLargeModal}
//                 size="xl"
//                 centered
//                 backdrop={'static'}
//             >
//                 <div className="modal-header">
//                     <h6 className="modal-title mt-0" id="myModalLabel">Approval Comments</h6>
//                     <button
//                         type="button"
//                         onClick={() => setLargeModal(false)}
//                         className="close"
//                         data-dismiss="modal"
//                         aria-label="Close"
//                     >
//                         <span aria-hidden="true">&times;</span>
//                     </button>
//                 </div>
//                 <div className="modal-body">
//                     <LoadingOverlay
//                         active={isModalLoading}
//                         spinner={<RiseLoader />}
//                         text='Please wait...'
//                     >
//                         <ToolkitProvider
//                             keyField="entryNo"
//                             data={approvalComments}
//                             columns={commentColumns}
//                             search
//                         >
//                             {(toolkitProps) => (
//                                 <>
//                                     <Row className="mb-2">
//                                         <Col sm="4">
//                                             <div className="search-box me-2 mb-2 d-inline-block">
//                                                 <div className="position-relative">
//                                                     <SearchBar {...toolkitProps.searchProps} />
//                                                     <i className="bx bx-search-alt search-icon" />
//                                                 </div>
//                                             </div>
//                                         </Col>
//                                         <Col sm="8">
//                                             {/* Additional controls can be added here if needed */}
//                                         </Col>
//                                     </Row>
//                                     <Row>
//                                         <Col sm="12">
//                                             <BootstrapTable
//                                                 keyField='entryNo'
//                                                 data={approvalComments}
//                                                 columns={commentColumns}
//                                                 striped
//                                                 hover
//                                                 bordered={false}
//                                                 noDataIndication="No Approval Comments"
//                                                 filter={filterFactory()}
//                                                 pagination={paginationFactory()}
//                                                 defaultSorted={approvalsDefaultSorted}
//                                                 classes="table-sm align-middle table-striped"
//                                                 {...toolkitProps.baseProps}
//                                             />
//                                         </Col>
//                                     </Row>
//                                 </>
//                             )}
//                         </ToolkitProvider>
//                     </LoadingOverlay>
//                 </div>
//                 <div className="modal-footer">
//                     {/* Footer content can be added here if needed */}
//                 </div>
//             </Modal>

//             <Button
//                 color="success"
//                 type="button"
//                 className="btn btn-success btn-label waves-effect waves-light"
//                 onClick={handleClickComments}
//             >
//                 <HistoryIcon className="label-icon" />

//                 Comments
//             </Button>
//         </>
//     )
// }

// export default ApprovalComments;
