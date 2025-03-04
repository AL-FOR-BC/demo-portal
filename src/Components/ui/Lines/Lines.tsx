import React from 'react'
import classNames from 'classnames'
import { Collapse } from 'reactstrap'
// import TableLinesComponent from '../Table/TableLines'
import { PurchaseRequisitionLineType } from '../../../@types/purchaseReq.dto'
import { PaymentRequisitionLineType } from '../../../@types/paymentReq.dto'
import TableLinesMui from '../Table/TableLinesMui'
import { IPALine } from '../../../@types/ipa.dto'

interface LinesProps {
    data: PurchaseRequisitionLineType[] | PaymentRequisitionLineType[] | IPALine[]
    status: string
    modalFields: any[]
    columns: any[]
    title: string
    subTitle: string
    breadcrumbItem: string
    addLink: string
    addLabel: string
    noDataMessage: string
    iconClassName: string
    handleSubmitLines: () => void
    handleSubmitUpdatedLine: () => void
    clearLineFields: () => void
    handleValidateHeaderFields: () => boolean
    handleDeleteLines?: (row: any) => void
}

function Lines({
    data,
    columns,
    // title,
    // subTitle,
    // breadcrumbItem,
    // addLink,
    // addLabel,
    // noDataMessage,
    // iconClassName,
    status,
    modalFields,
    handleSubmitLines,
    handleSubmitUpdatedLine,
    clearLineFields,
    handleValidateHeaderFields
}: LinesProps) {
    const [lineTab, setLineTab] = React.useState(true)
    const toggleLines = () => {
        setLineTab(!lineTab)
    }
    return (
        <>
            <div className="accordion-item">
                <h2 className="accordion-header" id="headingLines">
                    <button
                        className={classNames(
                            "accordion-button",
                            "fw-medium",
                            { collapsed: !lineTab }
                        )}
                        type="button"
                        onClick={toggleLines}
                        style={{ cursor: "pointer" }}
                    >
                        Lines
                    </button>
                </h2>
                <Collapse
                    isOpen={lineTab}
                    className="accordion-collapse"
                >
                    <div className="accordion-body">
                        <TableLinesMui
                            handleValidateHeaderFields={handleValidateHeaderFields}
                            handleSubmitUpdatedLine={handleSubmitUpdatedLine}
                            
                            data={data}
                            columns={columns}
                            // title={title}
                            // subTitle={subTitle}
                            // breadcrumbItem={breadcrumbItem}
                            // addLink={addLink}
                            // addLabel={addLabel}
                            // noDataMessage={noDataMessage}
                            // iconClassName={iconClassName}
                            status={status}
                            modelFields={modalFields}
                            handleSubmitLines={handleSubmitLines}
                            // handleDeleteLines={handleSubmitLines}
                            // handleSubmitUpdateLines={handleSubmitUpdatedLine}
                            clearLineFields={clearLineFields}

                        />
                    </div>
                </Collapse>
            </div>



        </>
    )
}

export default Lines