const buildComponentColumns = (componentColumns, order, orderBy) => {
  if (order && orderBy) {
    const sortedColumn = componentColumns.findIndex(column => column.name === orderBy);

    if (sortedColumn) {
      return componentColumns.setIn([sortedColumn, "options", "sortOrder"], order);
    }

    return componentColumns;
  }

  return componentColumns;
};

export default buildComponentColumns;
