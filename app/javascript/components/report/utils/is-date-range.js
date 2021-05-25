import { DATE_PATTERN } from "../constants";

export default date => date.match(new RegExp(`^${DATE_PATTERN} - ${DATE_PATTERN}$`));
