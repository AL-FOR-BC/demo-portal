import React from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { BiChevronDown, BiBuildings } from "react-icons/bi";
import { useAppSelector } from "../../../../store/hook";

interface CompanyMenuProps {
    companies: any[];
    companyId: string;
    handleCompanyChange: (id: string) => void;
    allowCompanyChange: boolean;
}

function CompanyMenu({ companies, companyId, handleCompanyChange, allowCompanyChange }: CompanyMenuProps) {
    const [menu, setMenu] = React.useState(false);
    const currentCompany = companies.find(company => company.id === companyId)?.displayName || 'Select Company';

    if (!allowCompanyChange) return null;

    return (
        <React.Fragment>
            <Dropdown
                isOpen={menu}
                toggle={() => setMenu(!menu)}
                className="d-inline-block company-menu"
            >
                <DropdownToggle
                    className="btn header-item"
                    id="page-header-company-dropdown"
                    tag="button"
                >
                    <BiBuildings className="header-profile-icon" />
                    <span className="d-none d-xl-inline-block ms-2 me-1">{currentCompany}</span>
                    <BiChevronDown className="d-none d-xl-inline-block" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    {companies.map((company) => (
                        <button
                            key={company.id}
                            className="dropdown-item"
                            onClick={() => handleCompanyChange(company.id)}
                        >
                            <BiBuildings className="font-size-16 align-middle me-1 text-primary" />
                            <span>{company.displayName}</span>
                        </button>
                    ))}
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
}

export default CompanyMenu;