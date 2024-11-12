import React from "react";
import { BiSave } from "react-icons/bi";
import { MdArrowBack, MdArrowForward, MdDelete, MdEdit, MdHistory, MdOutlineLabel, MdSearch, MdSend } from "react-icons/md";
import { TbPlus, TbX } from "react-icons/tb";
import { FaBusAlt } from "react-icons/fa";
import Icon from '@mdi/react';
import { mdiBadgeAccountHorizontal, mdiBagSuitcase, mdiCartPlus, mdiFileQuestion, mdiFormatListCheckbox, mdiLoginVariant, mdiMicrosoftAzure, mdiOfficeBuilding, mdiReceipt, mdiTeaOutline } from '@mdi/js';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiUser, BiPhone, BiHome, BiCar, BiHealth, BiSolidBriefcaseAlt2 } from 'react-icons/bi';

export const PencilIcon = (props: React.SVGProps<SVGAElement>) => <MdEdit {...props} />;
export const DeleteIcon = (props: React.SVGProps<SVGAElement>) => <MdDelete {...props} />;
export const ArrowBackIcon = (props: React.SVGProps<SVGAElement>) => <MdArrowBack {...props} style={{
    padding: "8px"
}} />;
export const CancelIcon = (props: React.SVGProps<SVGAElement>) => <TbX {...props} style={{
    padding: "8px"
}} />;

export const SendIcon = (props: React.SVGProps<SVGAElement>) => <MdSend {...props} style={{
    padding: "8px"
}} />;

export const HistoryIcon = (props: React.SVGProps<SVGAElement>) => <MdHistory {...props} style={{
    padding: "6px"
}} />;

export const PlusIcon = (props: React.SVGProps<SVGAElement>) => <TbPlus {...props} style={{
    padding: "8px"
}} />;

export const SearchIcon = (props: React.SVGProps<SVGAElement>) => <MdSearch {...props} style={{
    // padding: "8px"
}} />;

export const ArrowRightIcon = (props: React.SVGProps<SVGAElement>) => <MdArrowForward {...props} style={{
    width: '14px',
    height: '14px'
}} />;


export const SaveIcon = (props: React.SVGProps<SVGAElement>) => <BiSave {...props} style={{
    padding: "8px"
}} />;

export const BusIcon = (props: React.SVGProps<SVGAElement>) => <FaBusAlt {...props} />

export const BageAccountHorizontalIcon = () =>
    <Icon
        path={mdiBadgeAccountHorizontal}
        size={1}
    />

export const TeachIcon = () =>
    <Icon
        path={mdiTeaOutline}
        size={1}
    />

export const CartIcon = () =>
    <Icon
        path={mdiCartPlus}
        size={1}
    />

export const ReceiptIcon = () =>
    <Icon
        path={mdiReceipt}
        size={1}
    />

export const BagSuitCaseIcon = () =>
    <Icon
        path={mdiBagSuitcase}
        size={1}
    />

export const FormatListCheckbox = () =>
    <Icon
        path={mdiFormatListCheckbox}
        // size={3}
        style={{
            width: '48px',
            height: '48px'
        }}
    />


export const MicrosoftAzureIcon = () =>
    <Icon
        path={mdiMicrosoftAzure}
        size={1}
    />
export const LoginVariantIcon = () =>
    <Icon
        path={mdiLoginVariant}
        size={1}
        className="mdi-24px"
    />

export const EyeIcon = (props: React.SVGProps<SVGAElement>) => <AiOutlineEye {...props} />;
export const EyeInvisibleIcon = (props: React.SVGProps<SVGAElement>) => <AiOutlineEyeInvisible {...props} />;

export const FileQuestionIcon = () =>
    <Icon
        path={mdiFileQuestion}
        size={1}
        style={{
            width: '120px',
            height: '120px',
            color: 'var(--bs-warning)'
        }}
        className="display-4"

    />
export const LabelIcon = (props: React.SVGProps<SVGAElement>) => <MdOutlineLabel
    style={{
        padding: "6px"
    }}
    {...props}
/>;

export const BuildingIcon = () => <Icon path={mdiOfficeBuilding} size={1} />;

export const BriefCaseIcon = (props: React.SVGProps<SVGAElement>) => <BiSolidBriefcaseAlt2 {...props} />;

export const UserIcon = (props: React.SVGProps<SVGAElement>) => <BiUser {...props} />;
export const PhoneIcon = (props: React.SVGProps<SVGAElement>) => <BiPhone {...props} />;
export const HomeIcon = (props: React.SVGProps<SVGAElement>) => <BiHome {...props} />;
export const CarIcon = (props: React.SVGProps<SVGAElement>) => <BiCar {...props} />;
export const HealthIcon = (props: React.SVGProps<SVGAElement>) => <BiHealth {...props} />;
