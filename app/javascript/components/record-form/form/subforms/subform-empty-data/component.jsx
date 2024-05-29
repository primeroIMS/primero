// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import ErrorIcon from "@material-ui/icons/Error";

import css from "../styles.css";
import { useI18n } from "../../../../i18n";

import { NAME } from "./constants";

const Component = ({ subformName, single = false }) => {
  const i18n = useI18n();

  return (
    <div className={css.emptySubformContainer} data-testid="subform-empty-data">
      <ErrorIcon />
      <span>
        <strong>{i18n.t("forms.subform_not_found", { subform_name: subformName })}</strong>
        {i18n.t(single ? "forms.subform_need_to_be_added_single" : "forms.subform_need_to_be_added")}
      </span>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  single: PropTypes.bool,
  subformName: PropTypes.string
};

export default Component;
