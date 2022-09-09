import { fromJS, List } from "immutable";
import isEmpty from "lodash/isEmpty";

import { LOOKUPS, RECORD_TYPES_PLURAL, STRING_SOURCES_TYPES } from "../../../config";
import { displayNameHelper, valueFromOptionSource } from "../../../libs";
import useMemoizedSelector, { useProxySelector } from "../../../libs/use-memoized-selector";
import { getLookupsByIDs } from "../../form/selectors";
import useOptions from "../../form/use-options";
import { useI18n } from "../../i18n";
import { getFieldsByName } from "../../record-form/selectors";

import buildLocationsList from "./build-location-list";

export const buildComponentColumns = (componentColumns, order, orderBy) => {
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

export function useTranslatedRecords({
  records = fromJS([]),
  arrayColumnsToString,
  localizedFields,
  columnsName,
  validRecordTypes,
  useReportingLocations = true,
  recordType
}) {
  const i18n = useI18n();

  const allFields = useProxySelector(state => getFieldsByName(state, columnsName), [columnsName]);

  const fieldWithColumns = allFields.toSeq().filter(fieldName => {
    if (columnsName.includes(fieldName.get("name")) && !isEmpty(fieldName.get("option_strings_source"))) {
      return fieldName;
    }

    return null;
  });

  const columnsWithLookups = fieldWithColumns
    .groupBy(column => column.get("option_strings_source"))
    .valueSeq()
    .map(column => column.first());

  const optionsList = columnsWithLookups.map(field => field.get("option_strings_source"), fromJS([]));

  const allAgencies = useOptions({
    source: STRING_SOURCES_TYPES.AGENCY,
    useUniqueId: true,
    run: optionsList.includes(STRING_SOURCES_TYPES.AGENCY)
  });
  const allLookups = useMemoizedSelector(state => getLookupsByIDs(state, optionsList));

  const locationIDS = buildLocationsList(records, columnsWithLookups);

  const locations = useOptions({
    source: useReportingLocations ? LOOKUPS.reporting_locations : STRING_SOURCES_TYPES.LOCATION,
    run: optionsList.includes(LOOKUPS.reporting_locations) || optionsList.includes(STRING_SOURCES_TYPES.LOCATION),
    filterOptions: options => options.filter(location => locationIDS.includes(location.id)),
    useIncidentReportingLocationConfig: recordType === RECORD_TYPES_PLURAL.incident
  });

  if (localizedFields) {
    return records.map(current => {
      const translatedFields = localizedFields.reduce((acc, field) => {
        const translatedValue = displayNameHelper(current.get(field), i18n.locale);

        return acc.merge({
          [field]:
            field === "values"
              ? current
                  .get(field)
                  .map(value => displayNameHelper(value.get("display_text"), i18n.locale) || "")
                  .join(", ")
              : translatedValue
        });
      }, fromJS({}));

      return current.merge(translatedFields);
    });
  }

  const reducedRecords = () =>
    records.reduce((accum, record) => {
      const result = record.mapEntries(recordEntry => {
        const [key, value] = recordEntry;

        if (columnsWithLookups.map(columnWithLookup => columnWithLookup.name).includes(key)) {
          const optionStringsSource = columnsWithLookups
            .find(column => column.get("name") === key, null, fromJS({}))
            .get("option_strings_source");

          const recordValue = valueFromOptionSource(
            allAgencies,
            allLookups,
            locations,
            i18n.locale,
            optionStringsSource,
            value
          );

          return [key, recordValue];
        }

        return [key, value];
      });

      return accum.push(result);
    }, List());

  if (arrayColumnsToString) {
    return reducedRecords().map(currentRecord => {
      return currentRecord.map((value, key) => {
        if (arrayColumnsToString.includes(key)) {
          return value.join(", ");
        }

        return value;
      });
    });
  }

  if (allFields.size && records && validRecordTypes) {
    return reducedRecords();
  }

  return fromJS([]);
}

export default useTranslatedRecords;
