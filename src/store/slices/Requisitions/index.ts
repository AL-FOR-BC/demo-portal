import { combineReducers } from "redux";
import purchaseRequisition, {
  purchaseRequisitionState,
} from "./purchaseRequisitionSlice";

export type RequisitionsState = {
  purchaseRequisition: purchaseRequisitionState;
};

const reducer = combineReducers({
  purchaseRequisition,
});
export * from "./purchaseRequisitionSlice";

export default reducer;
