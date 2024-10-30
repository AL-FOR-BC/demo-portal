import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { RiseLoader } from "react-spinners";
import { TableComponentProps } from "../../../@types/ui.dto";
import { 
  ArrowRightIcon, 
  FormatListCheckbox, 
  PlusIcon, 
  SearchIcon 
} from "../../common/icons/icons";
import CustomPagination from './CustomPagination';

// Import required CSS
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import "flatpickr/dist/themes/material_blue.css";

const TableComponent: React.FC<TableComponentProps> = ({
    isLoading,
    data,
    columns,
    title,
    subTitle,
    addLink,
    addLabel,
    noDataMessage,
}) => {
    const paginationConfig = CustomPagination({
        sizePerPage: 10,
        showTotal: true,
        paginationSize: 5,
        hidePageListOnlyOnePage: true
    });

    return (
        <LoadingOverlayWrapper 
            active={isLoading} 
            spinner={<RiseLoader />} 
            text="Please wait..."
        >
            <div className="page-content">
                <Container fluid={true}>
                    <h4 className="page-title">{title}</h4>
                    <p className="page-sub-title">{subTitle}</p>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    {data && data.length > 0 ? (
                                        <ToolkitProvider 
                                            keyField="systemId" 
                                            data={data} 
                                            columns={columns} 
                                            search
                                        >
                                            {(toolkitProps) => (
                                                <>
                                                    <Row className="mb-2">
                                                        <Col sm="4">
                                                            <div className="search-box me-2 mb-2 d-inline-block">
                                                                <div className="position-relative">
                                                                    <SearchIcon className="search-icon" />
                                                                </div>
                                                            </div>
                                                        </Col>
                                                        <Col sm="8">
                                                            <div className="text-sm-end">
                                                                <Link 
                                                                    className="btn btn-primary btn-label" 
                                                                    to={addLink}
                                                                >
                                                                    <PlusIcon className="label-icon" />
                                                                    {addLabel}
                                                                </Link>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col xl="12">
                                                            <BootstrapTable
                                                                striped
                                                                hover
                                                                condensed
                                                                bordered={false}
                                                                noDataIndication="No Records"
                                                                {...toolkitProps.baseProps}
                                                                classes="table-sm align-middle table-striped"
                                                                filter={filterFactory()}
                                                                pagination={paginationConfig}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </>
                                            )}
                                        </ToolkitProvider>
                                    ) : (
                                        <div className="text-center">
                                            <div className="avatar-md mx-auto mb-3 mt-1">
                                                <span className="avatar-title rounded-circle bg-soft border bg-primary primary text-primary font-size-16">
                                                    <FormatListCheckbox />
                                                </span>
                                            </div>
                                            <div>
                                                <h6>{noDataMessage}</h6>
                                            </div>
                                            <div className="text-center mt-4">
                                                <Link 
                                                    to={addLink} 
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    {addLabel}
                                                    <ArrowRightIcon className="mdi mdi-arrow-right ms-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </LoadingOverlayWrapper>
    );
};

export default TableComponent;