import { fromJS } from "immutable";

export const getCodeOfConduct = state => state.getIn(["records", "codeOfConduct", "data"], fromJS({}));

export const getLoadingCodeOfConduct = state => state.getIn(["records", "codeOfConduct", "loading"], false);
