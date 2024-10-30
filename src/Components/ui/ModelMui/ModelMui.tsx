import React from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button,
    Grid,
    Typography,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { RiseLoader } from "react-spinners";
import Select from 'react-select';
import { Input, Label } from "reactstrap";
import { customStyles } from "../../../utils/common.ts";
import { Button as ReactstrapButton } from "reactstrap";

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        maxWidth: '90%',
        margin: theme.spacing(2),
    },
    '& .modal-header': {
        padding: theme.spacing(2),
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    '& .modal-body': {
        padding: theme.spacing(2)
    },
    '& .modal-footer': {
        padding: theme.spacing(2),
        borderTop: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'flex-end'
    }
}));

export default function ModelMui({
    title,
    isOpen,
    toggleModal,
    size = 'xl',
    isModalLoading,
    fields,
    isEdit,
    handleSubmit,
    handleUpdateLine,
}) {
    const maxWidth = size;

    return (
        <StyledDialog
            open={isOpen}
            onClose={toggleModal}
            maxWidth={maxWidth}
            fullWidth
        >
            <div className="modal-header">
                <Typography variant="subtitle1" component="h6">
                    {isEdit ? `Update ${title}` : `Add ${title}`}
                </Typography>
                <IconButton 
                    onClick={toggleModal} 
                    size="small"
                    className="close"
                >
                    <CloseIcon />
                </IconButton>
            </div>

            <div className="modal-body">
                <LoadingOverlayWrapper active={isModalLoading} spinner={<RiseLoader />} text="Please wait...">
                    {fields?.map((fieldRow, index) => (
                        <Grid container spacing={2} className="mb-2" key={index}>
                            {fieldRow?.map(({ label, type, value, disabled, onChange, options, id, rows }, idx) => (
                                <Grid item xs={12} sm={4} key={idx}>
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
                                            type={type}
                                            value={value}
                                            onChange={onChange}
                                            disabled={disabled}
                                            rows={rows}
                                        />
                                    ) : (
                                        <Input
                                            id={id}
                                            type={type}
                                            value={value}
                                            onChange={onChange}
                                            disabled={disabled}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </LoadingOverlayWrapper>
            </div>

            <div className="modal-footer">
                {isEdit ? (
                    <ReactstrapButton 
                        color="success" 
                        onClick={handleUpdateLine}
                    >
                        Update
                    </ReactstrapButton>
                ) : (
                    <ReactstrapButton 
                        color="primary" 
                        onClick={handleSubmit}
                    >
                        Submit
                    </ReactstrapButton>
                )}
            </div>
        </StyledDialog>
    );
}