






export abstract class BaseApiSerivce {
protected companyId:string
protected systemId:string
protected filterQuery:string
    protected getBaseUrl() {
        return `/api/${this.odu}`
    }
}