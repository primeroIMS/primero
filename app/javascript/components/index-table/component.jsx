import PropTypes from "prop-types";

import { useMemoizedSelector } from "../../libs";
import LoadingIndicator from "../loading-indicator";
import { getLoadingState } from "../record-form/selectors";

import { NAME } from "./config";
import { getRecords, getLoading, getErrors } from "./selectors";
import Datatable from "./components/data-table";

const Component = props => {
  const { recordType, targetRecordType } = props;
  const data = useMemoizedSelector(state => getRecords(state, recordType));
  const loading = useMemoizedSelector(state => getLoading(state, recordType));
  const errors = useMemoizedSelector(state => getErrors(state, recordType));
  const formsAreLoading = useMemoizedSelector(state => getLoadingState(state));

  const dataIsLoading = loading || formsAreLoading;
  const loadingIndicatorType = targetRecordType || recordType;
  const hasData = !dataIsLoading && Boolean(data?.size);

  return (
    <LoadingIndicator
      hasData={hasData}
      overlay
      fromTableList
      errors={errors}
      loading={dataIsLoading}
      type={loadingIndicatorType}
    >
      <Datatable data={data} {...props} />;
    </LoadingIndicator>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  bypassInitialFetch: false,
  canSelectAll: true,
  showCustomToolbar: false,
  useReportingLocations: false
};

Component.propTypes = {
  arrayColumnsToString: PropTypes.arrayOf(PropTypes.string),
  bypassInitialFetch: PropTypes.bool,
  canSelectAll: PropTypes.bool,
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.func, PropTypes.array]),
  defaultFilters: PropTypes.object,
  isRowSelectable: PropTypes.func,
  localizedFields: PropTypes.arrayOf(PropTypes.string),
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
