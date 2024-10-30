import React, {useState} from 'react';
import {Collapse} from "reactstrap";
import {Link, useNavigate} from "react-router-dom";
import {navbarOptions} from "../../../../data/navbarOptions.ts";
// import NavBarIcon from "../../../common/icons/NavIcon.tsx";
import classname from "classnames";

interface NavBarProps {
    leftMenu?: boolean;
    menuOpen: boolean;
}


function NavBar(props: NavBarProps) {
    const [activeMenu, setActiveMenu] = useState<{ [key: number]: boolean }>({});
    const navigate = useNavigate();

    const toggleSubMenu = (id: number) => {
        setActiveMenu(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <React.Fragment>
            <div className="topnav">
                <div className="container-fluid">
                    <nav className="navbar navbar-light navbar-expand-lg topnav-menu" id="navigation">
                        <Collapse isOpen={props.leftMenu} className="navbar-collapse" id="topnav-menu-content">
                            <ul className="navbar-nav">
                                {navbarOptions.map(option => (
                                    <li className="nav-item dropdown" key={option.id}>
                                        <Link
                                            to={option.path}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleSubMenu(option.id);
                                                navigate(option.path);
                                            }}
                                            className="nav-link dropdown-toggle arrow-none"
                                        >
                                            <i className={`mdi ${option.icon} me-2`}></i>
                                            {option.name}
                                            {option.subOptions && <div className="arrow-down"></div>}
                                        </Link>
                                        <div className={classname("dropdown-menu", { show: activeMenu[option.id] })}>
                                            {option.subOptions?.map(subOption => (
                                                subOption.subOptions ? (
                                                    <div className="dropdown" key={subOption.id}>
                                                        <Link
                                                            to="/#"
                                                            className="dropdown-item dropdown-toggle arrow-none"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleSubMenu(subOption.id);
                                                            }}
                                                        >
                                                            {subOption.name} <div className="arrow-down"></div>
                                                        </Link>
                                                        <div className={classname("dropdown-menu", { show: activeMenu[subOption.id] })}>
                                                            {subOption.subOptions.map(nestedOption => (
                                                                <Link key={nestedOption.id} to={nestedOption.path} className="dropdown-item">
                                                                    {nestedOption.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <Link key={subOption.id} to={subOption.path} className="dropdown-item">
                                                        {subOption.name}
                                                    </Link>
                                                )
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Collapse>
                    </nav>
                </div>
            </div>
        </React.Fragment>
    );
}

export default NavBar;