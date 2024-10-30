import React from 'react';
import { COMPANY_LOGO, COMPANY_LOGO2 } from "../../../../constants/app.constants.ts";
import { Link } from "react-router-dom";
import {mdiFullscreen} from '@mdi/js';
import Icon from "@mdi/react";
import ProfileMenu from "./ProfileMenu.tsx";
// interface HeaderProps {
//     leftMenu?: boolean;
//     isMenuOpened?: boolean;
//     openLeftMenuCallBack: () => void;
// }

function Header() {
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
                                }}/>
                            </button>
                        </div>

                        {/*<NotificationDropdown />*/}

                        <ProfileMenu />
                    </div>
                </div>
            </header>
        </React.Fragment>
    );
}

export default Header;