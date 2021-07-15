import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import { buildFormGroupUniqueId } from "../../utils";
import { useI18n } from "../../../../../i18n";
import useOptions from "../../../../../form/use-options";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ moduleId, parentForm }) => {
  const css = useStyles();
  const i18n = useI18n();

  const formGroupLookup = useOptions({ source: buildFormGroupUniqueId(moduleId, parentForm), fullLookup: true });

  return (
    <p className={css.translationsNote}>
      <strong>{i18n.t("forms.translations.note")}</strong> {i18n.t("forms.translations.note_form_group")}{" "}
      <Link to={`/admin/lookups/${formGroupLookup.get("id")}/edit`}>
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
