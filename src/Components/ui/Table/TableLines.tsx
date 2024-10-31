import {
    Row,
    Col,
   
} from "reactstrap"
import { Link } from "react-router-dom"
import "flatpickr/dist/themes/material_blue.css";
// import Breadcrumbs from "../../components/Common/Breadcrumb";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import filterFactory from 'react-bootstrap-table2-filter';
import React from "react";
import paginationFactory from 'react-bootstrap-table2-paginator';
// import paginationFactory from 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';

import Model from "../Model/Model";
import { closeModalPurchaseReq, editPurchaseReqLine, openModalPurchaseReq, openModalRequisition } from "../../../store/slices/Requisitions";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { PlusIcon, SearchIcon } from "../../common/icons/icons";
interface TableLinesComponentProps {
    isLoading: boolean;
    data: any[];
    columns: any[];
    title: string;
    subTitle: string;
    breadcrumbItem: string;
    addLink: string;
    addLabel: string;
    noDataMessage: string;
    iconClassName: string;
    status: string;
    modelFields: any[];
    handleSubmitLines: () => void;
    handleDeleteLines: () => void;
    handleSubmitUpdateLines: () => void;
    clearLineFields: () => void;
    handleValidateHeaderFields: () => boolean;
    handleSubmitUpdatedLine: () => void;
}
const TableLinesComponent: React.FC<TableLinesComponentProps> = ({
    // isLoading,
    data,
    columns,
    status,
    modelFields,
    handleSubmitLines,
    // handleDeleteLines,
    clearLineFields,
    handleSubmitUpdatedLine,
    handleValidateHeaderFields
}) => {
    // const { SearchBar } = Search;
    // const defaultSorted = [{
    //     dataField: 'SystemId',
    //     order: 'asc'
    // }];
    const { isModalRequisitionLoading, isEdit, isModalRequisition } = useAppSelector((state) => state.purchaseRequisition.purchaseRequisition);
    const dispatch = useAppDispatch();

    const [isModelOpenNw, setIsModelOpenNw] = React.useState(false);

    const toggleModel = () => {
        if (handleValidateHeaderFields()) {
            console.log("validate header fields")
            console.log(handleValidateHeaderFields())
            setIsModelOpenNw(!isModelOpenNw);
            if (isModelOpenNw) {
                dispatch(openModalRequisition())

            } else {
                clearLineFields();
                dispatch(closeModalPurchaseReq())
                dispatch(editPurchaseReqLine(false))
            }
        }
    }
    return (
        <>

            <Model
                isOpen={isModalRequisition}
                toggleModal={toggleModel}
                isEdit={isEdit}
                title="Requisition Line"
                isModalLoading={isModalRequisitionLoading}
                fields={modelFields}
                handleSubmit={handleSubmitLines}
                handleUpdateLine={handleSubmitUpdatedLine}

            />

            <ToolkitProvider keyField="systemId" data={data} columns={columns} search>
                {(toolkitProps) => (
                    <React.Fragment>
                        <Row className="mb-2">
                            <Col sm="4">
                                <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                        {/*<SearchBar {...toolkitProps.searchProps} />*/}
                                        {/* <i className="bx bx-search-alt search-icon" /> */}
                                        <SearchIcon className="search-icon" />
                                    </div>
                                </div>
                            </Col>

                            <Col sm="8">
                                {(status == 'Open') && (
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
                        <Row>
                            <Col xl="12">
                                <BootstrapTable
                                    // keyField="id"
                                    // data={data}
                                    // columns={columns}
                                    striped
                                    hover
                                    condensed
                                    pagination={paginationFactory({sizePerPage: 10})}
                                    filter={filterFactory()}
                                    bordered={false}
                                    noDataIndication="No Records"
                                    // defaultSorted={defaultSorted}
                                    classes={"table-sm align-middle table-striped"}
                                    {...toolkitProps.baseProps}
                                />
                                {/*<BootstrapTable />*/}
                            </Col>
                        </Row>
                    </React.Fragment>
                )}
            </ToolkitProvider>
        </>

    );
};

export default TableLinesComponent;
