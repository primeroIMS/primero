import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

import { useI18n } from "../../../i18n";
import { getFieldByName, getOptions } from "../../../record-form/selectors";
import { OPTION_TYPES } from "../../../form/constants";
import { dataToJS, displayNameHelper, useMemoizedSelector, useThemeHelper } from "../../../../libs";
import useOptions from "../../../form/use-options";
import { formatValue } from "../filters/utils";
import { CONSTRAINTS } from "../../constants";
import { LOGICAL_OPERATORS } from "../../../../libs/expressions/constants";

import { NAME } from "./constants";
import { getConstraintLabel } from "./utils";
import css from "./styles.css";

const Component = ({
  filter,
  handleClickOpen,
  handleClickEdit,
  conditionTypes = [],
  constraints = CONSTRAINTS,
  deleteDisabled
}) => {
  const i18n = useI18n();
  const { isRTL } = useThemeHelper();
  const [index, { data }] = filter;
  const { attribute, value } = data;
  const field = useMemoizedSelector(state => getFieldByName(state, attribute));

  const allLookups = useMemoizedSelector(state => getOptions(state));
  const location = useOptions({
    source: OPTION_TYPES.LOCATION,
    run: field?.option_strings_source === OPTION_TYPES.LOCATION
  });
  const agencies = useOptions({
    source: OPTION_TYPES.AGENCY,
    run: field?.option_strings_source === OPTION_TYPES.AGENCY,
    useUniqueId: true
  });
  const modules = useOptions({
    source: OPTION_TYPES.MODULE,
    run: field?.option_strings_source === OPTION_TYPES.MODULE
  });
  const formGroups = useOptions({
    source: OPTION_TYPES.FORM_GROUP,
    run: field?.option_strings_source === OPTION_TYPES.FORM_GROUP
  });

  const lookups = [
    ...dataToJS(allLookups),
    ...[{ unique_id: OPTION_TYPES.LOCATION, values: dataToJS(location) }],
    ...[{ unique_id: OPTION_TYPES.AGENCY, values: dataToJS(agencies) }],
    ...[{ unique_id: OPTION_TYPES.MODULE, values: dataToJS(modules) }],
    ...[{ unique_id: OPTION_TYPES.FORM_GROUP, values: dataToJS(formGroups) }]
  ];

  const constraintLabel = getConstraintLabel(data, field, constraints, i18n);

  const conditionType = conditionTypes[index];
  const conditionName = i18n.t(`forms.conditions.types.${conditionType}.name`);

  const formattedReportFilterName = [
    // eslint-disable-next-line camelcase
    displayNameHelper(field?.display_name, i18n.locale),
    i18n.t("report.filters.is"),
    constraintLabel,
    formatValue(value, i18n, { field, lookups })
  ].join(" ");

  const renderIcon = isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />;

  return (
    <>
      <div key={index} className={css.filterContainer}>
        <div className={css.filterName}>
          {formattedReportFilterName}
          {conditionType === LOGICAL_OPERATORS.AND && <span className={css.filterType}>{conditionName}</span>}
        </div>
        <div className={css.filterActions}>
          <IconButton onClick={handleClickOpen(index, filter)} disabled={deleteDisabled}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={handleClickEdit(index, filter)}>{renderIcon}</IconButton>
        </div>
      </div>
      {conditionType === LOGICAL_OPERATORS.OR && <p>{conditionName}</p>}
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  conditionTypes: PropTypes.array,
  constraints: PropTypes.object,
  deleteDisabled: PropTypes.bool,
  filter: PropTypes.object,
  handleClickEdit: PropTypes.func,
  handleClickOpen: PropTypes.func
};

export default Component;
