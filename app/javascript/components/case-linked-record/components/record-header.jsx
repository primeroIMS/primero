// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

import LoadingIndicator from "../../loading-indicator/component";
import { ConditionalWrapper, useMemoizedSelector, useThemeHelper } from "../../../libs";
import DisableOffline from "../../disable-offline";
import { getLoadingRecordState } from "../../records";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import css from "../../record-form/form/subforms/styles.css";
import { useApp } from "../../application";
import { RECORD_TYPES_PLURAL } from "../../../config";

function Component({ fieldNames, handleOpenMatch, record, linkedRecordType, values }) {
  const { online } = useApp();
  const { isRTL } = useThemeHelper();
  const isRecordLoading = useMemoizedSelector(state =>
    getLoadingRecordState(state, RECORD_TYPES_PLURAL[linkedRecordType])
  );

  return (
    <LoadingIndicator loading={isRecordLoading} hasData={!record.isEmpty()}>
      <List dense classes={{ root: css.list }} disablePadding>
        <ConditionalWrapper
          condition={!record.get("complete", false) && !online}
          wrapper={DisableOffline}
          offlineTextKey="unavailable_offline"
        >
          <ListItem component="a" onClick={handleOpenMatch} classes={{ root: css.listItem }}>
            <ListItemText classes={{ primary: css.listText, secondary: css.listTextSecondary }}>
              <div className={css.listItemText}>
                {fieldNames.map(fieldName => (
                  <span>{record.get(fieldName) || values[fieldName]}</span>
                ))}
              </div>
            </ListItemText>
            <ListItemSecondaryAction>
              <ActionButton
                icon={isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                type={ACTION_BUTTON_TYPES.icon}
                rest={{
                  className: css.subformShow,
                  onClick: handleOpenMatch
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </ConditionalWrapper>
      </List>
    </LoadingIndicator>
  );
}

Component.displayName = "RecordHeader";

Component.propTypes = {
  fieldNames: PropTypes.array.isRequired,
  handleOpenMatch: PropTypes.func.isRequired,
  linkedRecordType: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
