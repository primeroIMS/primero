import React from "react";
import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Permission from "../../../../../../application/permission";
import { RESOURCES, SHOW_FIND_MATCH } from "../../../../../../../libs/permissions";
import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";
import { useI18n } from "../../../../../../i18n";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ handleBack, handleConfirm }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <div className={css.buttonsRow}>
      <ActionButton
        icon={<ArrowBackIosIcon />}
        text={i18n.t("tracing_request.back_to_traces")}
        type={ACTION_BUTTON_TYPES.default}
        outlined
        rest={{
          onClick: handleBack
        }}
      />
      <Permission resources={RESOURCES.tracing_requests} actions={SHOW_FIND_MATCH}>
        <ActionButton
          icon={<SearchIcon />}
          text={i18n.t("tracing_request.find_match")}
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            onClick: handleConfirm
          }}
        />
      </Permission>
    </div>
  );
};

Component.propTypes = {
  handleBack: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired
};

Component.displayName = NAME;

export default Component;
