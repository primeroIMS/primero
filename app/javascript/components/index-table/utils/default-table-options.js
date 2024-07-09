// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { OFFLINE_ROWS_PER_PAGE_OPTIONS, ROWS_PER_PAGE_OPTIONS } from "../../../config";

const defaultTableOptions = ({
  currentPage,
  customToolbarSelect,
  handleTableChange,
  i18n,
  per,
  selectedRecords,
  selectedRecordsOnCurrentPage,
  setSelectedRecords,
  showCustomToolbar,
  simple,
  sortDir,
  title,
  total,
  online
}) => {
  if (simple) {
    return {
      responsive: "vertical",
      fixedHeader: false,
      elevation: 0,
      filter: false,
      download: false,
      search: false,
      print: false,
      viewColumns: false,
      serverSide: true,
      setTableProps: () => ({ "aria-label": title }),
      customToolbar: () => null,
      onTableChange: () => null,
      pagination: false,
      selectableRows: "none",
      sort: false
    };
  }

  return {
    responsive: "vertical",
    count: total,
    rowsPerPage: per,
    rowHover: true,
    filterType: "checkbox",
    fixedHeader: true,
    elevation: 3,
    filter: false,
    download: false,
    search: false,
    print: false,
    viewColumns: false,
    serverSide: true,
    setTableProps: () => ({ "aria-label": title }),
    customToolbar: showCustomToolbar && customToolbarSelect,
    selectableRows: "multiple",
    rowsSelected: selectedRecordsOnCurrentPage?.length ? selectedRecordsOnCurrentPage : [],
    onRowSelectionChange: (_currentRowsSelected, allRowsSelected) => {
      setSelectedRecords({
        [currentPage]: allRowsSelected.map(ars => ars.dataIndex)
      });
    },
    onColumnSortChange: () => selectedRecords && setSelectedRecords({}),
    onTableChange: handleTableChange,
    rowsPerPageOptions: online ? ROWS_PER_PAGE_OPTIONS : OFFLINE_ROWS_PER_PAGE_OPTIONS,
    page: currentPage,
    enableNestedDataAccess: ".",
    sortOrder: sortDir,
    customToolbarSelect,
    textLabels: {
      body: {
        noMatch: i18n.t("messages.record_list.no_match"),
        toolTip: i18n.t("messages.record_list.sort"),
        columnHeaderTooltip: ({ label }) => i18n.t("messages.record_list.column_header_tooltip", { column: label })
      },
      pagination: {
        rowsPerPage: i18n.t("messages.record_list.rows_per_page"),
        displayRows: i18n.t("messages.record_list.of")
      }
    }
  };
};

export default defaultTableOptions;
