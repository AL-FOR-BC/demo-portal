import React, { useState, useEffect } from 'react';
import {
    Col,
    Button,
    Row,
    Modal,
} from "reactstrap";

import { approvalEntryProps } from '../../@types/approval.dto';
import { apiApprovalEntries } from '../../services/CommonServices';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import RiseLoader from 'react-spinners/RiseLoader';

// import BootstrapTable from 'react-bootstrap-table-next';
// import paginationFactory from 'react-bootstrap-table2-paginator';
// import filterFactory from 'react-bootstrap-table2-filter';

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { formatDateTime } from '../../utils/common';
import { HistoryIcon } from './icons/icons';

// import "flatpickr/dist/themes/material_blue.css";

// import paginationFactory from 'react-bootstrap-table2-paginator';

// import LoadingOverlayWrapper from "react-loading-overlay-ts";






const ApprovalEntries = ({
    defaultCompany,
    docType,
    docNo
}: approvalEntryProps) => {

    const [isModalLoading, setIsModalLoading] = useState(false);
    const [approvalEntries, setApprovalEntries] = useState([]);
    const [largeModal, setLargeModal] = useState(false);
    const { SearchBar } = Search;

    const removeBodyCss = () => {
        document.body.classList.add("no_padding");
    }

    const handleClickApprovalEntries = async () => {
        toggleLargeModal();
        await getApprovalEntries();
    }

    const toggleLargeModal = () => {
        setLargeModal(!largeModal);
        removeBodyCss();
    }

    const approvalColumns = [
        {
            dataField: 'documentNo',
            text: 'Document No',
            sort: true
        },
        {
            dataField: 'status',
            text: 'Status',
            sort: true
        },
        {
            dataField: 'approverID',
            text: 'Approver ID',
            sort: true
        },
        {
            dataField: 'lastDateTimeModified',
            text: 'Last Modified',
            sort: true,
            formatter: dateformat
        }];

    // const approvalsDefaultSorted = [{
    //     dataField: 'LastDateTimeModified',
    //     order: 'asc'
    // }];

    function dateformat(cellContent) {
        return (
            formatDateTime(cellContent)
        )
    }

    const getApprovalEntries = async () => {
        try {
            setIsModalLoading(true);
            const filter = `&$filter=DocumentType eq '${docType}' and DocumentNo eq '${docNo}'`;
            const response = await apiApprovalEntries(defaultCompany ?? '', filter);
            if (response.status === 200) {
                setApprovalEntries(response.data.value);
                console.log(response.data.value);
                setIsModalLoading(false);
                return response.data;

            }
        } catch (err) {
            // toast.error(helper.getErrorMessage(err.response.data.error.message));
            setIsModalLoading(false);
        } finally {
            console.log(approvalEntries);

            setIsModalLoading(false);
        }
        // toast.error(helper.getErrorMessage(err.response.data.error.message));

    }



    useEffect(() => {
        const getApprovalEntries = async () => {

            try {
                setIsModalLoading(true);
                const filter = `&$filter=DocumentType eq '${docType}' and DocumentNo eq '${docNo}'`;
                const response = await apiApprovalEntries(defaultCompany ?? '', filter);
                if (response.status === 200) {
                    setApprovalEntries(response.data.value);

                    setIsModalLoading(false);


                }
            } catch (err) {
                // toast.error(helper.getErrorMessage(err.response.data.error.message));
                setIsModalLoading(false);
            } finally {
                console.log(approvalEntries);

                setIsModalLoading(false);
            }
            // toast.error(helper.getErrorMessage(err.response.data.error.message));

        }
        getApprovalEntries();
    }, []);

    return (
        <React.Fragment>
            <Modal isOpen={largeModal} toggle={() => { toggleLargeModal(); }} size="xl" centered backdrop={'static'}  >
                <div className="modal-header">
                    <h6 className="modal-title mt-0" id="myModalLabel">{`Approval Entries`}</h6>
                    <button type="button" onClick={() => { setLargeModal(false); }} className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <LoadingOverlayWrapper
                        active={isModalLoading}
                        spinner={<RiseLoader />}
                        text='Please wait...'
                    >
                        <ToolkitProvider
                            keyField="entryNo"
                            // data={[
                            //     {
                            //         entryNo: 1,
                            //         DocumentNo: "0000001",
                            //         Status: "Approved",
                            //         ApproverID: "EMP001",
                            //         LastDateTimeModified: "2021-09-01T08:00:00"
                            //     },
                            //     {
                            //         entryNo: 2,
                            //         DocumentNo: "0000002",
                            //         Status: "Rejected",
                            //         ApproverID: "EMP002",
                            //         LastDateTimeModified: "2021-09-01T09:00:00"
                            //     }
                            // ]}
                            data={
                                approvalEntries
                            }
                            columns={approvalColumns}
                            search
                        >
                            {toolkitProps => (
                                <>
                                    <Row className="mb-2">
                                        <Col sm="4">
                                            <div className="search-box me-2 mb-2 d-inline-block">
                                                <div className="position-relative">
                                                    <SearchBar {...toolkitProps.searchProps} />
                                                    <i className="bx bx-search-alt search-icon" />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col sm="8">
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="12">
                                            {/* <BootstrapTable
                                                keyField='entryNo'
                                                data={
                                                    [
                                                        {
                                                            entryNo: 1,
                                                            DocumentNo: "0000001",
                                                            Status: "Approved",
                                                            ApproverID: "EMP001",
                                                            LastDateTimeModified: "2021-09-01T08:00:00"
                                                        },
                                                        {
                                                            entryNo: 2,
                                                            DocumentNo: "0000002",
                                                            Status: "Rejected",
                                                            ApproverID: "EMP002",
                                                            LastDateTimeModified: "2021-09-01T09:00:00"
                                                        }
                                                    ]
                                                }
                                                columns={approvalColumns} 
                                                striped
                                                hover
                                                bordered={false}
                                                noDataIndication="No Approval Entries"
                                                filter={filterFactory()}
                                                pagination={paginationFactory({ sizePerPage: 10 })}
                                                // defaultSorted={approvalsDefaultSorted}
                                                classes={"table-sm align-middle table-striped"}
                                                {...toolkitProps.baseProps}
                                            /> */}
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </ToolkitProvider>
                    </LoadingOverlayWrapper>
                </div>
                <div className="modal-footer">
                </div>
            </Modal>
            <Button color="warning" type="button" className="btn btn-warning btn-label waves-effect waves-light" onClick={handleClickApprovalEntries}>

                <HistoryIcon className="label-icon" />
                Approval History
            </Button>
        </React.Fragment>
    )
}
export default ApprovalEntries
