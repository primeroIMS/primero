import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import { getLookupByUniqueId } from "../../../../../form/selectors";
import { compare } from "../../../../../../libs";
import { buildFormGroupUniqueId } from "../../utils";
import { useI18n } from "../../../../../i18n";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ moduleId, parentForm }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const formGroupLookup = useSelector(
    state => getLookupByUniqueId(state, buildFormGroupUniqueId(moduleId, parentForm)),
    compare
  );

  return (
    <p className={css.translationsNote}>
      <strong>{i18n.t("forms.translations.note")}</strong> {i18n.t("forms.translations.note_form_group")}{" "}
      <Link to={`/admin/lookups/${formGroupLookup?.get("id")}/edit`}>
        {i18n.t("forms.translations.edit_form_group")}
      </Link>
    </p>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  moduleId: PropTypes.string.isRequired,
  parentForm: PropTypes.string.isRequired
};

export default Component;
