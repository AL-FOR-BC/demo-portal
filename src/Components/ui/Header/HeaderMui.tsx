import React from "react";
import { RiseLoader } from "react-spinners";
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import {
  Box,
  Container,
  Alert as MuiAlert,
  Card,
  CardContent,
} from "@mui/material";
import Select from 'react-select';
import { GridColDef } from "@mui/x-data-grid";
import BreadCrumbs from "../../BreadCrumbs";
import ApprovalEntries from "../../common/ApprovalEntry";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { ArrowBackIcon, CancelIcon, DeleteIcon, SaveIcon, SendIcon } from "../../common/icons/icons";
import classNames from "classnames";
import { Button, Row, Col, Collapse, Input, Label } from "reactstrap";

interface HeaderMuiProps {
    title: string;
    subtitle: string;
    breadcrumbItem: string;
    fields: any[];
    isLoading: boolean;
    showError?: boolean;
    docError?: string;
    toggleError?: () => void;
    handleBack?: () => void;
    handleSubmit?: () => void;
    handleSendApprovalRequest?: () => void;
    handleDeletePurchaseRequisition?: () => void;
    handleCancelApprovalRequest?: () => void;
    lines?: React.ReactNode;
    status?: string;
    buttons?: {
        label: string;
        color: string;
        icon: string;
        onClick: () => void;
    }[];
    pageType?: string;
    companyId?: string;
    documentType?: string;
    requestNo?: string;
    editableLines?: boolean;
    onBlur?: () => void;
    columns?: GridColDef[];
    rowLines?: any;
    handleSubmitLines?: (data: any, id: string) => void;
}

const HeaderMui: React.FC<HeaderMuiProps> = (props) => {
    const [generalTab, setGeneralTab] = React.useState(true);
    const toggleGeneral = () => setGeneralTab(!generalTab);

    const {
        title,
        subtitle,
        breadcrumbItem,
        fields,
        isLoading,
        showError,
        docError,
        toggleError,
        handleBack,
        handleSubmit,
        pageType,
        handleSendApprovalRequest,
        handleDeletePurchaseRequisition,
        handleCancelApprovalRequest,
        lines,
        status,
        companyId,
        documentType,
        requestNo,
        editableLines,
    } = props;

    return (
        <LoadingOverlayWrapper active={isLoading} spinner={<RiseLoader />} text='Please wait...'>
            <div className="page-content">
                <Container fluid={true}>
                    <BreadCrumbs title={title} subTitle={subtitle} breadcrumbItem={breadcrumbItem} />

                    {pageType === 'add' && (
                        <Row className='justify-content-center mb-4'>
                            <div className="d-flex flex-wrap gap-2">
                                <Button color="secondary" className="btn btn-label" onClick={handleBack}>
                                    <i className="label-icon">
                                        <ArrowBackIcon className="label-icon" />
                                    </i>
                                    Back
                                </Button>
                                <Button color="primary" className="btn btn-label" onClick={handleSubmit}>
                                    <i className="label-icon">
                                        <SaveIcon className="label-icon" />
                                    </i>
                                    Create Request
                                </Button>
                            </div>
                        </Row>
                    )}

                    {pageType === 'detail' && (
                        <>
                            {status === 'Open' && (
                                <Row className='justify-content-center mb-4'>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Button color="secondary" className="btn btn-label" onClick={handleBack}>
                                            <i className="label-icon">
                                                <ArrowBackIcon className="label-icon" />
                                            </i>
                                            Back
                                        </Button>
                                        <Button color="primary" className="btn btn-label" onClick={handleSendApprovalRequest}>
                                            <SendIcon className="label-icon" />
                                            Send Approval Request
                                        </Button>
                                        <ApprovalEntries
                                            defaultCompany={companyId}
                                            docType={documentType}
                                            docNo={requestNo}
                                        />
                                        <Button color="danger" className="btn btn-label" onClick={handleDeletePurchaseRequisition}>
                                            <DeleteIcon className="label-icon" style={{ padding: "8px" }} />
                                            Delete Request
                                        </Button>
                                    </div>
                                </Row>
                            )}
                            {/* ... Other status conditions remain the same ... */}
                        </>
                    )}

                    {showError && (
                        <Row>
                            <MuiAlert severity="error" onClose={toggleError} className="mb-2">
                                <i className="mdi mdi-block-helper me-2"></i>
                                {docError}
                            </MuiAlert>
                        </Row>
                    )}

                    <Row>
                        <Card>
                            <CardContent>
                                <div className="accordion accordion-flush" id="accordionFlushContainer">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingGeneral">
                                            <button
                                                className={classNames(
                                                    "accordion-button",
                                                    "fw-medium",
                                                    { collapsed: !generalTab }
                                                )}
                                                type="button"
                                                onClick={toggleGeneral}
                                                style={{ cursor: "pointer" }}
                                            >
                                                General
                                            </button>
                                        </h2>
                                        <Collapse isOpen={generalTab} className="accordion-collapse">
                                            <div className="accordion-body">
                                                <Row>
                                                    {fields.map((field, index) => (
                                                        <Row className='mb-2' key={index}>
                                                            {field.map(({ label, type, value, disabled, onChange, options, id, rows, onBlur }, idx) => (
                                                                <Col sm={3} key={idx}>
                                                                    <Label htmlFor={id}>{label}</Label>
                                                                    {type === 'select' ? (
                                                                        <Select
                                                                            options={options}
                                                                            isDisabled={disabled}
                                                                            value={value}
                                                                            onChange={onChange}
                                                                            id={id}
                                                                            classNamePrefix="select"
                                                                            isSearchable={true}
                                                                            onBlur={onBlur}
                                                                        />
                                                                    ) : type === 'date' ? (
                                                                        <Flatpickr
                                                                            className="form-control"
                                                                            value={value}
                                                                            disabled={disabled}
                                                                            onChange={onChange}
                                                                            options={{
                                                                                dateFormat: "Y-m-d",
                                                                            }}
                                                                            id={id}
                                                                            onBlur={onBlur}
                                                                        />
                                                                    ) : (
                                                                        <Input
                                                                            type={type}
                                                                            value={value}
                                                                            disabled={disabled}
                                                                            onChange={onChange}
                                                                            rows={rows}
                                                                            id={id}
                                                                            onBlur={onBlur}
                                                                        />
                                                                    )}
                                                                </Col>
                                                            ))}
                                                        </Row>
                                                    ))}
                                                </Row>
                                            </div>
                                        </Collapse>
                                        {editableLines ? null : lines}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Row>
                </Container>
            </div>
        </LoadingOverlayWrapper>
    );
};

export default HeaderMui;