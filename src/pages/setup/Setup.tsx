import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    Container,
    Grid,
    Switch,
    FormControlLabel,
    FormHelperText
} from '@mui/material';
import { Button, Row } from 'reactstrap';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate, useBeforeUnload } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../../store/hook';
import { getSetupSettings, updateSetupSettings } from '../../services/SetupServices';
import { setAllowCompanyChange } from '../../store/slices/auth/sessionSlice';
import LoadingSpinner from '../../Components/ui/LoadingSpinner';
import { ArrowBackIcon, SaveIcon } from '../../Components/common/icons/icons';
import Swal from 'sweetalert2';

function Setup() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isBcAdmin } = useAppSelector(state => state.auth.user);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        allowCompanyChange: false
    });
    const [initialSettings, setInitialSettings] = useState({
        allowCompanyChange: false
    });

    const hasUnsavedChanges = React.useMemo(() => {
        return initialSettings.allowCompanyChange !== settings.allowCompanyChange;
    }, [settings, initialSettings]);

    useEffect(() => {
        if (!isBcAdmin) {
            navigate('/');
            toast.error('Unauthorized access');
            return;
        }

        fetchSettings();
    }, [isBcAdmin, navigate]);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const response = await getSetupSettings();
            setSettings(response.data);
            setInitialSettings(response.data);
        } catch (error) {
            toast.error('Error fetching settings');
        } finally {
            setIsLoading(false);
        }
    };

    useBeforeUnload(
        React.useCallback(
            (event) => {
                if (hasUnsavedChanges) {
                    event.preventDefault();
                    event.returnValue = '';
                }
            },
            [hasUnsavedChanges]
        )
    );

    const handleNavigateAway = async () => {
        if (hasUnsavedChanges) {
            const result = await Swal.fire({
                title: 'Unsaved Changes',
                text: 'You have unsaved changes. Are you sure you want to leave?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Leave',
                cancelButtonText: 'Stay',
                confirmButtonColor: '#556ee6',
                cancelButtonColor: '#74788d',
                customClass: {
                    confirmButton: 'btn btn-primary fw-bold',
                    cancelButton: 'btn btn-light fw-bold'
                },
                buttonsStyling: false
            });

            if (result.isConfirmed) {
                return true;
            }
            return false;
        }
        return true;
    };

    const handleBack = async () => {
        const canNavigate = await handleNavigateAway();
        if (canNavigate) {
            navigate(-1);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            await updateSetupSettings(settings);
            dispatch(setAllowCompanyChange(settings.allowCompanyChange));
            setInitialSettings(settings);
            toast.success('Settings updated successfully');
            navigate('/');
        } catch (error) {
            toast.error('Error updating settings');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="page-content">
            <Container maxWidth="lg">
                {/* Page Title */}
                <div className="page-title-box">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h6 className="page-title">Settings</h6>
                            <ol className="breadcrumb m-0">
                                <li className="breadcrumb-item">
                                    <a href="#">Home</a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    System Settings
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Back Button Only */}
                <Row className='justify-content-start mb-4'>
                    <div className="d-flex flex-wrap">
                        <Button 
                            color="secondary" 
                            className="btn btn-label" 
                            onClick={handleBack}
                        >
                            <i className="label-icon">
                                <ArrowBackIcon className="label-icon" />
                            </i>
                            Back
                        </Button>
                    </div>
                </Row>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <div className="mb-4">
                                    <div className="d-flex align-items-center mb-2">
                                        <h5 className="card-title mb-0 me-2">
                                            Company Switching
                                        </h5>
                                        <InfoIcon
                                            fontSize="small"
                                            className="text-muted"
                                            style={{ cursor: 'help' }}
                                            titleAccess="Allow users to switch between companies"
                                        />
                                    </div>

                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.allowCompanyChange}
                                                onChange={(e) => setSettings(prev => ({
                                                    ...prev,
                                                    allowCompanyChange: e.target.checked
                                                }))}
                                                className="custom-switch"
                                            />
                                        }
                                        label={settings.allowCompanyChange ? 'Enabled' : 'Disabled'}
                                    />

                                    <FormHelperText className="text-muted">
                                        When enabled, users can switch between different companies in the system.
                                    </FormHelperText>
                                </div>

                                {/* Save Button at Bottom of Card */}
                                <div className="d-flex justify-content-end mt-4">
                                    <Button color="primary" className="btn btn-label" onClick={handleSubmit}>
                                        <i className="label-icon">
                                            <SaveIcon className="label-icon" />
                                        </i>
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card className="bg-light">
                            <CardContent>
                                <h5 className="card-title mb-3">
                                    Settings Information
                                </h5>
                                <p className="card-text text-muted mb-3">
                                    These settings control core system functionality. Changes made here
                                    will affect all users of the system. Please ensure you understand
                                    the implications before making changes.
                                </p>
                                <hr className="my-3" />
                                <h6 className="mb-2">Access Control</h6>
                                <p className="card-text text-muted mb-0">
                                    Only Business Central Administrators can modify these settings.
                                    All changes are logged and audited for security purposes.
                                </p>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default Setup;
