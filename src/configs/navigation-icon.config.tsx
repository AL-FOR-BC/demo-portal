
import {
    HiOutlineChartSquareBar,
    HiOutlineUserGroup,
    HiOutlineTrendingUp,
    HiOutlineUserCircle,
    HiOutlineBookOpen,
    HiOutlineCurrencyDollar,
    HiOutlineShieldCheck,
    HiOutlineColorSwatch,
    HiOutlineChatAlt,
    HiOutlineDesktopComputer,
    HiOutlinePaperAirplane,
    HiOutlineChartPie,
    HiOutlineUserAdd,
    HiOutlineKey,
    HiOutlineBan,
    HiOutlineHand,
    HiOutlineDocumentText,
    HiOutlineTemplate,
    HiOutlineLockClosed,
    HiOutlineDocumentDuplicate,
    HiOutlineViewGridAdd,
    HiOutlineShare,
    HiOutlineVariable,
    HiOutlineCode,
} from "react-icons/hi";
import { IoMdCube } from "react-icons/io";
import { BiHome } from "react-icons/bi";
import CashIcon from "mdi-react/CashIcon";
import HumanQueueIcon from "mdi-react/HumanQueueIcon";
import CartPlusIcon from "mdi-react/CartPlusIcon";
import TrainCarIcon from "mdi-react/TrainCarIcon";
import AccountCheckOutlineIcon from  "mdi-react/AccountCheckOutlineIcon"
import { BiAlignJustify } from "react-icons/bi";

export type NavigationIcons = Record<string, JSX.Element>;

const navigationIcon: NavigationIcons = {
    apps: <HiOutlineViewGridAdd />,
    project: <HiOutlineChartSquareBar />,
    crm: <HiOutlineUserGroup />,
    sales: <HiOutlineTrendingUp />,
    crypto: <HiOutlineCurrencyDollar />,
    knowledgeBase: <HiOutlineBookOpen />,
    account: <HiOutlineUserCircle />,
    uiComponents: <HiOutlineTemplate />,
    common: <HiOutlineColorSwatch />,
    feedback: <HiOutlineChatAlt />,
    dataDisplay: <HiOutlineDesktopComputer />,
    forms: <HiOutlineDocumentText />,
    navigation: <HiOutlinePaperAirplane />,
    graph: <HiOutlineChartPie />,
    authentication: <HiOutlineLockClosed />,
    signIn: <HiOutlineShieldCheck />,
    signUp: <HiOutlineUserAdd />,
    forgotPassword: <HiOutlineLockClosed />,
    resetPassword: <HiOutlineKey />,
    pages: <HiOutlineDocumentDuplicate />,
    welcome: <HiOutlineHand />,
    accessDenied: <HiOutlineBan />,
    guide: <HiOutlineBookOpen />,
    documentation: <HiOutlineDocumentText />,
    sharedComponentDoc: <HiOutlineShare />,
    utilsDoc: <HiOutlineVariable />,
    changeLog: <HiOutlineCode />,
    items: <IoMdCube />,
    home: <BiHome />,
    human:<HumanQueueIcon />,
    cash:<CashIcon />,
    cart:<CartPlusIcon/>,
    train:<TrainCarIcon />,
    accountCheck:<AccountCheckOutlineIcon />,
    alignJustify:<BiAlignJustify />
};

export default navigationIcon;
