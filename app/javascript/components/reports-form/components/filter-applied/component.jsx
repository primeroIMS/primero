import PropTypes from "prop-types";
import { IconButton, makeStyles } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

import { useI18n } from "../../../i18n";
import { getOptions } from "../../../record-form/selectors";
import { OPTION_TYPES } from "../../../form/constants";
import { dataToJS, useMemoizedSelector, useThemeHelper } from "../../../../libs";
import useOptions from "../../../form/use-options";
import { formatValue } from "../filters/utils";

import { NAME } from "./constants";
import { getConstraintLabel } from "./utils";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ filter, field, handleClickOpen, handleClickEdit, optionSources }) => {
  const i18n = useI18n();
  const { isRTL } = useThemeHelper();
  const css = useStyles();

  const [index, { data }] = filter;
  const { value } = data;

  const allLookups = useMemoizedSelector(state => getOptions(state));
  const location = useOptions({ source: OPTION_TYPES.LOCATION, run: optionSources[OPTION_TYPES.LOCATION] });
  const agencies = useOptions({ source: OPTION_TYPES.AGENCY, run: optionSources[OPTION_TYPES.AGENCY] });
  const modules = useOptions({ source: OPTION_TYPES.MODULE, run: optionSources[OPTION_TYPES.MODULE] });
  const formGroups = useOptions({ source: OPTION_TYPES.FORM_GROUP, run: optionSources[OPTION_TYPES.FORM_GROUP] });

  const lookups = [
    ...dataToJS(allLookups),
    ...[{ unique_id: OPTION_TYPES.LOCATION, values: dataToJS(location) }],
    ...[{ unique_id: OPTION_TYPES.AGENCY, values: dataToJS(agencies) }],
    ...[{ unique_id: OPTION_TYPES.MODULE, values: dataToJS(modules) }],
    ...[{ unique_id: OPTION_TYPES.FORM_GROUP, values: dataToJS(formGroups) }]
  ];

  const constraintLabel = getConstraintLabel(data, field, i18n);

  const formattedReportFilterName = [
    // eslint-disable-next-line camelcase
    field?.display_text || "",
    i18n.t("report.filters.is"),
    constraintLabel,
    formatValue(value, i18n, { field, lookups })
  ].join(" ");

  const renderIcon = isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />;

  return (
    <div key={index} className={css.filterContainer}>
      <div className={css.filterName}>{formattedReportFilterName}</div>
      <div className={css.filterActions}>
        <IconButton onClick={handleClickOpen(index)}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={handleClickEdit(index)}>{renderIcon}</IconButton>
      </div>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  field: PropTypes.object,
  filter: PropTypes.object,
  handleClickEdit: PropTypes.func,
  handleClickOpen: PropTypes.func,
  optionSources: PropTypes.object
};

export default Component;
