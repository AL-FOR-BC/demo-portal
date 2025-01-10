import {
    Dialog,
    Grid,
    Typography,
    IconButton,
    Breakpoint
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import LoadingOverlayWrapper from "react-loading-overlay-ts";
import { RiseLoader } from "react-spinners";
import Select from 'react-select';
import { Input, Label, Button as ReactstrapButton } from "reactstrap";
import { customStyles } from "../../../utils/common.ts";
import { useState } from 'react';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

interface ModelMuiProps {
    title: string;
    isOpen: boolean;
    toggleModal: () => void;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    isModalLoading?: boolean;
    fields: any[];
    isEdit?: boolean;
    handleSubmit?: () => void;
    handleUpdateLine?: () => void;
}

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

const ModelMui: React.FC<ModelMuiProps> = ({
    title,
    isOpen,
    toggleModal,
    size = 'xl',
    isModalLoading = false,
    fields,
    isEdit = false,
    handleSubmit,
    handleUpdateLine,
}) => {
    const maxWidth = size as Breakpoint;

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmitWithLoading = async () => {
        if (handleSubmit) {
            setIsSubmitting(true)
            try {
                await handleSubmit()
            } finally {
                setIsSubmitting(false)
            }
        }
    }

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
                        onClick={handleSubmitWithLoading}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </ReactstrapButton>
                )}
            </div>
        </StyledDialog>
    );
};

export default ModelMui;