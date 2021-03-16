import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CheckIcon from "@material-ui/icons/Check";
import BlockIcon from "@material-ui/icons/Block";

import Permission from "../../../../../../application/permission";
import { RESOURCES, SHOW_FIND_MATCH } from "../../../../../../../libs/permissions";
import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";
import { useI18n } from "../../../../../../i18n";
import { getLoadingRecordState } from "../../../../../../records";
import { FORMS } from "../../constants";
import { useMemoizedSelector } from "../../../../../../../libs";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ handleBack, handleConfirm, hasMatch, recordType, selectedForm, mode }) => {
  const i18n = useI18n();
  const css = useStyles();

  const loading = useMemoizedSelector(state => getLoadingRecordState(state, recordType));

  return (
    <div className={css.buttonsRow}>
      {handleBack && (
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
      )}
      {selectedForm === FORMS.trace && !mode.isEdit && (
        <Permission resources={RESOURCES.tracing_requests} actions={SHOW_FIND_MATCH}>
          <ActionButton
            icon={hasMatch ? <BlockIcon /> : <SearchIcon />}
            text={hasMatch ? i18n.t("tracing_request.unmatch") : i18n.t("tracing_request.find_match")}
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              onClick: handleConfirm
            }}
          />
        </Permission>
      )}
      {selectedForm === FORMS.comparison && handleConfirm && (
        <div>
          <ActionButton
            icon={<CheckIcon />}
            text={i18n.t("tracing_request.match")}
            type={ACTION_BUTTON_TYPES.default}
            pending={loading}
            rest={{
              onClick: handleConfirm,
              disabled: loading
            }}
          />
        </div>
      )}
    </div>
  );
};

Component.propTypes = {
  handleBack: PropTypes.func,
  handleConfirm: PropTypes.func,
  hasMatch: PropTypes.bool,
  mode: PropTypes.object,
  recordType: PropTypes.string.isRequired,
  selectedForm: PropTypes.string.isRequired
};

Component.displayName = NAME;

export default Component;
