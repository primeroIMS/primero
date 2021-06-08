/* eslint-disable react/display-name, react/no-multi-comp */
import PropTypes from "prop-types";
import MUIDataTable from "mui-datatables";
import { MuiThemeProvider } from "@material-ui/core/styles";
import isEqual from "lodash/isEqual";

import { SUBFORM_SECTION } from "../../../../../../../form";
import { useI18n } from "../../../../../../../i18n";
import { headersToColumns } from "../../../../../utils";
import { getLabelTypeField } from "../../../utils";
import { getFormSections, getFieldsByIds } from "../../../../../forms-list/selectors";
import SelectionColumn from "../selection-column";
import { useMemoizedSelector } from "../../../../../../../../libs";
import useThemeHelpers from "../../../../../../../../libs/use-theme-helpers";

import fieldsTableTheme from "./theme";
import { COLUMN_HEADERS, NAME } from "./constants";

const Component = ({ addField, fieldQuery, parentForm, primeroModule, removeField, selectedFields }) => {
  const i18n = useI18n();
  const { theme } = useThemeHelpers({ overrides: fieldsTableTheme });

  const optionsColumn = {
    name: "name",
    label: "  ",
    options: {
      filter: false,
      customBodyRender: (value, tableMeta) => {
        const currentField = { id: tableMeta.rowData[4], name: value };
        const selected = selectedFields.some(field => isEqual(field, currentField));

        return (
          <SelectionColumn addField={addField} removeField={removeField} field={currentField} selected={selected} />
        );
      }
    }
  };
  const columns = [
    ...headersToColumns(COLUMN_HEADERS, i18n),
    optionsColumn,
    { name: "id", options: { filter: false, display: false } }
  ];
  const formSections = useMemoizedSelector(state => getFormSections(state, { primeroModule, recordType: parentForm }));
  const fieldIds = formSections
    .valueSeq()
    .map(form => form.get("fields"))
    .reduce((prev, current) => [...prev, ...current], []);

  const fields = useMemoizedSelector(state => getFieldsByIds(state, fieldIds));

  const data = fields
    .filter(field => field.get("type") !== SUBFORM_SECTION)
    .map(field => ({
      display_name: field.getIn(["display_name", i18n.locale], ""),
      form: formSections.getIn([field.get("form_section_id").toString(), "name", i18n.locale], ""),
      type: i18n.t(`fields.${getLabelTypeField(field)}`),
      name: field.get("name"),
      id: field.get("id")
    }));

  const rowsSelected = selectedFields.map(selectedField => {
    const { name, id } = selectedField;
    const index = data.findIndex(field => field.name === name && field.id === id);

    return index >= 0 ? index : data.findIndex(field => field.name === name);
  });

  const options = {
    responsive: "vertical",
    rowHover: true,
    filter: false,
    sort: false,
    download: false,
    search: false,
    print: false,
    viewColumns: false,
    selectableRows: "multiple",
    selectableRowsHeader: false,
    selectableRowsHideCheckboxes: true,
    selectToolbarPlacement: "none",
    elevation: 0,
    rowsSelected,
    searchText: fieldQuery
  };

  const tableOptions = {
    columns,
    options,
    data
  };

  return (
    <MuiThemeProvider theme={theme}>
      <MUIDataTable {...tableOptions} />
    </MuiThemeProvider>
  );
};

Component.displayName = NAME;

Component.defaultProps = {
  selectedFields: []
};

Component.propTypes = {
  addField: PropTypes.func.isRequired,
  fieldQuery: PropTypes.string.isRequired,
  parentForm: PropTypes.string.isRequired,
  primeroModule: PropTypes.string.isRequired,
  removeField: PropTypes.func.isRequired,
  selectedFields: PropTypes.array
};

export default Component;
