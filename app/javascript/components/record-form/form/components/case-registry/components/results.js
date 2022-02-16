import { useCallback, useState } from "react";

import { useMemoizedSelector } from "../../../../../../libs";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../action-button";
import css from "../../../subforms/styles.css";
import IndexTable from "../../../../../index-table";
import LoadingIndicator from "../../../../../loading-indicator";
import { fetchFarmerSearchResults } from "../action-creators";
import { getLoading, getMetadata, getRegistrySearchResults } from "../selectors";

import ResultDetails from "./result-details";

const Results = ({
  setComponent,
  fields,
  searchParams,
  recordType,
  handleCancel,
  setDrawerTitle,
  mode,
  primeroModule
}) => {
  const [detailsID, setDetailsID] = useState(null);

  setDrawerTitle("Results");

  const isLoading = useMemoizedSelector(state => getLoading(state));
  const results = useMemoizedSelector(state => getRegistrySearchResults(state));
  const metadata = useMemoizedSelector(state => getMetadata(state));

  const handleTableChange = () => {
    return fetchFarmerSearchResults(searchParams);
  };

  const handleRowClick = record => {
    setDetailsID(record.get("id"));
  };

  const handleReturn = useCallback(() => {
    setDetailsID(null);
  }, [setDetailsID]);

  const tableOptions = {
    columns: [
      { name: "id", label: "id", id: true },
      ...fields.valueSeq().map(field => ({
        name: field.name,
        label: field.name
      }))
    ],
    title: "",
    defaultFilters: metadata,
    onTableChange: handleTableChange,
    recordType: "registrySearch",
    bypassInitialFetch: true,
    onRowClick: handleRowClick,
    options: { selectableRows: "none", rowsPerPageOptions: [], elevation: 0 }
  };

  const handleBack = () => {
    setComponent(0);
  };

  if (detailsID) {
    return (
      <ResultDetails
        shouldSelect
        id={detailsID}
        handleCancel={handleCancel}
        handleReturn={handleReturn}
        setDrawerTitle={setDrawerTitle}
        mode={mode}
        primeroModule={primeroModule}
        recordType={recordType}
      />
    );
  }

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <ActionButton type={ACTION_BUTTON_TYPES.default} text="Back to Search" rest={{ onClick: handleBack }} />
      </div>
      <LoadingIndicator hasData={results.size > 0} loading={isLoading} type="registry">
        <IndexTable {...tableOptions} />
      </LoadingIndicator>
    </>
  );
};

Results.displayName = "Results";

export default Results;
