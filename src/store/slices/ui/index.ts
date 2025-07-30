import { combineReducers } from "redux";
import modals, { modalsState } from "./modalsSlice";

export type UiState = {
  modals: modalsState;
};

const reducer = combineReducers({
  modals,
});
export * from "./modalsSlice";

export default reducer;
