import React from 'react';
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { RiseLoader } from "react-spinners";
import { Button,  Col, Input, Label, Modal, Row } from "reactstrap";

import "flatpickr/dist/themes/material_blue.css";

import Select from 'react-select';
import { GroupBase } from 'react-select';

import { customStyles } from "../../../utils/common.ts";


interface ModelProps {
    title: string;
    isOpen: boolean;
    toggleModal: () => void;
    size?: string;
    isModalLoading: boolean;
    fields: {
        label: string;
        type: React.InputHTMLAttributes<HTMLInputElement>['type'] | 'select' | 'textarea';
        value: string;
        disabled: boolean;
        onChange: (value: any) => void;
        options?: readonly (string | GroupBase<string>)[];
        id: string;
        rows?: number;
    }[][];
    isEdit: boolean;
    handleSubmit: () => void;
    handleUpdateLine: () => void;
}

export default function Model({
    title,
    isOpen,
    toggleModal,
    size = 'xl',
    isModalLoading,
    fields,
    isEdit,
    handleSubmit,
    handleUpdateLine,
}: ModelProps) {
    return (
        <>
            <Modal isOpen={isOpen} toggle={toggleModal} size={size} centered backdrop={'static'}>
                <div className="modal-header">
                    <h6 className="modal-title mt-0" id="myModalLabel">
                        {isEdit ? `Update ${title}` : `Add ${title}`}
                    </h6>
                    <button
                        type="button"
                        onClick={() => {
                            toggleModal();
                        }}
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <LoadingOverlayWrapper active={isModalLoading} spinner={<RiseLoader />} text="Please wait...">
                        {fields?.map((fieldRow, index) => (
                            <Row className="mb-2" key={index}>
                                {fieldRow?.map(({ label, type, value, disabled, onChange, options, id, rows }, idx) => (
                                    <Col sm={4} key={idx}>
                                        <Label htmlFor={id}>{label}</Label>
                                        {type === 'select' ? (
                                            <Select
                                                styles={customStyles}
                                                id={id}
                                                value={value}
                                                onChange={(newValue) => onChange(newValue)}
                                                options={options}
                                                isDisabled={disabled}
                                                isSearchable
                                            />
                                        ) : type === 'textarea' ? (
                                            <Input
                                                id={id}
                                                type={type as any}
                                                value={value}
                                                onChange={onChange}
                                                disabled={disabled}
                                                rows={rows}
                                            />
                                        ) : (
                                            <Input
                                                id={id}
                                                type={type as any}  
                                                value={value}
                                                onChange={onChange}
                                                disabled={disabled}
                                            />
                                        )}
                                    </Col>
                                ))}
                            </Row>
                        ))}
                    </LoadingOverlayWrapper>
                </div>
                <div className="modal-footer">
                    {isEdit ? (
                        <>
                            <Button color="success" onClick={handleUpdateLine}>
                                Update
                            </Button>
                        </>
                    ) : (
                        <Button color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    )}
                </div>
            </Modal>
        </>
    );
}
