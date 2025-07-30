import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Switch,
  FormControlLabel,
  FormHelperText,
  TextField,
  Box,
} from "@mui/material";
import { Button, Row } from "reactstrap";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate, useBeforeUnload } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import {
  getSetupSettings,
  updateSetupSettings,
} from "../../services/SetupServices";
import { setAllowCompanyChange } from "../../store/slices/auth/sessionSlice";
import LoadingSpinner from "../../Components/ui/LoadingSpinner";
import { ArrowBackIcon, SaveIcon } from "../../Components/common/icons/icons";
import Swal from "sweetalert2";
import "../../scss/setup.scss";
import {
  applyThemeColors,
  saveThemeColor,
  loadThemeColor,
} from "../../utils/themeUtils";

function Setup() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isBcAdmin } = useAppSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    allowCompanyChange: false,
    themeColor: "#556ee6",
    companyLogo: null as string | null,
  });
  const [initialSettings, setInitialSettings] = useState({
    allowCompanyChange: false,
    themeColor: "#556ee6",
    companyLogo: null as string | null,
  });

  const hasUnsavedChanges = React.useMemo(() => {
    return (
      initialSettings.allowCompanyChange !== settings.allowCompanyChange ||
      initialSettings.themeColor !== settings.themeColor ||
      initialSettings.companyLogo !== settings.companyLogo
    );
  }, [settings, initialSettings]);

  useEffect(() => {
    if (!isBcAdmin) {
      navigate("/");
      toast.error("Unauthorized access");
      return;
    }

    fetchSettings();
  }, [isBcAdmin, navigate]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await getSetupSettings();
      const savedThemeColor = loadThemeColor();

      const settingsData = {
        ...response.data,
        themeColor: response.data.themeColor || savedThemeColor,
        companyLogo: response.data.companyLogo || null,
      };

      setSettings(settingsData);
      setInitialSettings(settingsData);
    } catch (error) {
      toast.error("Error fetching settings");
    } finally {
      setIsLoading(false);
    }
  };

  useBeforeUnload(
    React.useCallback(
      (event) => {
        if (hasUnsavedChanges) {
          event.preventDefault();
          event.returnValue = "";
        }
      },
      [hasUnsavedChanges]
    )
  );

  const handleNavigateAway = async () => {
    if (hasUnsavedChanges) {
      const result = await Swal.fire({
        title: "Unsaved Changes",
        text: "You have unsaved changes. Are you sure you want to leave?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Leave",
        cancelButtonText: "Stay",
        confirmButtonColor: "#556ee6",
        cancelButtonColor: "#74788d",
        customClass: {
          confirmButton: "btn btn-primary fw-bold",
          cancelButton: "btn btn-light fw-bold",
        },
        buttonsStyling: false,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSettings((prev) => ({
          ...prev,
          companyLogo: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSettings((prev) => ({
      ...prev,
      companyLogo: null,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Save theme color to localStorage for immediate frontend use
      saveThemeColor(settings.themeColor);

      // Send all settings to the backend
      await updateSetupSettings({
        allowCompanyChange: settings.allowCompanyChange,
        themeColor: settings.themeColor,
        companyLogo: settings.companyLogo,
      });

      dispatch(setAllowCompanyChange(settings.allowCompanyChange));

      setInitialSettings(settings);
      toast.success("Settings updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Settings update error:", error);
      toast.error("Error updating settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="page-content setup-page">
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
        <Row className="justify-content-start mb-4">
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
                    <h5 className="card-title mb-0 me-2">Company Switching</h5>
                    <InfoIcon
                      fontSize="small"
                      className="text-muted"
                      style={{ cursor: "help" }}
                      titleAccess="Allow users to switch between companies"
                    />
                  </div>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.allowCompanyChange}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            allowCompanyChange: e.target.checked,
                          }))
                        }
                        className="custom-switch"
                      />
                    }
                    label={settings.allowCompanyChange ? "Enabled" : "Disabled"}
                  />

                  <FormHelperText className="text-muted">
                    When enabled, users can switch between different companies
                    in the system.
                  </FormHelperText>
                </div>

                <hr className="my-4" />

                {/* Theme Color Section */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="card-title mb-0 me-2">Theme Color</h5>
                    <InfoIcon
                      fontSize="small"
                      className="text-muted"
                      style={{ cursor: "help" }}
                      titleAccess="Choose the primary color theme for the application"
                    />
                  </div>

                  <Box className="d-flex align-items-center gap-3 color-picker-container">
                    <input
                      type="color"
                      value={settings.themeColor}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          themeColor: newColor,
                        }));
                        // Apply color change in real-time
                        applyThemeColors(newColor);
                        // Save to localStorage immediately
                        saveThemeColor(newColor);
                      }}
                    />
                    <TextField
                      value={settings.themeColor}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          themeColor: newColor,
                        }));
                        // Apply color change in real-time if it's a valid hex color
                        if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                          applyThemeColors(newColor);
                          // Save to localStorage immediately
                          saveThemeColor(newColor);
                        }
                      }}
                      size="small"
                      placeholder="#094BAC"
                      sx={{ width: "120px" }}
                    />
                    <Button
                      color="secondary"
                      outline
                      size="sm"
                      onClick={() => {
                        const defaultColor = "#094BAC";
                        setSettings((prev) => ({
                          ...prev,
                          themeColor: defaultColor,
                        }));
                        applyThemeColors(defaultColor);
                        // Save to localStorage immediately
                        saveThemeColor(defaultColor);
                      }}
                    >
                      Reset
                    </Button>
                  </Box>
                  <FormHelperText className="text-muted">
                    Select the primary color theme for the application
                    interface.
                  </FormHelperText>

                  {/* Color Preview */}
                  <div className="mt-3">
                    <h6 className="mb-2">Color Preview:</h6>
                    <div className="d-flex gap-2 flex-wrap">
                      <div className="d-flex flex-column align-items-center">
                        <div
                          className="rounded p-2 mb-1"
                          style={{
                            backgroundColor: settings.themeColor,
                            width: "40px",
                            height: "40px",
                            border: "1px solid #ddd",
                          }}
                        ></div>
                        <small className="text-muted">Primary</small>
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <div
                          className="rounded p-2 mb-1"
                          style={{
                            backgroundColor: settings.themeColor + "20",
                            width: "40px",
                            height: "40px",
                            border: "1px solid #ddd",
                          }}
                        ></div>
                        <small className="text-muted">Light</small>
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <div
                          className="rounded p-2 mb-1"
                          style={{
                            backgroundColor: settings.themeColor + "40",
                            width: "40px",
                            height: "40px",
                            border: "1px solid #ddd",
                          }}
                        ></div>
                        <small className="text-muted">Medium</small>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Company Logo Section */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="card-title mb-0 me-2">Company Logo</h5>
                    <InfoIcon
                      fontSize="small"
                      className="text-muted"
                      style={{ cursor: "help" }}
                      titleAccess="Upload or change the company logo"
                    />
                  </div>

                  <div className="mb-3">
                    {settings.companyLogo ? (
                      <div className="d-flex align-items-center gap-3 mb-3 logo-preview">
                        <img src={settings.companyLogo} alt="Company Logo" />
                        <Button
                          color="danger"
                          size="sm"
                          onClick={handleRemoveImage}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center p-4 logo-upload-area">
                        <p className="text-muted mb-2">No logo uploaded</p>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      color="primary"
                      outline
                      size="sm"
                      onClick={() =>
                        document.getElementById("logo-upload")?.click()
                      }
                    >
                      Upload Logo
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                  <FormHelperText className="text-muted">
                    Upload a company logo (PNG, JPG, SVG). Maximum size: 5MB.
                  </FormHelperText>
                </div>

                {/* Save Button at Bottom of Card */}
                <div className="d-flex justify-content-end mt-4">
                  <Button
                    color="primary"
                    className="btn btn-label"
                    onClick={handleSubmit}
                  >
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
                <h5 className="card-title mb-3">Settings Information</h5>
                <p className="card-text text-muted mb-3">
                  These settings control core system functionality. Changes made
                  here will affect all users of the system. Please ensure you
                  understand the implications before making changes.
                </p>
                <hr className="my-3" />
                <h6 className="mb-2">Access Control</h6>
                <p className="card-text text-muted mb-0">
                  Only Business Central Administrators can modify these
                  settings. All changes are logged and audited for security
                  purposes.
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
