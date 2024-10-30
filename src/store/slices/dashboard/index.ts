import { combineReducers } from "redux";
import userDashBoard, { dashBoardState } from "./dashBoardSlice";

export type DashBoardState = {
  userDashBoard: dashBoardState;
};

const reducer = combineReducers({
  userDashBoard,
});
export * from "./dashBoardSlice";

export default reducer;
