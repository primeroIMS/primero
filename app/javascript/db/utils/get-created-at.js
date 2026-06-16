import { isDate, parseISO } from "date-fns";

export default record => (isDate(record.created_at) ? record.created_at : parseISO(record.created_at));
