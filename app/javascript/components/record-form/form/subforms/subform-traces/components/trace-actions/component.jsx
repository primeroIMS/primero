import React from "react";
import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CheckIcon from "@material-ui/icons/Check";

import Permission from "../../../../../../application/permission";
import { RESOURCES, SHOW_FIND_MATCH } from "../../../../../../../libs/permissions";
import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";
import { useI18n } from "../../../../../../i18n";
import { FORMS } from "../../constants";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ handleBack, handleConfirm, selectedForm }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <div className={css.buttonsRow}>
      <ActionButton
        icon={<ArrowBackIosIcon />}
        text={
          selectedForm === FORMS.trace
            ? i18n.t("tracing_request.back_to_traces")
            : i18n.t("tracing_request.back_to_potential_matches")
        }
        type={ACTION_BUTTON_TYPES.default}
        outlined
        rest={{
          onClick: handleBack
        }}
      />
      {selectedForm === FORMS.trace && (
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
      )}
      {selectedForm === FORMS.comparison && handleConfirm && (
        <ActionButton
          icon={<CheckIcon />}
          text={i18n.t("tracing_request.match")}
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            onClick: handleConfirm
          }}
        />
      )}
    </div>
  );
};

Component.propTypes = {
  handleBack: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  selectedForm: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
