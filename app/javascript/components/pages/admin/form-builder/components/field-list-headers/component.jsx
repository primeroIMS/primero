// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { cx } from "@emotion/css"

import { useI18n } from "../../../../../i18n";
import css from "../fields-list/styles.css";

function Component({ isNested }) {
  const i18n = useI18n();

  const nameClasses = cx([css.fieldColumn, css.fieldName, css.fieldHeader]);
  const fieldTypeClasses = cx([css.fieldColumn, css.fieldHeader]);
  const fieldShowClasses = cx([css.fieldColumn, css.fieldHeader, css.fieldShow]);

  return (
    <>
      <div className={nameClasses}>{i18n.t("fields.name")}</div>
      <div className={fieldTypeClasses}>{i18n.t("fields.type")}</div>
      {isNested && <div className={fieldTypeClasses}>{i18n.t("fields.subform_sort_by")}</div>}
      {isNested && <div className={fieldTypeClasses}>{i18n.t("fields.subform_group_by")}</div>}
      <div className={fieldShowClasses}>{i18n.t("fields.show")}</div>
    </>
  );
}

Component.displayName = "FieldListHeader";

Component.propTypes = {
  isNested: PropTypes.bool
};

export default Component;
