

export interface  NavigationTree {
    id: number;
    name: string
    path: string
    icon?: string
    subOptions?: subOptions
}

export interface TableComponentProps {
    isLoading?: boolean;
    data: any[];
    columns: any[];
    defaultSorted?: any[];
    title: string;
    subTitle: string;
    breadcrumbItem: string;
    addLink: string; // URL for "Add New" link
    addLabel: string; // Label for the "Add" button
    noDataMessage: string; // Message when no data is available
    iconClassName: string; // Icon class for no data indication
}

export interface TableLinesComponentProps extends TableComponentProps {
    status?: string;
    modelFields?: any[];
}


type subOptions = NavigationTree[]