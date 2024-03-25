// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SearchIcon from "@material-ui/icons/Search";
import CheckIcon from "@material-ui/icons/Check";
import BlockIcon from "@material-ui/icons/Block";

import Permission, { RESOURCES, SHOW_FIND_MATCH } from "../../../../../../permissions";
import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";
import { getLoadingRecordState } from "../../../../../../records";
import { FORMS } from "../../constants";
import { useMemoizedSelector } from "../../../../../../../libs";

import { NAME } from "./constants";
import css from "./styles.css";

const Component = ({ handleBack, handleConfirm, hasMatch, recordType, selectedForm, mode }) => {
  const loading = useMemoizedSelector(state => getLoadingRecordState(state, recordType));

  return (
    <div className={css.buttonsRow} data-testid="subForm-traces">
      {handleBack && (
        <ActionButton
          icon={<ArrowBackIosIcon />}
          text={
            selectedForm === FORMS.trace
              ? "tracing_request.back_to_traces"
              : "tracing_request.back_to_potential_matches"
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
            text={hasMatch ? "tracing_request.unmatch" : "tracing_request.find_match"}
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
            text="tracing_request.match"
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
