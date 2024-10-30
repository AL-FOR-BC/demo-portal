import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { RiseLoader } from "react-spinners";
import { Alert, Button, Card, CardBody, Col, Collapse, Container, Input, Label, Row } from "reactstrap";
import React from "react";
import BreadCrumbs from "../../BreadCrumbs.tsx";
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr"
import Select from 'react-select';
import classNames from "classnames";
import { ArrowBackIcon, CancelIcon, DeleteIcon, SaveIcon, SendIcon } from "../../common/icons/icons.tsx";
import ApprovalEntries from "../../common/ApprovalEntry.tsx";
// import EditAbleLines from "../Lines/LinesEditable.tsx";
import { GridColDef } from "@mui/x-data-grid";



interface HeaderProps {
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
    editableLines?: boolean
    onBlur?: () => void
    columns?: GridColDef[]
    rowLines?: any
    handleSubmitLines?: (data: any, id: string) => void
}

const Header = ({
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
    // columns,
    // rowLines,
    // handleSubmitLines

    // buttons = [], // Additional buttons
}: HeaderProps) => {
    const [generalTab, setGeneralTab] = React.useState(true);
    const toggleGeneral = () => setGeneralTab(!generalTab);
    return (
        <LoadingOverlayWrapper active={isLoading} spinner={<RiseLoader />} text='Please wait...'>
            <>
                <React.Fragment>
                    <div className="page-content">
                        <Container fluid={true}>
                            <BreadCrumbs title={title} subTitle={subtitle} breadcrumbItem={breadcrumbItem} />

                            {
                                pageType === 'add' && (

                                    <Row className='justify-content-center mb-4'>
                                        <div className="d-flex flex-wrap gap-2">
                                            <Button color="secondary" className="btn  btn-label" onClick={handleBack}>
                                                <i className="label-icon">
                                                    <ArrowBackIcon className="label-icon" />
                                                </i>

                                                Back
                                            </Button>
                                            <Button color="primary" className="btn  btn-label" onClick={handleSubmit}>
                                                <i className="label-icon">
                                                    <SaveIcon className="label-icon" />
                                                </i>

                                                Create Request
                                            </Button>

                                        </div>
                                    </Row>
                                )}

                            {
                                pageType === 'detail' && (
                                    <>
                                        {(status == 'Open') && (
                                            <>
                                                <Row className='justify-content-center mb-4'>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <Button color="secondary" className="btn  btn-label" onClick={handleBack}>
                                                            <i className="label-icon">
                                                                <ArrowBackIcon className="label-icon" />
                                                            </i>

                                                            Back
                                                        </Button>
                                                        <Button color="primary" type="button" className="btn btn-primary btn-label" onClick={handleSendApprovalRequest}>

                                                            <SendIcon className="label-icon" />
                                                            Send Approval Request
                                                        </Button>

                                                        <ApprovalEntries
                                                            defaultCompany={companyId}
                                                            docType={documentType}
                                                            docNo={requestNo}
                                                        />

                                                        <Button color="danger" type="button" className="btn btn-danger btn-label waves-effect waves-light" onClick={handleDeletePurchaseRequisition}>
                                                            <DeleteIcon className="bx bx-trash label-icon" style={{
                                                                padding: "8px"
                                                            }} />
                                                            Delete Request
                                                        </Button>
                                                    </div>
                                                </Row>
                                            </>
                                        )}
                                        {(status == 'Pending Approval') && (
                                            <>
                                                <Row className='justify-content-center mb-4'>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <Button color="secondary" className="btn  btn-label" onClick={handleBack}>
                                                            <i className="label-icon">
                                                                <ArrowBackIcon className="label-icon" />
                                                            </i>

                                                            Back
                                                        </Button>
                                                        <Button color="danger" type="button" className="btn btn-danger btn-label" onClick={handleCancelApprovalRequest}>
                                                            Cancel Approval Request
                                                            <CancelIcon className="label-icon"

                                                            />
                                                        </Button>

                                                        <ApprovalEntries
                                                            defaultCompany={companyId}
                                                            docType={documentType}
                                                            docNo={requestNo}
                                                        />
                                                    </div>
                                                </Row>
                                            </>
                                        )}
                                        {(status == 'Approved') && (
                                            <>
                                                <Row className='justify-content-center mb-4'>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        <Button color="secondary" className="btn  btn-label" onClick={handleBack}>
                                                            <i className="label-icon">
                                                                <ArrowBackIcon className="label-icon" />
                                                            </i>

                                                            Back
                                                        </Button>

                                                        <ApprovalEntries
                                                            defaultCompany={companyId}
                                                            docType={documentType}
                                                            docNo={requestNo}
                                                        />
                                                    </div>
                                                </Row>

                                            </>
                                        )}
                                    </>
                                )
                            }
                            {/* //     <ApprovalEntries defaultCompany={userObj.default_company} docType={documentType} docNo={purchaseRequisition.no} />
                                    <ApprovalComments defaultCompany={userObj.default_company} docType={documentType} docNo={purchaseRequisition.no} />
                                //     <Attachments defaultCompany={userObj.default_company} docType={documentType} docNo={purchaseRequisition.no} ehub_username={userObj.ehub_username} ehub_pass={userObj.ehub_pass} status={purchaseRequisition.status} tableId={'51402104'} check_attachment={true} />
                                // )} */}
                            {/* 
                            <ApprovalEntries
                                defaultCompany={companyId}
                                docType={documentType}
                                docNo={requestNo}
                            /> */}
                            {/* <ApprovalComments
                                defaultCompany={companyId}
                                docType={documentType}
                                docNo={requestNo}
                            /> */}

                            {showError && (
                                <Row>
                                    <Alert color='danger' isOpen={showError} toggle={toggleError}>
                                        <i className="mdi mdi-block-helper me-2"></i>
                                        {docError}
                                    </Alert>
                                </Row>
                            )}
                            <Row>
                                <Card>
                                    <CardBody>
                                        <div>
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
                                                    <Collapse
                                                        isOpen={generalTab}
                                                        className="accordion-collapse"
                                                    >
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
                                                                                        // disabled={disabled}
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
                                                    {editableLines ? (
                                                        <>
                                                            {/* <EditAbleLines columns={columns} rowLines={rowLines} documentType={documentType}
                                                                handleSubmitLines={handleSubmitLines}

                                                            /> */}
                                                        </>) :
                                                        lines
                                                    }
                                                    {/* {lines} */}

                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Row>
                        </Container>
                    </div>
                </React.Fragment>
            </>
        </LoadingOverlayWrapper >
    );
};

export default Header;
{/* 
{fields.map((field, index) => (
                                            <Row className='mb-2' key={index}>
                                                {field.map(({ label, type, value, disabled, onChange, options, id, rows }, idx) => (
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
                                                            />
                                                        ) : (
                                                            <Input
                                                                type={type}
                                                                value={value}
                                                                disabled={disabled}
                                                                onChange={onChange}
                                                                rows={rows}
                                                                id={id}
                                                            />
                                                        )}
                                                    </Col>
                                                ))}
                                            </Row>
                                        ))} */}