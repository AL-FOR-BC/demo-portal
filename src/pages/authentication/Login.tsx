import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from "reactstrap";
import { Link } from "react-router-dom";
import Icon from '@mdi/react';
import { mdiLoginVariant } from '@mdi/js';
import romLogo from "../../assets/images/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../utils/hooks/useAuth.ts";
import { toast } from "react-toastify";
import { COMPANY_EMAIL } from "../../constants/app.constants.ts";
import {EyeIcon, EyeInvisibleIcon } from "../../Components/common/icons/icons.tsx";


const Login = () => {
    const [disableLogin, setDisableLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, getToken } = useAuth();
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid Email Address").required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: async (values) => {
            try {
                setDisableLogin(true);
                Swal.fire({
                    text: "Validating login details...",
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                    }
                });
                const loginDetails = {
                    email: values.email,
                    password: values.password
                }
                const result = await signIn(loginDetails)
                if (result?.status == "success") {
                    const response = await getToken()
                    if (response?.status == "success") {
                        console.log(response)
                        toast.success(result.message)
                    }

                }
                if (result?.status == "failed") {
                    toast.error(result.message)
                }

            } catch (error) {
                // @ts-ignore
                toast.error(error.message)
            } finally {
                setTimeout(() => {
                    Swal.close()
                    setDisableLogin(false)

                }, 1000)
            }
        }
    })
    return (
        <>
            {/*<div className="account-pages my-5 pt-sm-5" hidden={loginHidden}>*/}
            <div className="account-pages my-5 pt-sm-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="overflow-hidden">
                                <div className="bg-primary bg-soft">
                                    <Row>
                                        <Col xs={7}>
                                            <div className="text-primary p-4">
                                                <h5 className="text-primary">Welcome Back !</h5>
                                                <p>Sign in to continue to EHub.</p>
                                            </div>
                                        </Col>
                                        <Col className="col-4 align-self-end px-2">
                                            <img
                                                src={romLogo}
                                                alt=""
                                                className="img-fluid"

                                            />
                                        </Col>
                                    </Row>
                                </div>
                                <CardBody className="pt-0">
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
                                                        !!(validation.touched.email && validation.errors.email)
                                                    }
                                                />
                                                {validation.touched.email && validation.errors.email ? (
                                                    <FormFeedback
                                                        type="invalid">{validation.errors.email}</FormFeedback>
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
                                                            !!(validation.touched.password && validation.errors.password)
                                                        }
                                                    />
                                                    <div 
                                                        className="position-absolute top-50 end-0 translate-middle-y pe-2" 
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeInvisibleIcon /> : <EyeIcon />}
                                                    </div>
                                                    {validation.touched.password && validation.errors.password ? (
                                                        <FormFeedback
                                                            type="invalid">{validation.errors.password}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="form-check">

                                            </div>

                                            <div className="mb-3 d-grid">
                                                <Button
                                                    disabled={disableLogin}

                                                    color="primary" type="submit"
                                                    className="btn btn-primary btn-block">
                                                    <Icon path={mdiLoginVariant} size={1} />
                                                    <br />
                                                    Log In Here
                                                </Button>
                                            </div>
                                        </Form>
                                        <div className="mt-4 text-center align-items-center">
                                            <Link to="/register" className="text-muted">
                                                Don't have an account? <span className="text-primary">Register</span>
                                            </Link>

                                        </div>
                                        <div className="mt-4 text-center align-items-center">
                                            <Link to="/single-sign-on" className="text-muted">
                                                Single Sign On ? <span className="text-primary">Click Here</span>
                                            </Link>
                                        </div>
                                    </div>

                                </CardBody>
                            </Card>
                            <div className="mt-3 text-center">
                                <p>
                                    © {new Date().getFullYear()} EHub.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}
export default Login;