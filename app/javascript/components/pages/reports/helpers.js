import { isEqual, uniq, isEmpty } from "lodash";

const getColors = () => {
  return ["#e0dfd6", "#595951", "#bcbcab", "green", "red", "yellow", "blue"];
};

const getColorsByIndex = index => {
  return getColors()[index];
};

const getColumnData = (column, data, i18n, columnData) => {
  const totalLabel = i18n.t("report.total");
  const keys = Object.keys(data);
  const currentData = columnData || [];
  keys
    .filter(key => key !== totalLabel)
    .forEach(key => {
      if (data[key][column]) {
        currentData.push(data[key][column][totalLabel]);
      }
      getColumnData(column, data[key], i18n, currentData);
    });
  return currentData;
};

const getColumns = (data, i18n, prevData) => {
  const values = Object.values(data);
  const keys = Object.keys(data);
  const totalLabel = i18n.t("report.total");
  // Most likely the data has a single level of nesting.
  if (Object.keys(values[0]).length === 1 && !prevData) {
    return [];
  }
  if (values.length === 1 && keys.includes(totalLabel)) {
    return prevData
      ? Object.keys(prevData).filter(key => key !== totalLabel)
      : [];
  }
  return getColumns(values[0], i18n, data);
};

const containsColumns = (columns, data, i18n) => {
  const totalLabel = i18n.t("report.total");
  const keys = Object.keys(data).filter(key => key !== totalLabel);
  return isEqual(columns, keys);
};

const dataSet = (columns, data, i18n, results) => {
  const totalLabel = i18n.t("report.total");
  const dataResults = results || [];
  if (!isEmpty(columns)) {
    columns.forEach((c, i) => {
      dataResults.push({
        label: c,
        data: getColumnData(c, data, i18n),
        backgroundColor: getColorsByIndex(i)
      });
    });
  } else {
    Object.keys(data).forEach((c, i) => {
      dataResults.push({
        label: c,
        data: [data[c][totalLabel]],
        backgroundColor: getColorsByIndex(i)
      });
    });
  }
  return dataResults;
};

const getRows = (columns, data, i18n, rows, row) => {
  const totalLabel = i18n.t("report.total");
  const currentRows = rows || [];
  const currentRow = row || [];
  const keys = Object.keys(data);
  const values = Object.values(data);
  keys
    .filter(key => key !== totalLabel)
    .forEach(key => {
      const newRow = [key];
      if (!(values.length === 1 && keys.includes(totalLabel))) {
        if (!containsColumns(columns, data[key], i18n)) {
          columns.forEach(() => newRow.push(""));
          newRow.push(data[key][totalLabel]);
          currentRows.push(newRow);
        } else {
          columns.forEach(c => newRow.push(data[key][c][totalLabel]));
          newRow.push(data[key][totalLabel]);
          currentRows.push(newRow);
          return;
        }
      }
      getRows(columns, data[key], i18n, currentRows, currentRow);
    });
  return currentRows;
};

const getLabels = (columns, data, i18n, labels) => {
  const totalLabel = i18n.t("report.total");
  const currentLabels = labels || [];
  const keys = Object.keys(data);
  keys.forEach(key => {
    if (containsColumns(columns, data[key], i18n)) {
      currentLabels.push(keys.filter(label => label !== totalLabel));
    }
    getLabels(columns, data[key], i18n, currentLabels);
  });
  return uniq(currentLabels.flat());
};

const translateKeys = (keys, field, locale) => {
  if (!isEmpty(field.option_labels)) {
    const translations = field.option_labels[locale];
    return translations.filter(translation => keys.includes(translation.id));
  }
  if (field.option_strings_source === "Location") {
    // TODO: Pull locations
  }
  return [];
};

const translateData = (data, fields, i18n, translated) => {
  const currentTranslations = translated || {};
  const keys = Object.keys(data);
  const { locale } = i18n;
  if (keys.length === 1 && keys.includes("_total")) {
    currentTranslations[i18n.t("report.total")] = data._total;
    delete currentTranslations._total;
  } else if (!isEmpty(keys)) {
    const field = fields.shift();
    const storedFields = [...fields];
    const translations = translateKeys(keys, field, locale);
    keys.forEach(key => {
      const translation = translations.find(t => t.id === key);
      let translatedKey = key;
      if (translation) {
        translatedKey = translation.display_text;
        currentTranslations[translatedKey] = { ...data[key] };
      }
      if (key === "_total") {
        translatedKey = i18n.t("report.total");
        currentTranslations[translatedKey] = data[key];
      }
      delete currentTranslations[key];
      const translatedData = translateData(
        data[key],
        [...storedFields],
        i18n,
        currentTranslations[translatedKey]
      );
      currentTranslations[translatedKey] = translatedData;
    });
  }

  return currentTranslations;
};

export const translateReportData = (report, i18n) => {
  const translatedReport = { ...report };
  if (translatedReport.report_data) {
    translatedReport.report_data = translateData(
      report.report_data,
      report.fields,
      i18n
    );
  }
  return translatedReport;
};

export const buildDataForGraph = (report, i18n) => {
  const reportData = report.toJS();
  if (!reportData.report_data) {
    return {};
  }
  const translatedReport = translateReportData(reportData, i18n);
  const columns = getColumns(translatedReport.report_data, i18n);
  const graphData = {
    description: translatedReport.description
      ? translatedReport.description[i18n.locale]
      : "",
    data: {
      labels: getLabels(columns, translatedReport.report_data, i18n),
      datasets: dataSet(columns, translatedReport.report_data, i18n)
    }
  };
  return graphData;
};

export const buildDataForTable = (report, i18n) => {
  const totalLabel = i18n.t("report.total");
  const reportData = report.toJS();
  const translatedReport = translateReportData(reportData, i18n);
  if (!translatedReport.report_data) {
    return { columns: [], values: [] };
  }
  const dataColumns = getColumns(translatedReport.report_data, i18n);
  const columns = ["", dataColumns, totalLabel].flat();
  const values = getRows(dataColumns, translatedReport.report_data, i18n);
  return { columns, values };
};
