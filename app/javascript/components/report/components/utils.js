// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable no-restricted-syntax, no-plusplus */

const hasMergedRows = () => [...document.querySelectorAll("tr td").entries()].some(([, row]) => row.colSpan > 1);

const escapeCsvText = text => `"${text.replace(/"/g, '""')}"`;

const buildHeaders = (headers, mergedRows = false) => {
  const headerRows = mergedRows ? [""] : [];

  for (const value of headers.entries()) {
    const column = value[1];

    if (column.colSpan > 1) {
      for (let i = 0; i < column.colSpan; i++) {
        headerRows.push(escapeCsvText(column.innerText));
      }
    } else {
      headerRows.push(escapeCsvText(column.innerText));
    }
  }

  return headerRows;
};

export { escapeCsvText };

export const tableToCsv = tableSelector => {
  const tableData = [];
  const rows = document.querySelectorAll(tableSelector);
  const mergedRows = hasMergedRows();

  let mergedRowText = "";

  for (const row of rows) {
    const headers = buildHeaders(row.querySelectorAll("th"), mergedRows);

    if (headers.filter(header => header !== "").length) {
      tableData.push(headers.join(","));
    } else {
      const dataRow = [];

      for (const value of row.querySelectorAll("tr td").entries()) {
        const column = value[1];

        if (mergedRows) {
          dataRow[0] = mergedRowText;
        }

        if (column.colSpan > 1) {
          mergedRowText = escapeCsvText(column.innerText);
          dataRow[0] = mergedRowText;

          for (let i = 0; i < column.colSpan; i++) {
            dataRow.push("");
          }
        } else {
          dataRow.push(escapeCsvText(column.innerText));
        }
      }
      tableData.push(dataRow.join(","));
    }
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
