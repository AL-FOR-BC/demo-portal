import { combineReducers, CombinedState, AnyAction, Reducer } from "redux";
import auth, { AuthState } from "./slices/auth";
import purchaseRequisition, { RequisitionsState } from "./slices/Requisitions";
import dashboard, { DashBoardState } from "./slices/dashboard";
import RtkQueryService from "../services/RtkQueryService.ts";
import layout, { LayoutState } from "./slices/layout/layoutSlice.ts";

export interface AsyncReducers {
  // eslint-disable-next-line
  [key: string]: Reducer<any, AnyAction>;
}

const staticReducers = {
  auth,
  layout,
  purchaseRequisition,
  dashboard,
  [RtkQueryService.reducerPath]: RtkQueryService.reducer,
};

export type RootState = CombinedState<{
  auth: CombinedState<AuthState>;
  layout: LayoutState;
  purchaseRequisition: CombinedState<RequisitionsState>;
  dashboard: CombinedState<DashBoardState>;
  [RtkQueryService.reducerPath]: any;
}>;

const rootReducer =
  (asyncReducers?: AsyncReducers) => (state: RootState, action: AnyAction) => {
    const combinedReducer = combineReducers({
      ...staticReducers,
      ...asyncReducers,
    });
    return combinedReducer(state as any, action);
  };

export default rootReducer;
