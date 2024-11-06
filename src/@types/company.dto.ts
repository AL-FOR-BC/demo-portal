export interface Company {
    id: string;
    systemVersion: string;
    timestamp: number;
    name: string;
    displayName: string;
    businessProfileId: string;
    systemCreatedAt: string;
    systemCreatedBy: string;
    systemModifiedAt: string;
    systemModifiedBy: string;
}

export interface CompanyResponse {
    "@odata.context": string;
    value: Company[];
}

// If you need a single company response
export interface SingleCompanyResponse {
    "@odata.context": string;
    value: Company;
}