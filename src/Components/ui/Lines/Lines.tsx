import React from "react";
import classNames from "classnames";
import { Collapse } from "reactstrap";
// import TableLinesComponent from '../Table/TableLines'
import { PurchaseRequisitionLineType } from "../../../@types/purchaseReq.dto";
import { PaymentRequisitionLineType } from "../../../@types/paymentReq.dto";
import TableLinesMui from "../Table/TableLinesMui";
import { IPALine } from "../../../@types/ipa.dto";
import { GrievanceLine } from "../../../@types/grievanceLines.dto";

interface LinesProps {
  data:
    | PurchaseRequisitionLineType[]
    | PaymentRequisitionLineType[]
    | IPALine[]
    | GrievanceLine[];
  status: string;
  modalFields: any[];
  columns: any[];
  documentName?: string;
  title: string;
  subTitle: string;
  breadcrumbItem: string;
  addLink: string;
  addLabel: string;
  noDataMessage: string;
  iconClassName: string;
  handleSubmitLines: () => void;
  handleSubmitUpdatedLine: () => void;
  clearLineFields: () => void;
  handleValidateHeaderFields: () => boolean;
  handleDeleteLines?: (row: any) => void;
  collapsibleName?: string;
  multipleLines?: boolean;
  canAddLines?: boolean;
}

function Lines({
  collapsibleName,
  documentName,
  data,
  columns,
  status,
  modalFields,
  handleSubmitLines,
  handleSubmitUpdatedLine,
  clearLineFields,
  handleValidateHeaderFields,
  multipleLines,
  canAddLines,
}: LinesProps) {
  const [lineTab, setLineTab] = React.useState(true);
  const toggleLines = () => {
    setLineTab(!lineTab);
  };
  return (
    <>
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingLines">
          <button
            className={classNames("accordion-button", "fw-medium", {
              collapsed: !lineTab,
            })}
            type="button"
            onClick={toggleLines}
            style={{ cursor: "pointer" }}
          >
            {collapsibleName ? collapsibleName : "Lines"}
          </button>
        </h2>
        <Collapse isOpen={lineTab} className="accordion-collapse">
          <div className="accordion-body">
            <TableLinesMui
              handleValidateHeaderFields={handleValidateHeaderFields}
              handleSubmitUpdatedLine={handleSubmitUpdatedLine}
              documentName={documentName}
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
              multipleLines={multipleLines}
              canAddLines={canAddLines}
            />
          </div>
        </Collapse>
      </div>
    </>
  );
}

export default Lines;
