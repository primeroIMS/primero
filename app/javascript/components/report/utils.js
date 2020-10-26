/* eslint-disable camelcase */
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import { parse } from "date-fns";

import { dataToJS } from "../../libs";
import { REPORT_FIELD_TYPES } from "../reports-form/constants";

const getColors = () => {
  return ["#e0dfd6", "#595951", "#bcbcab", "green", "red", "yellow", "blue"];
};

const getColorsByIndex = index => {
  return getColors()[index];
};

const getDateFormat = value => {
  if (value.match(/^\w{3}-\d{4}$/)) {
    return "MMM-yyyy";
  }
  if (value.match(/^(\w{2}-)?\w{3}-\d{4}$/)) {
    return "dd-MMM-yyyy";
  }

  return null;
};

const translateDate = (value, i18n, dateFormat) => {
  const date = parse(value, dateFormat, new Date());

  return date ? i18n.localizeDate(date, dateFormat) : value;
};

const getColumnData = (column, data, i18n) => {
  const totalLabel = i18n.t("report.total");
  const keys = Object.keys(data);

  return keys
    .filter(key => key !== totalLabel)
    .map(key => {
      const columnValue = data[key][column] ? data[key][column][totalLabel] : getColumnData(column, data[key], i18n);

      return columnValue;
    })
    .flat();
};

const getColumns = (data, i18n) => {
  const totalLabel = i18n.t("report.total");

  console.log(data);

  return uniq(
    Object.values(data)
      .map(currValue => Object.keys(currValue))
      .flat()
  ).filter(key => key !== totalLabel);
};

const containsColumns = (columns, data, i18n) => {
  const totalLabel = i18n.t("report.total");
  const keys = Object.keys(data).filter(key => key !== totalLabel);

  return isEqual(columns, keys);
};

const getTranslatedKey = (key, field, { agencies }) => {
  if (field?.option_strings_source === "Agency" && agencies) {
    return dataToJS(agencies).find(agency => agency.id.toLowerCase() === key.toLowerCase())?.display_text;
  }

  return key;
};

const dataSet = (columns, data, i18n, fields, { agencies }) => {
  const totalLabel = i18n.t("report.total");
  const dataResults = [];
  const field =
    fields.length > 1
      ? fields.find(reportField => reportField.position.type === REPORT_FIELD_TYPES.vertical)
      : fields.shift();

  if (!isEmpty(columns)) {
    columns.forEach((column, i) => {
      dataResults.push({
        label: getTranslatedKey(column, field, { agencies }),
        data: getColumnData(column, data, i18n),
        backgroundColor: getColorsByIndex(i)
      });
    });
  } else {
    dataResults.push({
      label: totalLabel,
      data: Object.keys(data).map(column => data[column][totalLabel]),
      backgroundColor: getColorsByIndex(0)
    });
  }

  return dataResults;
};

const getRows = (columns, data, i18n, fields, { agencies }) => {
  const totalLabel = i18n.t("report.total");
  const currentRows = [];
  const field = fields.shift();
  const keys = Object.keys(data);
  const values = Object.values(data);

  keys
    .filter(key => key !== totalLabel)
    .forEach(key => {
      const newRow = [getTranslatedKey(key, field, { agencies })];

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

      currentRows.push(getRows(columns, data[key], i18n, fields, { agencies }));
    });

  return currentRows;
};

const getLabels = (columns, data, i18n, fields, { agencies }) => {
  const totalLabel = i18n.t("report.total");
  const currentLabels = [];
  const field = fields.shift();
  const keys = Object.keys(data);

  keys.forEach(key => {
    if (containsColumns(columns, data[key], i18n)) {
      currentLabels.push(keys.filter(label => label !== totalLabel));
    }
    currentLabels.concat(getLabels(columns, data[key], i18n, fields, { agencies }));
  });

  return uniq(currentLabels.flat()).map(key => getTranslatedKey(key, field, { agencies }));
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

const translateData = (data, fields, i18n) => {
  const currentTranslations = {};
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
      if (key === "_total") {
        const translatedKey = i18n.t("report.total");

        currentTranslations[translatedKey] = data[key];
        delete currentTranslations[key];
      } else {
        const dateFormat = getDateFormat(key);
        const translation = dateFormat
          ? { display_text: translateDate(key, i18n, dateFormat) }
          : translations.find(t => t.id === key);

        const translatedKey = translation ? translation.display_text : key;

        if (translation) {
          currentTranslations[translatedKey] = { ...data[key] };
          delete currentTranslations[key];
        }
        const translatedData = translateData(data[key], [...storedFields], i18n);

        currentTranslations[translatedKey] = translatedData;
      }
    });
  }

  return currentTranslations;
};

export const translateReportData = (report, i18n) => {
  const translatedReport = { ...report };

  if (translatedReport.report_data) {
    translatedReport.report_data = translateData(report.report_data, report.fields, i18n);
  }

  return translatedReport;
};

export const buildDataForGraph = (report, i18n, { agencies }) => {
  const reportData = report.toJS();

  if (!reportData.report_data) {
    return {};
  }
  const { fields } = report.toJS();
  const translatedReport = translateReportData(reportData, i18n);
  const columns = getColumns(translatedReport.report_data, i18n);

  const graphData = {
    description: translatedReport.description ? translatedReport.description[i18n.locale] : "",
    data: {
      labels: getLabels(columns, translatedReport.report_data, i18n, report.toJS().fields, { agencies }),
      datasets: dataSet(columns, translatedReport.report_data, i18n, fields, {
        agencies
      })
    }
  };

  return graphData;
};

export const buildDataForTable = (report, i18n, { agencies }) => {
  const totalLabel = i18n.t("report.total");
  const reportData = report.toJS();
  const translatedReport = translateReportData(reportData, i18n);

  if (!translatedReport.report_data) {
    return { columns: [], values: [] };
  }

  const { fields } = report.toJS();
  const field = fields.filter(reportField => reportField.position.type === REPORT_FIELD_TYPES.vertical)[0];
  const dataColumns = getColumns(translatedReport.report_data, i18n);

  const columns = ["", dataColumns, totalLabel].flat().map(column => {
    if (column === "" || column === totalLabel) {
      return column;
    }

    return getTranslatedKey(column, field, { agencies });
  });

  const values = getRows(dataColumns, translatedReport.report_data, i18n, fields, { agencies });

  return { columns, values };
};
