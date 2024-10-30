import React, { useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap'
import romLogo from "../../assets/images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { LoginVariantIcon, MicrosoftAzureIcon } from '../../Components/common/icons/icons';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { toast } from 'react-toastify';
import UseAuth from '../../utils/hooks/useAuth';
import Loader from '../../Components/Loader';
import { BrowserAuthError } from '@azure/msal-browser';

function SingleSignOn() {
    const [loading, setLoading] = useState(false)
    const { instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const navigate = useNavigate();
    const { signInWithAzure } = UseAuth();
    const handleSignIn = async () => {
        try {
            // Clear any existing auth state first
            await instance.clearCache();
            localStorage.clear();
            sessionStorage.clear();

            // Configure login request
            const loginRequest = {
                scopes: ["openid", "profile", "email"],
                prompt: "select_account"
            };

            // Attempt login
            await instance.loginRedirect(loginRequest);
        } catch (error) {
            console.error("Login error:", error);
            // Show more specific error message
            if (error instanceof BrowserAuthError) {
                toast.error(`Authentication Error: ${error.errorMessage}`);
            } else {
                toast.error("Failed to initialize login. Please try again.");
            }
        }
    }
    useEffect(() => {
        const signIn = async () => {
            setLoading(true)
            if (isAuthenticated) {
                const response = await signInWithAzure()
                if (response.status === "success") {
                    toast.success(response.message);
                    navigate("/dashboard");
                    setLoading(false)
                } else {
                    toast.error("Error signing in with Azure");
                }
            } else {
                navigate("/single-sign-on")
            }
            setLoading(false)
        }
        signIn()
    }, [isAuthenticated])

    // const isAuthenticated = useIsAuthenticated();

    // const getTokenAndAccount = async (): Promise<{ token: string | undefined, account: AccountInfo | null }> => {
    //     const request = {
    //         scopes: ["https://api.businesscentral.dynamics.com/.default"],
    //         extraScopesToConsent: ["user.read", "openid", "profile", "offline_access"]
    //     };

    //     try {
    //         const response = await instance.acquireTokenSilent(request);
    //         console.log("Access Token:", response.accessToken);
    //         return { token: response.accessToken, account: response.account };
    //     } catch (error) {
    //         if (error instanceof InteractionRequiredAuthError) {
    //             const response = await instance.acquireTokenPopup(request);
    //             console.log("Access Token:", response.accessToken);
    //             return { token: response.accessToken, account: response.account };
    //         } else {
    //             console.error(error);
    //             return { token: undefined, account: null };
    //         }
    //     }
    // };

    // useEffect(() => {
    //     console.log(isAuthenticated)
    //     if (isAuthenticated) {
    //         getTokenAndAccount().then(({ token, account }) => {
    //             if (token && account) {
    //                 dispatch(signInSuccess(token));
    //                 dispatch(bcTokenSuccess(token));
    //                 // You can access the email here
    //                 const userEmail = account.username;
    //                 console.log("User email:", userEmail);
    //                 // You might want to dispatch an action to store the email in your Redux store
    //                 // dispatch(setUserEmail(userEmail));
    //                 navigate("/dashboard");
    //             }
    //         }).catch(error => {
    //             console.error("Error getting token and account:", error);
    //         });
    //     }
    // }, [isAuthenticated, dispatch, navigate])
    return (
        <>
            {loading ? <Loader /> : (
                <React.Fragment>
                    <div className="account-pages my-5 pt-sm-5">
                        <Container>
                            <Row className="justify-content-center">
                                <Col md={8} lg={6} xl={5}>
                                    <Card className="overflow-hidden">
                                        <div className="bg-white bg-soft">
                                            <Row>
                                                <Col xs={7}>
                                                    <div className="text-loginColor p-4">
                                                        <h5 className="text-loginColor">Welcome Back !</h5>
                                                        <p>Sign in to continue to EHub.</p>
                                                    </div>
                                                </Col>
                                                <Col className="col-5 align-self-end">
                                                    {/* <img src={profile} alt="" className="img-fluid" /> */}
                                                    <img
                                                        src={romLogo}
                                                        alt=""
                                                        className="img-fluid"
                                                        height="52"
                                                    />
                                                </Col>
                                            </Row>
                                        </div>
                                        <CardBody className="pt-0">
                                            <div className="p-2">
                                                <div className="mt-4 d-grid">
                                                    <Button color="loginColor" type="button" className="btn btn-loginColor btn-block" onClick={handleSignIn}>
                                                        <MicrosoftAzureIcon />
                                                        <br />
                                                        Sign In With Microsoft Azure
                                                    </Button>
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <Link to="/login" className="text-muted">
                                                        <LoginVariantIcon /> {' '}
                                                        Login For External User
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
                </React.Fragment>
            )}
        </>
    )
}


export default SingleSignOn
