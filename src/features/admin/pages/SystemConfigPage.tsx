import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormHelperText } from "@mui/material";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useBeforeUnload, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../Components/ui/LoadingSpinner";
import {
  applyThemeColors,
  saveThemeColor,
  updateFavicon,
} from "../../../utils/themeUtils";
import {
  clearSystemConfigSession,
  isSystemConfigSessionActive,
} from "../../auth/utils/systemConfigAuth";
import {
  fetchAppSetupConfig,
  updateAppSetupConfig,
  fetchBcConfig,
  updateBcConfig,
  fetchEnvironmentConfig,
  updateEnvironmentConfig,
  fetchProjectSetupConfig,
  updateProjectSetupConfig,
  fetchProjectSetups,
  updateProjectSetup,
  AppSetupConfig,
  BcConfigPayload,
  EnvironmentConfigPayload,
  ProjectSetupConfig,
} from "../services/adminConfigService";

type SetupSettingsState = {
  allowCompanyChange: boolean;
  themeColor: string;
  companyLogo: string | null;
  favicon: string | null;
  shortcutDimCode1: string;
  shortcutDimCode2: string;
};

const defaultSetupSettings: SetupSettingsState = {
  allowCompanyChange: false,
  themeColor: "#094BAC",
  companyLogo: null,
  favicon: null,
  shortcutDimCode1: "",
  shortcutDimCode2: "",
};

const defaultAppSetup: AppSetupConfig = {
  baseUrl: "",
  defaultCompany: "",
  ehubUsername: "",
  ehubPassword: "",
};

const defaultBcConfig: BcConfigPayload = {
  tenant: "",
  clientId: "",
  clientSecret: "",
  url: "",
  email: "",
  password: "",
};

const defaultEnvironmentConfig: EnvironmentConfigPayload = {
  environmentType: "",
  frontendBasePath: "",
};

const SystemConfigPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef < HTMLInputElement | null > (null);
  const faviconInputRef = useRef < HTMLInputElement | null > (null);

  const [isLoading, setIsLoading] = useState(true);
  const [savingSection, setSavingSection] = useState < string | null > (null);
  const [projectSavingId, setProjectSavingId] = useState < string | null > (null);

  const [setupSettings, setSetupSettings] =
    useState < SetupSettingsState > (defaultSetupSettings);
  const [initialSetupSettings, setInitialSetupSettings] =
    useState < SetupSettingsState > (defaultSetupSettings);
  const [appSetup, setAppSetup] = useState < AppSetupConfig > (defaultAppSetup);
  const [initialAppSetup, setInitialAppSetup] =
    useState < AppSetupConfig > (defaultAppSetup);
  const [bcConfig, setBcConfig] = useState < BcConfigPayload > (defaultBcConfig);
  const [initialBcConfig, setInitialBcConfig] =
    useState < BcConfigPayload > (defaultBcConfig);
  const [environmentConfig, setEnvironmentConfig] =
    useState < EnvironmentConfigPayload > (defaultEnvironmentConfig);
  const [initialEnvironmentConfig, setInitialEnvironmentConfig] =
    useState < EnvironmentConfigPayload > (defaultEnvironmentConfig);
  const [projectSetups, setProjectSetups] = useState < ProjectSetupConfig[] > ([]);
  const [initialProjectSetups, setInitialProjectSetups] = useState <
    ProjectSetupConfig[]
    > ([]);

  const loadConfigurations = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        setupResponse,
        appSetupResponse,
        bcResponse,
        environmentResponse,
        projectSetupResponse,
      ] = await Promise.all([
        fetchProjectSetupConfig(),
        fetchAppSetupConfig(),
        fetchBcConfig(),
        fetchEnvironmentConfig(),
        fetchProjectSetups(),
      ]);

      const setupData: SetupSettingsState = {
        allowCompanyChange: setupResponse.data.allowCompanyChange ?? false,
        themeColor: setupResponse.data.themeColor || "#094BAC",
        companyLogo: setupResponse.data.companyLogo || null,
        favicon: setupResponse.data.favicon || null,
        shortcutDimCode1: setupResponse.data.shortcutDimCode1 || "",
        shortcutDimCode2: setupResponse.data.shortcutDimCode2 || "",
      };

      setSetupSettings(setupData);
      setInitialSetupSettings(setupData);
      setAppSetup(appSetupResponse.data || defaultAppSetup);
      setInitialAppSetup(appSetupResponse.data || defaultAppSetup);
      setBcConfig(bcResponse.data || defaultBcConfig);
      setInitialBcConfig(bcResponse.data || defaultBcConfig);
      setEnvironmentConfig(environmentResponse.data || defaultEnvironmentConfig);
      setInitialEnvironmentConfig(
        environmentResponse.data || defaultEnvironmentConfig
      );
      setProjectSetups(projectSetupResponse.data || []);
      setInitialProjectSetups(projectSetupResponse.data || []);

      if (setupData.themeColor) {
        applyThemeColors(setupData.themeColor);
        saveThemeColor(setupData.themeColor);
      }
      if (setupData.favicon) {
        updateFavicon(setupData.favicon);
      }
    } catch (error) {
      console.error("Error loading config:", error);
      toast.error("Failed to load configuration data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSystemConfigSessionActive()) {
      setIsLoading(false);
      toast.info("Enter the admin PIN to access system configuration");
      navigate("/system-config/login", {
        replace: true,
        state: { from: location.pathname },
      });
      return;
    }

    loadConfigurations();
  }, [navigate, loadConfigurations, location.pathname]);

  const hasUnsavedSetupChanges = useMemo(() => {
    return (
      initialSetupSettings.allowCompanyChange !== setupSettings.allowCompanyChange ||
      initialSetupSettings.themeColor !== setupSettings.themeColor ||
      initialSetupSettings.companyLogo !== setupSettings.companyLogo ||
      initialSetupSettings.favicon !== setupSettings.favicon ||
      initialSetupSettings.shortcutDimCode1 !== setupSettings.shortcutDimCode1 ||
      initialSetupSettings.shortcutDimCode2 !== setupSettings.shortcutDimCode2
    );
  }, [initialSetupSettings, setupSettings]);

  const hasUnsavedAppSetupChanges = useMemo(() => {
    return JSON.stringify(initialAppSetup) !== JSON.stringify(appSetup);
  }, [initialAppSetup, appSetup]);

  const hasUnsavedBcChanges = useMemo(() => {
    return JSON.stringify(initialBcConfig) !== JSON.stringify(bcConfig);
  }, [initialBcConfig, bcConfig]);

  const hasUnsavedEnvironmentChanges = useMemo(() => {
    return (
      JSON.stringify(initialEnvironmentConfig) !==
      JSON.stringify(environmentConfig)
    );
  }, [initialEnvironmentConfig, environmentConfig]);

  const hasUnsavedProjectChanges = useMemo(() => {
    return JSON.stringify(initialProjectSetups) !== JSON.stringify(projectSetups);
  }, [initialProjectSetups, projectSetups]);

  const hasUnsavedChanges =
    hasUnsavedSetupChanges ||
    hasUnsavedAppSetupChanges ||
    hasUnsavedBcChanges ||
    hasUnsavedEnvironmentChanges ||
    hasUnsavedProjectChanges;

  useBeforeUnload(
    useCallback(
      (event) => {
        if (hasUnsavedChanges) {
          event.preventDefault();
          event.returnValue = "";
        }
      },
      [hasUnsavedChanges]
    )
  );

  const handleEndPinSession = () => {
    clearSystemConfigSession();
    toast.info("Admin PIN session ended");
    navigate("/system-config/login", { replace: true });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSetupSettings((prev) => ({
        ...prev,
        companyLogo: result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Favicon size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSetupSettings((prev) => ({
        ...prev,
        favicon: result,
      }));
      updateFavicon(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFavicon = () => {
    setSetupSettings((prev) => ({
      ...prev,
      favicon: null,
    }));
    updateFavicon(null);
  };

  const handleSetupSubmit = async () => {
    try {
      setSavingSection("setup");
      await updateProjectSetupConfig({
        allowCompanyChange: setupSettings.allowCompanyChange,
        themeColor: setupSettings.themeColor,
        companyLogo: setupSettings.companyLogo,
        favicon: setupSettings.favicon,
        shortcutDimCode1: setupSettings.shortcutDimCode1,
        shortcutDimCode2: setupSettings.shortcutDimCode2,
      });
      setInitialSetupSettings(setupSettings);
      toast.success("System settings updated");
    } catch (error) {
      console.error("Setup update error:", error);
      toast.error("Unable to update system settings");
    } finally {
      setSavingSection(null);
    }
  };

  const handleAppSetupSubmit = async () => {
    try {
      setSavingSection("appSetup");
      await updateAppSetupConfig(appSetup);
      setInitialAppSetup(appSetup);
      toast.success("App setup updated");
    } catch (error) {
      console.error("App setup update error:", error);
      toast.error("Unable to update app setup");
    } finally {
      setSavingSection(null);
    }
  };

  const handleBcConfigSubmit = async () => {
    try {
      setSavingSection("bcConfig");
      await updateBcConfig(bcConfig);
      setInitialBcConfig(bcConfig);
      toast.success("Business Central configuration updated successfully");
    } catch (error) {
      console.error("BC config update error:", error);
      toast.error("Unable to update Business Central configuration");
    } finally {
      setSavingSection(null);
    }
  };

  const handleEnvironmentSubmit = async () => {
    try {
      setSavingSection("environment");
      await updateEnvironmentConfig(environmentConfig);
      setInitialEnvironmentConfig(environmentConfig);
      toast.success("Environment configuration updated");
    } catch (error) {
      console.error("Environment config update error:", error);
      toast.error("Unable to update environment configuration");
    } finally {
      setSavingSection(null);
    }
  };

  const handleProjectSetupSave = async (setup: ProjectSetupConfig) => {
    try {
      setProjectSavingId(setup.id);
      await updateProjectSetup(setup);
      setInitialProjectSetups((prev) =>
        prev.map((item) => (item.id === setup.id ? setup : item))
      );
      toast.success("Project setup updated");
    } catch (error) {
      console.error("Project setup update error:", error);
      toast.error("Unable to update project setup");
    } finally {
      setProjectSavingId(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="page-content">
      <Container fluid>
        <div className="page-title-box">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h6 className="page-title">System Configuration</h6>
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Admin Panel
                </li>
              </ol>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-end">
              <Button color="secondary" onClick={loadConfigurations}>
                Refresh
              </Button>
              <Button color="danger" outline onClick={handleEndPinSession}>
                End PIN Session
              </Button>
            </div>
          </div>
        </div>

        <Row>
          <Col lg="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle tag="h5">System Settings</CardTitle>

                <div className="mb-4">
                  <Label className="form-label d-block">Company Switching</Label>
                  <FormGroup check>
                    <Input
                      type="checkbox"
                      checked={setupSettings.allowCompanyChange}
                      onChange={(e) =>
                        setSetupSettings((prev) => ({
                          ...prev,
                          allowCompanyChange: e.target.checked,
                        }))
                      }
                    />
                    <Label check>
                      {setupSettings.allowCompanyChange ? "Enabled" : "Disabled"}
                    </Label>
                  </FormGroup>
                  <FormHelperText className="text-muted">
                    Allow users to switch between companies in the system.
                  </FormHelperText>
                </div>

                <hr className="my-4" />

                <div className="mb-4">
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-label">Department</Label>
                        <Input
                          value={setupSettings.shortcutDimCode1}
                          onChange={(e) =>
                            setSetupSettings((prev) => ({
                              ...prev,
                              shortcutDimCode1: e.target.value,
                            }))
                          }
                          placeholder="Shortcut Dimension Code 1"
                        />
                        <FormHelperText className="text-muted">
                          Shortcut Dimension 1 label used for departments.
                        </FormHelperText>
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label className="form-label">Cost Center</Label>
                        <Input
                          value={setupSettings.shortcutDimCode2}
                          onChange={(e) =>
                            setSetupSettings((prev) => ({
                              ...prev,
                              shortcutDimCode2: e.target.value,
                            }))
                          }
                          placeholder="Shortcut Dimension Code 2"
                        />
                        <FormHelperText className="text-muted">
                          Shortcut Dimension 2 label used for cost centers.
                        </FormHelperText>
                      </FormGroup>
                    </Col>
                  </Row>
                </div>

                <hr className="my-4" />

                <div className="mb-4">
                  <Label className="form-label d-block">Theme Color</Label>
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="color"
                      value={setupSettings.themeColor}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        setSetupSettings((prev) => ({
                          ...prev,
                          themeColor: newColor,
                        }));
                        applyThemeColors(newColor);
                        saveThemeColor(newColor);
                      }}
                    />
                    <Input
                      value={setupSettings.themeColor}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        setSetupSettings((prev) => ({
                          ...prev,
                          themeColor: newColor,
                        }));
                        if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                          applyThemeColors(newColor);
                          saveThemeColor(newColor);
                        }
                      }}
                      placeholder="#094BAC"
                      style={{ maxWidth: 160 }}
                    />
                  </div>
                  <FormHelperText className="text-muted">
                    Select the primary color theme for the application.
                  </FormHelperText>
                </div>

                <hr className="my-4" />

                <div className="mb-4">
                  <Label className="form-label d-block">Company Logo</Label>
                  <div className="mb-3">
                    {setupSettings.companyLogo ? (
                      <img
                        src={setupSettings.companyLogo}
                        alt="Company Logo"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "100px",
                          objectFit: "contain",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          padding: "8px",
                          backgroundColor: "#fff",
                        }}
                      />
                    ) : (
                      <div className="text-center p-3 border rounded bg-light">
                        <p className="text-muted mb-0">No logo uploaded</p>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      color="primary"
                      outline
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Logo
                    </Button>
                    <Button
                      color="danger"
                      outline
                      size="sm"
                      onClick={() =>
                        setSetupSettings((prev) => ({
                          ...prev,
                          companyLogo: null,
                        }))
                      }
                    >
                      Remove
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                <hr className="my-4" />

                <div className="mb-4">
                  <Label className="form-label d-block">Favicon</Label>
                  <div className="mb-3">
                    {setupSettings.favicon ? (
                      <img
                        src={setupSettings.favicon}
                        alt="Favicon"
                        style={{
                          width: 32,
                          height: 32,
                          objectFit: "contain",
                          border: "1px solid #ddd",
                          borderRadius: 4,
                          padding: 4,
                          backgroundColor: "#fff",
                        }}
                      />
                    ) : (
                      <div className="text-center p-3 border rounded bg-light">
                        <p className="text-muted mb-0">No favicon uploaded</p>
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      color="primary"
                      outline
                      size="sm"
                      onClick={() => faviconInputRef.current?.click()}
                    >
                      Upload Favicon
                    </Button>
                    <Button
                      color="danger"
                      outline
                      size="sm"
                      onClick={handleRemoveFavicon}
                    >
                      Remove
                    </Button>
                    <input
                      ref={faviconInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    color="primary"
                    className="btn btn-label"
                    onClick={handleSetupSubmit}
                    disabled={savingSection === "setup"}
                  >
                    {savingSection === "setup" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle tag="h5">Application Setup</CardTitle>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Base URL</Label>
                      <Input
                        value={appSetup.baseUrl}
                        onChange={(e) =>
                          setAppSetup((prev) => ({
                            ...prev,
                            baseUrl: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Default Company</Label>
                      <Input
                        value={appSetup.defaultCompany}
                        onChange={(e) =>
                          setAppSetup((prev) => ({
                            ...prev,
                            defaultCompany: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>E-Hub Username</Label>
                      <Input
                        value={appSetup.ehubUsername}
                        onChange={(e) =>
                          setAppSetup((prev) => ({
                            ...prev,
                            ehubUsername: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>E-Hub Password</Label>
                      <Input
                        type="password"
                        value={appSetup.ehubPassword}
                        onChange={(e) =>
                          setAppSetup((prev) => ({
                            ...prev,
                            ehubPassword: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3">
                  <Button
                    color="primary"
                    onClick={handleAppSetupSubmit}
                    disabled={savingSection === "appSetup"}
                  >
                    {savingSection === "appSetup" ? "Saving..." : "Save App Setup"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle tag="h5">Business Central Configuration</CardTitle>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Tenant</Label>
                      <Input
                        value={bcConfig.tenant}
                        onChange={(e) =>
                          setBcConfig((prev) => ({
                            ...prev,
                            tenant: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Client ID</Label>
                      <Input
                        value={bcConfig.clientId}
                        onChange={(e) =>
                          setBcConfig((prev) => ({
                            ...prev,
                            clientId: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Client Secret</Label>
                      <Input
                        type="password"
                        value={bcConfig.clientSecret}
                        onChange={(e) =>
                          setBcConfig((prev) => ({
                            ...prev,
                            clientSecret: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>API URL</Label>
                      <Input
                        value={bcConfig.url}
                        onChange={(e) =>
                          setBcConfig((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>BC Email (Optional)</Label>
                      <Input
                        value={bcConfig.email || ""}
                        onChange={(e) =>
                          setBcConfig((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>BC Password (Optional)</Label>
                      <Input
                        type="password"
                        value={bcConfig.password || ""}
                        onChange={(e) =>
                          setBcConfig((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3">
                  <Button
                    color="primary"
                    onClick={handleBcConfigSubmit}
                    disabled={savingSection === "bcConfig"}
                  >
                    {savingSection === "bcConfig" ? "Saving..." : "Save BC Config"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle tag="h5">Environment Configuration</CardTitle>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <Label>Environment Type</Label>
                      <Input
                        value={environmentConfig.environmentType}
                        onChange={(e) =>
                          setEnvironmentConfig((prev) => ({
                            ...prev,
                            environmentType: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <Label>Frontend Base Path</Label>
                      <Input
                        value={environmentConfig.frontendBasePath}
                        onChange={(e) =>
                          setEnvironmentConfig((prev) => ({
                            ...prev,
                            frontendBasePath: e.target.value,
                          }))
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3">
                  <Button
                    color="primary"
                    onClick={handleEnvironmentSubmit}
                    disabled={savingSection === "environment"}
                  >
                    {savingSection === "environment"
                      ? "Saving..."
                      : "Save Environment"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle tag="h5">Project Setup Configuration</CardTitle>
                {projectSetups.length === 0 ? (
                  <p className="text-muted mb-0">No project setups found.</p>
                ) : (
                  projectSetups.map((setup, index) => (
                    <div key={setup.id || `project-${index}`} className="mb-4">
                      <Row>
                        <Col md="4">
                          <FormGroup>
                            <Label>Project ID</Label>
                            <Input value={setup.id} readOnly />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label>Project Name</Label>
                            <Input
                              value={setup.name || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProjectSetups((prev) =>
                                  prev.map((item) =>
                                    item.id === setup.id
                                      ? { ...item, name: value }
                                      : item
                                  )
                                );
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col md="4">
                          <FormGroup>
                            <Label>Brand Color</Label>
                            <Input
                              value={setup.color || ""}
                              onChange={(e) => {
                                const value = e.target.value;
                                setProjectSetups((prev) =>
                                  prev.map((item) =>
                                    item.id === setup.id
                                      ? { ...item, color: value }
                                      : item
                                  )
                                );
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-end">
                        <Button
                          color="primary"
                          onClick={() => handleProjectSetupSave(setup)}
                          disabled={projectSavingId === setup.id}
                        >
                          {projectSavingId === setup.id
                            ? "Saving..."
                            : "Save Project Setup"}
                        </Button>
                      </div>
                      {index < projectSetups.length - 1 && <hr className="my-4" />}
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SystemConfigPage;
