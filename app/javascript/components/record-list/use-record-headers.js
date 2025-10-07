import { useMemoizedSelector } from "../../libs";
import { getListHeaders } from "../application";
import { getFiltersValuesByRecordType } from "../index-filters";
import { ACTIONS, usePermissions } from "../permissions";

function useRecordHeaders({ recordType, excludes = [] }) {
  const filters = useMemoizedSelector(state => getFiltersValuesByRecordType(state, recordType));
  const listHeaders = useMemoizedSelector(state => getListHeaders(state, recordType));
  const { canSearchOthers } = usePermissions(recordType, { canSearchOthers: [ACTIONS.SEARCH_OTHERS] });

  const headers = listHeaders.filter(header => !excludes.includes(header.field_name));

  return { headers: filters.id_search && canSearchOthers ? headers.filter(header => header.id_search) : headers };
}

export default useRecordHeaders;
