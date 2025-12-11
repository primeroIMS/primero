// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { batch, useDispatch } from "react-redux";

import ActionDialog, { useDialog } from "../../../../../action-dialog";
import { useI18n } from "../../../../../i18n";
import { useMemoizedSelector } from "../../../../../../libs";
import { getRecords } from "../../../../../index-table/selectors";
import { getDisableUsersLoading } from "../../selectors";
import { disableUsers } from "../../action-creators";

import { NAME } from "./constants";

function Component({ filters, selectedRecords, setSelectedRecords, recordType }) {
  const dispatch = useDispatch();

  const data = useMemoizedSelector(state => getRecords(state, recordType));
  const loading = useMemoizedSelector(state => getDisableUsersLoading(state));

  const selectedRecordsLength = Object.values(selectedRecords || {}).flat()?.length;

  const { dialogOpen, dialogClose, params } = useDialog(NAME);
  const i18n = useI18n();
  const action = params?.get("action");

  const handleClose = () => {
    dialogClose();
    setSelectedRecords({});
  };

  const handleSuccess = () => {
    const userIndex = Object.values(selectedRecords).flat();
    const userIds = userIndex.map(index => data.getIn(["data", index], fromJS({}))?.get("id"));

    batch(() => {
      dispatch(
        disableUsers({
          filters: selectedRecordsLength <= data.getIn(["data"]).size ? fromJS({ ids: userIds }) : filters,
          currentFilters: filters,
          message: i18n.t(`users.${action}_success`, { users_selected: selectedRecordsLength })
        })
      );
    });

    setSelectedRecords({});
  };

  return (
    <ActionDialog
      open={dialogOpen}
      successHandler={handleSuccess}
      cancelHandler={handleClose}
      dialogTitle={i18n.t(`users.${action}_title`)}
      confirmButtonLabel={i18n.t(`actions.${action}`)}
      pending={loading}
      omitCloseAfterSuccess
    >
      <p data-testid="selection-indicator">
        {i18n.t(`users.${action}_selection_indicartor`, { users_selected: selectedRecordsLength })}
      </p>
      <p data-testid="action-text">{i18n.t(`users.${action}_text`)}</p>
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  filters: PropTypes.object,
  recordType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selectedRecords: PropTypes.object,
  setSelectedRecords: PropTypes.func
};

export default Component;
