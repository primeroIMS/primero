import { MY_CASES_FILTER_NAME, OR_FILTER_NAME } from "../constants";

export default (field, params) => field.field_name === MY_CASES_FILTER_NAME && params[OR_FILTER_NAME];
