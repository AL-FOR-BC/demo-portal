import React, { useEffect, useState } from 'react';
import Header from "./components/Header.tsx";
import Views from "../../../pages/Views.tsx";
import Footer from "./components/Footer.tsx";
import NavBar from "./components/NavBar.tsx";
import { employees } from "../../../services/DashBoardService.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hook.ts";
import Swal from "sweetalert2";
import { setBcAdmin, setEmployeeData, setEmployeeNo, signOutSuccess } from "../../../store/slices/auth";
import { toast } from "react-toastify";
import { jwtDecode } from 'jwt-decode';
import UseAuth from '../../../utils/hooks/useAuth.ts';
import { EmployeeData } from '../../../@types/employee.dto.ts';
import { persistor } from '../../../store/storeSetup.ts';

function HorizontalLayout() {
    const { token } = useAppSelector((state) => state.auth.session);
    const [employeeList, setEmployeeList] = useState < EmployeeData[] > ([]);
    const { handleSignOutAzure } = UseAuth();
    // const [isMenuOpened, setIsMenuOpened] = useState(false);
    const isMenuOpened = false;
    const { companyId } = useAppSelector((state) => state.auth.session);
    const { email } = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();


    // const openMenu = () => {
    //     setIsMenuOpened(!isMenuOpened);
    // };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!companyId) {
                    console.error("Company ID is not available");
                    return;
                }
                const filterQuery = `&$filter=(CompanyEMail eq '${email}') or (CompanyEMail eq '${email}') or (CompanyEMail eq '${email}')`;
                const res = await employees(companyId, filterQuery);
                setEmployeeList(res.data.value);
                if (res.data.value.length == 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Access Denied',
                        text: 'Unable to verify your employee details. Please contact your system administrator.',
                        confirmButtonColor: '#3085d6'
                    }).then(function () {
                        if (token) {
                            const azureToken = jwtDecode < { aud: string } > (token);
                            if (azureToken?.aud === "https://api.businesscentral.dynamics.com") {
                                handleSignOutAzure();
                                dispatch(signOutSuccess())
                            }
                        }
                        toast.info("Failed to get your staff details. Please contact Admin.",
                            {
                                autoClose: 10000
                            }
                        )
                        dispatch(signOutSuccess())
                    })
                    return
                } else if (res.data.value.length > 0) {
                    const employeeNo = res.data.value[0].No
                    dispatch(setEmployeeNo(employeeNo))
                    dispatch(setEmployeeData({
                        employeeName: res.data.value[0].LastName + " " + res.data.value[0].FirstName,
                        employeeGender: res.data.value[0].Gender,
                        employeeDepartment: res.data.value[0].GlobalDimension1Code,
                        jobTitle: res.data.value[0].JobTitle,
                        nameAbbrev: res.data.value[0].LastName.charAt(0) + res.data.value[0].FirstName.charAt(0)

                    }))
                    dispatch(setBcAdmin(res.data.value[0].EHubAdministrator))
                }

            } catch (error) {
                console.error("Error fetching employees:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Session Expired. Please login again.',
                    confirmButtonColor: '#3085d6'
                }).then(async function () {
                    dispatch(signOutSuccess())
                    await persistor.purge();
                })
                setTimeout(() => {
                    if (error.response.status === 404) {
                        Swal.fire({
                            title: 'Login Failed!',
                            text: 'Network Error Please contact Admin.',
                            confirmButtonColor: 'green'
                        }).then(async function () {
                            // toast.info("Failed to get your staff details. Please contact Admin.")
                            dispatch(signOutSuccess())
                            await persistor.purge();
                        })
                    }
                }, 2000);
            };
        }

        fetchData();

        const timeoutId = setTimeout(() => {
            const preloader = document.getElementById("preloader");
            const status = document.getElementById("status");
            if (preloader && status) {
                preloader.style.display = "none";
                status.style.display = "none";
            }
        }, 2000);

        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    }, [companyId]); // Add companyId as a dependency if it changes

    return (
        <React.Fragment>
            <div id="preloader">
                <div id="status">
                    <div className="spinner-chase">
                        <div className="chase-dot" />
                        <div className="chase-dot" />
                        <div className="chase-dot" />
                        <div className="chase-dot" />
                        <div className="chase-dot" />
                        <div className="chase-dot" />
                    </div>
                </div>
            </div>
            {employeeList.length > 0 && (
                <div id="layout-wrapper">
                    <Header
                    // theme={topbarTheme}
                    // isMenuOpened={isMenuOpened}
                    // openLeftMenuCallBack={openMenu}
                    />
                    <NavBar menuOpen={isMenuOpened} />
                    <div className="main-content">
                        {/*{props.children}*/}
                        <Views />
                    </div>
                    <Footer />
                </div>
            )}
            {employeeList.length === 0 && (
                <div id="layout-wrapper">


                </div>
            )}


            {/*{showRightSidebar ? <RightSidebar /> : null}*/}

        </React.Fragment>
    );
}

export default HorizontalLayout;