import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../libs";
import { getLoadingState } from "../record-form/selectors";

import { NAME } from "./config";
import { getRecords, getLoading, getErrors } from "./selectors";
import Datatable from "./components/data-table";

const Component = props => {
  const { recordType, targetRecordType, checkComplete } = props;
  const data = useMemoizedSelector(
    state => getRecords(state, recordType, checkComplete),
    (data1, data2) => data1.equals(data2)
  );
  const loading = useMemoizedSelector(state => getLoading(state, recordType));
  const errors = useMemoizedSelector(state => getErrors(state, recordType));
  const formsAreLoading = useMemoizedSelector(state => getLoadingState(state));

  const dataIsLoading = loading || formsAreLoading;
  const loadingIndicatorType = targetRecordType || recordType;

  return (
    <Datatable
      data={data}
      {...props}
      errors={errors}
      loading={dataIsLoading}
      loadingIndicatorType={loadingIndicatorType}
    />
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  bypassInitialFetch: false,
  canSelectAll: true,
  showCustomToolbar: false,
  useReportingLocations: true
};

Component.propTypes = {
  arrayColumnsToString: PropTypes.arrayOf(PropTypes.string),
  bypassInitialFetch: PropTypes.bool,
  canSelectAll: PropTypes.bool,
  checkComplete: PropTypes.bool,
  checkOnline: PropTypes.bool,
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.array]),
  defaultFilters: PropTypes.object,
  isRowSelectable: PropTypes.func,
  localizedFields: PropTypes.arrayOf(PropTypes.string),
  online: PropTypes.bool,
  onRowClick: PropTypes.func,
  onTableChange: PropTypes.func.isRequired,
  options: PropTypes.object,
  recordType: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  selectedRecords: PropTypes.object,
  setSelectedRecords: PropTypes.func,
  showCustomToolbar: PropTypes.bool,
  targetRecordType: PropTypes.string,
  title: PropTypes.string,
  useReportingLocations: PropTypes.bool
};

export default Component;
