import PropTypes from "prop-types";

import { useI18n } from "../../../../i18n";
import { SUBFORM_HEADER_TICKBOX } from "../constants";

const Component = ({ value, tickBoxLabel }) => {
  const i18n = useI18n();

  if (!value) return value || "";

  const renderValue = tickBoxLabel[i18n.locale] || i18n.t("yes_label");

  return <span>{renderValue}</span>;
};

Component.displayName = SUBFORM_HEADER_TICKBOX;

Component.propTypes = {
  tickBoxLabel: PropTypes.object,
  value: PropTypes.bool
};

export default Component;
