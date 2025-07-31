import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiLoginVariant } from "@mdi/js";
import romLogo from "../../assets/images/logo.png";
import { COMPANY_EMAIL, COMPANY_NAME } from "../../constants/app.constants.ts";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../utils/hooks/useAuth.ts";
import { toast } from "react-toastify";
// import appConfig from "../../configs/navigation.config/app.config.ts";
import {
  EyeIcon,
  EyeInvisibleIcon,
} from "../../Components/common/icons/icons.tsx";
import { useSettings } from "../../contexts/SettingsContext";

const Register = () => {
  const [disableLogin, setDisableLogin] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { settings } = useSettings();
  const { companyLogo, themeColor } = settings;
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid Email Address")
        .required("Please Enter Your Email"),
      password: Yup.string()
        .required("Please Enter Your Password")
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup.string()
        .required("Please Confirm Your Password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    }),

    onSubmit: async (values) => {
      try {
        if (values.password !== values.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        setDisableLogin(true);
        Swal.fire({
          text: "Validating login details...",
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const loginDetails = {
          email: values.email,
          // password: btoa(values.password)
          password: values.password,
        };
        const result = await signUp(loginDetails);
        if (result?.status === "failed") {
          toast.error(result.message);
        }
        if (result?.status === "success") {
          toast.success(result.message);
          navigate("/login");
        }
      } catch (err) {
        console.log(err);
        toast.error("An error occurred during registration");
      } finally {
        setTimeout(() => {
          Swal.close();
          setDisableLogin(false);
        }, 1000);
      }
    },
  });
  return (
    <>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="p-4" style={{ color: themeColor }}>
                        <h5 style={{ color: themeColor }}>
                          Register Account !
                        </h5>
                        <p>Sign up to continue to {COMPANY_NAME}.</p>
                      </div>
                    </Col>
                    <Col className="col-4 align-self-end px-2">
                      <img
                        src={companyLogo || romLogo}
                        alt="Company Logo"
                        className="img-fluid"
                        style={{ objectFit: "contain" }}
                      />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  {/*{!otpVerify ? (*/}
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="mb-3">
                        <Label className="form-label">E-mail</Label>
                        <Input
                          name="email"
                          className="form-control"
                          type="text"
                          placeholder={COMPANY_EMAIL}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Password</Label>
                        <div className="position-relative">
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={showPassword ? "text" : "password"}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              !!(
                                validation.touched.password &&
                                validation.errors.password
                              )
                            }
                          />
                          <div
                            className="position-absolute top-50 end-0 translate-middle-y pe-2"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeInvisibleIcon /> : <EyeIcon />}
                          </div>
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>
                      <div className="mb-3">
                        <Label className="form-label">Confirm Password</Label>
                        <div className="position-relative">
                          <Input
                            name="confirmPassword"
                            value={validation.values.confirmPassword || ""}
                            type={showConfirmPassword ? "text" : "password"}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              !!(
                                validation.touched.confirmPassword &&
                                validation.errors.confirmPassword
                              )
                            }
                          />
                          <div
                            className="position-absolute top-50 end-0 translate-middle-y pe-2"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeInvisibleIcon />
                            ) : (
                              <EyeIcon />
                            )}
                          </div>
                          {validation.touched.confirmPassword &&
                          validation.errors.confirmPassword ? (
                            <FormFeedback type="invalid">
                              {validation.errors.confirmPassword}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </div>
                      <div className="form-check"></div>

                      <div className="mb-3 d-grid">
                        <Button
                          disabled={disableLogin}
                          type="submit"
                          className="btn btn-block"
                          style={{
                            backgroundColor: themeColor,
                            borderColor: themeColor,
                            color: "white",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = themeColor;
                            e.currentTarget.style.opacity = "0.9";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = themeColor;
                            e.currentTarget.style.opacity = "1";
                          }}
                        >
                          <Icon path={mdiLoginVariant} size={1} />
                          <br />
                          Register In Here
                        </Button>
                      </div>
                    </Form>
                    <div className="mt-4 text-center align-items-center">
                      <Link to="/login" className="text-muted">
                        <Icon
                          path={mdiLoginVariant}
                          style={{
                            width: "14px",
                            height: "14px",
                          }}
                        />
                        Already have an account?{" "}
                        <span style={{ color: themeColor }}>Login</span>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-3 text-center">
                <p>© {new Date().getFullYear()} EHub.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};
export default Register;
