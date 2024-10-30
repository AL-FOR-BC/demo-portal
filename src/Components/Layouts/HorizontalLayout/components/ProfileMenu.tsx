import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { Link } from "react-router-dom";
import { FiSettings, FiUser } from "react-icons/fi";
import { BiChevronDown, BiPowerOff } from "react-icons/bi";
import { useAppSelector } from "../../../../store/hook.ts";
import { upperCase } from "lodash"
import useAuth from "../../../../utils/hooks/useAuth.ts";




function ProfileMenu() {
    const [menu, setMenu] = useState(false)
    const [emailIcon, setEmailIcon] = useState("")
    const [nameIcon, setNameIcon] = useState("")
    const { signOut } = useAuth();
    const { email } = useAppSelector((state) => state.auth.user)
    const { isAdmin, isBcAdmin } = useAppSelector((state) => state.auth.user);
    console.log(isAdmin, isBcAdmin)
    useEffect(() => {
        if (email) {
            setNameIcon(email)
            setEmailIcon(upperCase(email?.substring(0, 2)))
        }
    }, [email]);


    const profileMenuIcons = [

        {
            name: "Profile",
            render: () => <FiUser className="font-size-16 align-middle me-1 text-primary" />,
            link: "/profile"
        },
        {
            name: "Logout",
            render: () => <BiPowerOff className="font-size-16 align-middle me-1 text-primary" />,
            link: "/logout",
            onClick: () => {
                signOut();
            }


        },
        ...(isAdmin && isBcAdmin ? [{
            name: "App Setup",
            render: () => <FiSettings className="font-size-16 align-middle me-1 text-primary" />,
            link: "/app-setup",
        }] : []),
    ]
  
    const HeaderIcons = [
        {
            name: "dropdown",
            render: () => <BiChevronDown className="font-size-16 align-middle me-1 text-primary" />,

        }
    ]
    return (
        <React.Fragment>
            <Dropdown
                isOpen={menu}
                toggle={() => setMenu(!menu)}
                className="d-inline-block"
            >
                <DropdownToggle
                    className="btn header-item "
                    id="page-header-user-dropdown"
                    tag="button"
                >
                    <span className="rounded-circle header-profile-user">{emailIcon}</span>
                    <span className="d-none d-xl-inline-block ms-2 me-1">{nameIcon}</span>
                    {HeaderIcons[0].render()}
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    {profileMenuIcons.map((icon, index) => (
                        <Link key={index} className="dropdown-item" to={icon.link} onClick={icon.onClick}>
                            <>{icon.render()}</>
                            <span>{icon.name}</span>
                        </Link>

                    ))
                    }
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
}

export default ProfileMenu;