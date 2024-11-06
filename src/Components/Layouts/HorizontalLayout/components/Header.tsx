import React, { useEffect } from 'react';
import { COMPANY_LOGO, COMPANY_LOGO2 } from "../../../../constants/app.constants.ts";
import { Link } from "react-router-dom";
import { mdiFullscreen } from '@mdi/js';
import Icon from "@mdi/react";
import ProfileMenu from "./ProfileMenu.tsx";
import { useAppSelector } from '../../../../store/hook.ts';
import { useAppDispatch } from '../../../../store/hook.ts';
import { setAllowCompanyChange, setCompany } from '../../../../store/slices/auth/sessionSlice.ts';
import CompanyMenu from './CompanyMenu';
import { getAllowCompanyChangeSetting } from '../../../../services/SetupServices.ts';
import { toast } from 'react-toastify';


function Header() {
    const dispatch = useAppDispatch()
    const { companyId, companies, allowCompanyChange } = useAppSelector(state => state.auth.session)
    const handleCompanyChange = (companyId: string) => {
        dispatch(setCompany(companyId))
    }
    useEffect(() => {
        const fetchAllowCompanyChange = async () => {
            try {
                const response = await getAllowCompanyChangeSetting();
                dispatch(setAllowCompanyChange(response.data.allowCompanyChange))
            } catch (error) {
                toast.error("Failed to fetch allow company change setting");
            }
        }

        fetchAllowCompanyChange();
        const pollInterval = setInterval(fetchAllowCompanyChange, 30000);
        return () => clearInterval(pollInterval);
    }, [companyId]);
    return (
        <React.Fragment>
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box">
                            <Link to="/dashboard" className="logo logo-dark">
                                {/* <span className="logo-sm">
                                    <img src={COMPANY_LOGO} alt="" height="46" />
                                </span> */}
                                <span className="logo-lg">
                                    <img src={COMPANY_LOGO2} alt="" height="90" />
                                </span>
                            </Link>

                            <Link to="/dashboard" className="logo logo-light">
                                <span className="logo-sm">
                                    <img src={COMPANY_LOGO} alt="" height="45" />
                                </span>
                                <span className="logo-lg">
                                    <img src={COMPANY_LOGO} alt="" height="45" />
                                </span>
                            </Link>
                        </div>

                        <button
                            type="button"
                            className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
                            data-toggle="collapse"
                            onClick={() => {
                                // props.toggleLeftmenu(!props.leftMenu);
                            }}
                            data-target="#topnav-menu-content"
                        >
                            <i className="fa fa-fw fa-bars" />
                        </button>
                    </div>

                    <div className="d-flex">
                        <div className="dropdown d-none d-lg-inline-block ms-1">
                            <button
                                type="button"
                                className="btn header-item noti-icon "
                                onClick={() => {
                                    // toggleFullscreen();
                                }}
                                data-toggle="fullscreen"
                            >
                                <Icon path={mdiFullscreen} style={{
                                    width: "18px",
                                    height: "18px",
                                }} />
                            </button>
                        </div>
                        {allowCompanyChange && (
                            <CompanyMenu
                                companies={companies}
                                companyId={companyId}
                                handleCompanyChange={handleCompanyChange}
                                allowCompanyChange={allowCompanyChange}
                            />
                        )}
                        {/*<NotificationDropdown />*/}

                        <ProfileMenu />
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
}

export default Header;