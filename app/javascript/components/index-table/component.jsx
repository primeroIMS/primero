/* eslint-disable react-hooks/exhaustive-deps */
import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { dataToJS } from "libs";
import { useSelector, useDispatch } from "react-redux";
import { getPermissionsByRecord } from "components/user/selectors";
import { LoadingIndicator } from "components/loading-indicator";
import { push } from "connected-react-router";
import { ViewModal } from "./view-modal";
import {
  selectRecords,
  selectLoading,
  selectErrors,
  selectFilters
} from "./selectors";

const checkPermissions = (currentPermissions, allowedPermissions) => {
  return (
    currentPermissions &&
    currentPermissions.filter(permission => {
      return allowedPermissions.includes(permission);
    }).size > 0
  );
};

const IndexTable = ({
  columns,
  recordType,
  onTableChange,
  defaultFilters,
  options: tableOptionsProps,
  targetRecordType
}) => {
  const dispatch = useDispatch();
  const data = useSelector(state => selectRecords(state, recordType));
  const loading = useSelector(state => selectLoading(state, recordType));
  const errors = useSelector(state => selectErrors(state, recordType));
  const filters = useSelector(state => selectFilters(state, recordType));
  const [openViewModal, setOpenViewModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const { order, order_by: orderBy } = filters || {};
  const records = data.get("data");
  const per = data.getIn(["metadata", "per"], 20);
  const total = data.getIn(["metadata", "total"], 0);
  const page = data.getIn(["metadata", "page"], null);
  const url = targetRecordType || recordType;

  const userPermissions = useSelector(state =>
    getPermissionsByRecord(state, recordType)
  );

  const canViewModal = checkPermissions(userPermissions, ["display_view_page"]);

  const handleViewModalClose = () => {
    setOpenViewModal(false);
  };

  let componentColumns =
    typeof columns === "function" ? columns(data) : columns;

  useEffect(() => {
    dispatch(
      onTableChange({
        recordType,
        options: { per, ...defaultFilters.merge(filters).toJS() }
      })
    );
  }, [columns]);

  if (order && orderBy) {
    const sortedColumn = componentColumns.findIndex(c => c.name === orderBy);

    if (sortedColumn) {
      componentColumns = componentColumns.setIn(
        [sortedColumn, "options", "sortDirection"],
        order
      );
    }
  }

  const handleTableChange = (action, tableState) => {
    const options = { per, ...defaultFilters.merge(filters).toJS() };
    const validActions = ["sort", "changeRowsPerPage", "changePage"];

    const { activeColumn, columns: tableColumns, rowsPerPage } = tableState;

    const selectedFilters = Object.assign(
      {},
      options,
      (() => {
        switch (action) {
          case "sort":
            if (typeof sortOrder === "undefined") {
              options.order = tableColumns[activeColumn].sortDirection;
            } else {
              options.order =
                order === tableColumns[activeColumn].sortDirection
                  ? "asc"
                  : "desc";
            }
            options.order_by = tableColumns[activeColumn].name;
            options.page = page === 0 ? 1 : page;
            break;
          case "changeRowsPerPage":
            options.per = rowsPerPage;
            break;
          case "changePage":
            options.page = tableState.page >= page ? page + 1 : page - 1;
            break;
          default:
            break;
        }
      })()
    );

    if (validActions.includes(action)) {
      dispatch(onTableChange({ recordType, options: selectedFilters }));
    }
  };

  const options = Object.assign(
    {
      responsive: "stacked",
      count: total,
      rowsPerPage: per,
      rowHover: true,
      filterType: "checkbox",
      fixedHeader: false,
      elevation: 3,
      filter: false,
      download: false,
      search: false,
      print: false,
      viewColumns: false,
      serverSide: true,
      customToolbar: () => null,
      customToolbarSelect: () => null,
      onTableChange: handleTableChange,
      rowsPerPageOptions: [20, 50, 75, 100],
      page: page - 1,
      onRowClick: (rowData, rowMeta) => {
        const notAllowedToOpenCase = true; // need to know how to check
        if (notAllowedToOpenCase && canViewModal) {
          setCurrentRecord(records.get(rowMeta.dataIndex));
          setOpenViewModal(true);
        } else {
          dispatch(push(`${url}/${records.getIn([rowMeta.dataIndex, "id"])}`));
        }
      }
    },
    tableOptionsProps
  );

  const tableOptions = {
    columns: componentColumns,
    options,
    data: dataToJS(records)
  };

  const loadingIndicatorProps = {
    overlay: true,
    hasData: !!records,
    type: recordType,
    loading,
    errors
  };

  const DataTable = () => (
    <LoadingIndicator {...loadingIndicatorProps}>
      <MUIDataTable {...tableOptions} />
    </LoadingIndicator>
  );

  return (
    <>
      <DataTable />
      <ViewModal
        close={handleViewModalClose}
        openViewModal={openViewModal}
        currentRecord={currentRecord}
      />
    </>
  );
};

IndexTable.propTypes = {
  onTableChange: PropTypes.func.isRequired,
  columns: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  defaultFilters: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  options: PropTypes.object,
  targetRecordType: PropTypes.string
};

export default IndexTable;
