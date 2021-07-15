import { useEffect } from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { batch, useDispatch } from "react-redux";
import isEmpty from "lodash/isEmpty";

import ActionDialog, { useDialog } from "../../../../action-dialog";
import { useI18n } from "../../../../i18n";
import { useMemoizedSelector } from "../../../../../libs";
import { getRecords } from "../../../../index-table/selectors";
import { getDisableLocationsErrors, getDisableLocationsLoading } from "../selectors";
import { disableLocations } from "../action-creators";
import { ACTION_NAME } from "../constants";

import { NAME } from "./constants";

const Component = ({ filters, selectedRecords, setSelectedRecords, recordType }) => {
  const dispatch = useDispatch();

  const data = useMemoizedSelector(state => getRecords(state, recordType));
  const loading = useMemoizedSelector(state => getDisableLocationsLoading(state));
  const errors = useMemoizedSelector(state => getDisableLocationsErrors(state));

  const { dialogOpen, dialogClose, params } = useDialog(NAME);
  const i18n = useI18n();
  const action = params?.get("action");

  const handleClose = () => {
    dialogClose();
    setSelectedRecords({});
  };

  const handleSuccess = () => {
    const locationIndexes = Object.values(selectedRecords).flat();
    const locationIds = locationIndexes.map(index => data.getIn(["data", index], fromJS({}))?.get("id"));

    batch(() => {
      dispatch(
        disableLocations(
          locationIds,
          filters,
          i18n.t("admin.locations.updated", { updated_records: locationIds.length }),
          action === ACTION_NAME.disable
        )
      );
    });
  };

  useEffect(() => {
    if (!loading && !errors && !isEmpty(selectedRecords)) {
      setSelectedRecords({});
    }
  }, [loading]);

  return (
    <ActionDialog
      open={dialogOpen}
      successHandler={handleSuccess}
      cancelHandler={handleClose}
      dialogTitle={i18n.t(`location.${action}_title`)}
      confirmButtonLabel={i18n.t(`actions.${action}`)}
      pending={loading}
      omitCloseAfterSuccess
    >
      <p>{i18n.t(`location.${action}_text`)}</p>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  filters: PropTypes.object,
  recordType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selectedRecords: PropTypes.object,
  setSelectedRecords: PropTypes.object
};

export default Component;
