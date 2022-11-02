import { List } from "immutable";

const buildComponentColumns = (componentColumns, order, orderBy) => {
  const sortedColumns = List.isList(componentColumns) ? componentColumns : List(componentColumns);

  if (order && orderBy) {
    const sortedColumn = sortedColumns.findIndex(column => column.name === orderBy);

    if (sortedColumn) {
      return sortedColumns.setIn([sortedColumn, "options", "sortOrder"], order);
    }

    return sortedColumns;
  }

  return sortedColumns;
};

export default buildComponentColumns;
