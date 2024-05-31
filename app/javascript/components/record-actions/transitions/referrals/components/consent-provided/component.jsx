// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";

import { CasesIcon } from "../../../../../../images/primero-icons";
import { useI18n } from "../../../../../i18n";

import css from "./styles.css";

const Component = ({ children }) => {
  const i18n = useI18n();

  return (
    <Alert icon={<CasesIcon className={css.icon} />} classes={{ root: css.alert, message: css.message }}>
      <AlertTitle>{i18n.t("referral.provided_consent_label")}</AlertTitle>
      {children}
    </Alert>
  );
};

Component.displayName = "ConsentProvided";

Component.propTypes = {
  children: PropTypes.node
};

export default Component;
