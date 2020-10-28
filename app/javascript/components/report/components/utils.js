/* eslint-disable no-restricted-syntax */

export const tableToCsv = tableSelector => {
  const tableData = [];
  const rows = document.querySelectorAll(tableSelector);

  for (const row of rows) {
    const rowData = [];

    for (const value of row.querySelectorAll("th, td").entries()) {
      const column = value[1];

      rowData.push(column.innerText);
    }
    tableData.push(rowData.join(","));
  }

  return tableData.join("\n");
};

export const downloadFile = (blob, fileName) => {
  const encodedUri = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
};
