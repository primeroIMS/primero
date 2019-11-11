import MUIDataTable from "mui-datatables";
import PropTypes from "prop-types";
import React from "react";

const DashboardTable = ({ columns, data }) => {
  const options = {
    responsive: "stacked",
    fixedHeader: false,
    elevation: 0,
    filter: false,
    download: false,
    search: false,
    print: false,
    viewColumns: false,
    serverSide: true,
    customToolbar: () => null,
    customToolbarSelect: () => null,
    onTableChange: () => null,
    pagination: false,
    selectableRows: "none"
  };

  const tableOptions = {
    columns,
    options,
    data: data.toJS()
  };

  return <MUIDataTable {...tableOptions} />;
};

DashboardTable.displayName = "DashboardTable";

DashboardTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired
};

export default DashboardTable;
