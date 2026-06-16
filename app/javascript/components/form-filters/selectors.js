/* eslint-disable import/prefer-default-export */
import { fromJS } from "immutable";

export const getFormFilters = state => state.getIn(["ui", "formFilters"], fromJS({}));
