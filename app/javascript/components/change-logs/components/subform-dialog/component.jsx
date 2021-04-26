import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import Timeline from "@material-ui/lab/Timeline";
import makeStyles from "@material-ui/core/styles/makeStyles";

import ActionDialog from "../../../action-dialog";
import LoadingIndicator from "../../../loading-indicator";
import ChangeLogItem from "../change-log-item";
import { useI18n } from "../../../i18n";
import { buildSubformDataItems } from "../../utils";
import styles from "../../styles.css";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({
  recordChanges,
  open,
  setOpen,
  calculatingChangeLog,
  allFields,
  allLookups,
  locations,
  setCalculatingChangeLog,
  allAgencies
}) => {
  const i18n = useI18n();
  const css = useStyles();
  const subformTitle = i18n.t("change_logs.changes_subform", {
    subform_name: recordChanges?.subformName
  });

  if (isEmpty(recordChanges)) {
    return null;
  }

  const onClose = () => {
    setOpen(false);
  };

  const renderItems = buildSubformDataItems(
    recordChanges,
    allFields,
    allAgencies,
    allLookups,
    locations,
    i18n
  ).map(item => <ChangeLogItem item={item} key={item.key} />);

  setCalculatingChangeLog(false);

  return (
    <>
      <ActionDialog
        dialogTitle={subformTitle}
        onClose={onClose}
        cancelHandler={onClose}
        open={open}
        maxSize="lg"
        disableActions
      >
        <LoadingIndicator loading={calculatingChangeLog} hasData={!isEmpty(renderItems)} type={NAME}>
          <Timeline classes={{ root: css.root }}>{renderItems}</Timeline>
        </LoadingIndicator>
      </ActionDialog>
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  allAgencies: PropTypes.array,
  allFields: PropTypes.object,
  allLookups: PropTypes.object,
  calculatingChangeLog: PropTypes.bool,
  locations: PropTypes.array,
  open: PropTypes.bool.isRequired,
  recordChanges: PropTypes.object,
  setCalculatingChangeLog: PropTypes.func,
  setOpen: PropTypes.func.isRequired
};

export default Component;
