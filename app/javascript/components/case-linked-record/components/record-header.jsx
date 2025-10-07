// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

import LoadingIndicator from "../../loading-indicator/component";
import { ConditionalWrapper, useMemoizedSelector, useThemeHelper } from "../../../libs";
import DisableOffline from "../../disable-offline";
import { getLoadingRecordState, getRecordRelationshipsLoading } from "../../records";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../action-button";
import css from "../../record-form/form/subforms/styles.css";
import SubformEmptyData from "../../record-form/form/subforms/subform-empty-data";
import { useApp } from "../../application";
import { RECORD_TYPES_PLURAL } from "../../../config";

function Component({ fieldNames, handleOpenMatch, idField, linkedRecordType, linkedRecords, formName }) {
  const { online } = useApp();
  const { isRTL } = useThemeHelper();

  const isRecordLoading = useMemoizedSelector(state =>
    getLoadingRecordState(state, RECORD_TYPES_PLURAL[linkedRecordType])
  );

  const isRecordRelationshipsLoading = useMemoizedSelector(state =>
    getRecordRelationshipsLoading(state, RECORD_TYPES_PLURAL[linkedRecordType])
  );

  const hasData = !linkedRecords.isEmpty();

  if (!isRecordLoading && !isRecordRelationshipsLoading && !hasData) {
    return <SubformEmptyData subformName={formName} single />;
  }

  return (
    <LoadingIndicator loading={isRecordLoading || isRecordRelationshipsLoading} hasData={hasData}>
      <List dense classes={{ root: css.list }} disablePadding>
        {linkedRecords.map(linkedRecord => (
          <ConditionalWrapper
            condition={!linkedRecord?.get("complete", false) && !online}
            wrapper={DisableOffline}
            offlineTextKey="unavailable_offline"
            key={linkedRecord?.get(idField)}
          >
            <ListItem
              component="a"
              onClick={() => handleOpenMatch(linkedRecord.get(idField))}
              classes={{ root: css.listItem }}
            >
              <ListItemText classes={{ primary: css.listText, secondary: css.listTextSecondary }}>
                <div className={css.listItemText}>
                  {fieldNames.map(fieldName => (
                    <span>
                      {Array.isArray(fieldName) ? linkedRecord?.getIn(fieldName) : linkedRecord?.get(fieldName)}
                    </span>
                  ))}
                </div>
              </ListItemText>
              <ListItemSecondaryAction>
                <ActionButton
                  icon={isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  type={ACTION_BUTTON_TYPES.icon}
                  rest={{
                    className: css.subformShow,
                    onClick: () => handleOpenMatch(linkedRecord?.get(idField))
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </ConditionalWrapper>
        ))}
      </List>
    </LoadingIndicator>
  );
}

Component.displayName = "RecordHeader";

Component.propTypes = {
  fieldNames: PropTypes.array.isRequired,
  formName: PropTypes.string.isRequired,
  handleOpenMatch: PropTypes.func.isRequired,
  idField: PropTypes.string.isRequired,
  linkedRecords: PropTypes.object.isRequired,
  linkedRecordType: PropTypes.string.isRequired
};

export default Component;
