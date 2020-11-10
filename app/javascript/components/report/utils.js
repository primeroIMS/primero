/* eslint-disable import/exports-last */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import omit from "lodash/omit";
import reject from "lodash/reject";
import max from "lodash/max";
import get from "lodash/get";
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

const getTranslatedKey = (key, field, { agencies, i18n }) => {
  const isBooleanKey = ["true", "false"].includes(key);

  if (field?.option_strings_source === "Agency" && agencies) {
    return dataToJS(agencies).find(agency => agency.id.toLowerCase() === key.toLowerCase())?.display_text;
  }

  if (i18n && isBooleanKey) {
    return i18n.t(key);
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
      const newRow = [getTranslatedKey(key, field, { agencies, i18n })];

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

// COLUMNS DATA

export const translateColumn = (column, value, locale = "en") => {
  if ("option_labels" in column) {
    return column.option_labels[locale].find(option => option.id === value)?.display_text || value;
  }

  return value;
};

const getColumnsObjects = (object, countRows) => {
  let level = 0;

  // eslint-disable-next-line consistent-return
  const getColumnsObj = obj => {
    if (level >= countRows) {
      return obj;
    }

    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i += 1) {
      level += 1;

      return getColumnsObj(obj[keys[i]]);
    }
  };

  // Removing "_total" from columns object
  return omit(getColumnsObj(object), "_total");
};

const getAllKeysObject = object => {
  const allKeys = (obj, prefix = "") => {
    return Object.keys(obj).reduce((acc, el) => {
      if (typeof obj[el] === "object") {
        return [...acc, ...allKeys(obj[el], `${prefix + el}.`)];
      }

      return [...acc, prefix + el];
    }, []);
  };

  return allKeys(object);
};

const cleanedKeys = (object, columns) => {
  const allKeys = getAllKeysObject(object);

  return reject(
    allKeys.map(r => {
      const splitted = r.split(".");

      const newSplitted = splitted.filter(s => splitted.length >= columns.length + 1 && s !== "_total");

      return newSplitted.join(".");
    }),
    isEmpty
  );
};

const formatColumns = (formattedKeys, columns) => {
  const items = columns.map((column, index) => {
    const columnsHeading = i =>
      formattedKeys.map(c => {
        const splitted = c.split(".");

        return translateColumn(column, splitted[i]);
      });

    const uniqueItems = uniq(columnsHeading(index).concat("Total"));

    return {
      items: uniqueItems
    };
  });

  const colspan = max(items.map((item, index) => (index === 1 ? item.items.length : 0)));

  return items.map((f, index) => {
    if (columns.length === 1) {
      return f.items;
    }

    return {
      ...f,
      colspan: index === columns.length - 1 ? 0 : colspan
    };
  });
};

export const getColumnsTableData = data => {
  if (isEmpty(data)) {
    return [];
  }

  const columns = data.fields.filter(field => field.position.type === "vertical");
  const qtyRows = data.fields.filter(field => field.position.type === "horizontal").length;
  const columnsObjects = getColumnsObjects(data.report_data, qtyRows);
  const cleaned = cleanedKeys(columnsObjects, columns);
  const renderColumns = formatColumns(cleaned, columns).flat();

  return renderColumns;
};

const getRowsTableData = data => {
  if (isEmpty(data.report_data)) {
    return [];
  }
  const rows = data.fields.filter(field => field.position.type === "horizontal");
  const accum = [];

  const rowEntries = Object.entries(data.report_data);

  rowEntries.forEach(entry => {
    const [key, value] = entry;
    const qtyOfParentKeys = rows.length;

    if (qtyOfParentKeys >= 2) {
      accum.push([key, value._total]);
      const result = Object.keys(value)
        .filter(val => val !== "_total")
        .map(rowDisplayName => {
          const childObject = getAllKeysObject(value[rowDisplayName]);

          const values = childObject.map(child => {
            return get(value[rowDisplayName], child);
          });

          return [rowDisplayName, ...values];
        });

      // Set rest of keys
      accum.push(...result);
    } else {
      const valuesAccesor = getAllKeysObject(value);
      const values = valuesAccesor.filter(val => val !== "_total").map(val => get(value, val));

      accum.push([key, ...values, value._total]);
    }
  });

  return accum;
};

const formatRows = rows => {
  const maxItems = max(rows.map(row => row.length));

  return rows.map(row => ({
    colspan: maxItems === row.length ? 0 : maxItems - 1,
    row
  }));
};

export const buildDataForTable = (report, i18n, { agencies }) => {
  const totalLabel = i18n.t("report.total");
  const reportData = report.toJS();

  const newColumns = getColumnsTableData(report.toJS());
  const newRows = getRowsTableData(report.toJS());

  const translatedReport = translateReportData(reportData, i18n);

  if (!translatedReport.report_data) {
    return { columns: [], values: [] };
  }

  const { fields } = report.toJS();
  const field = fields.filter(reportField => reportField.position.type === REPORT_FIELD_TYPES.vertical)[0];
  const dataColumns = getColumns(translatedReport.report_data, i18n);
  const columns = newColumns;

  const values = formatRows(newRows);

  return { columns, values };
};
