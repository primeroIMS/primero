import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";

import ActionDialog from "../../../action-dialog";
import Form from "../../../form";
import { exportInsights } from "../../action-creators";
import { getInsightFilters } from "../../selectors";
import { RECORD_TYPES } from "../../../../config";
import { useMemoizedSelector } from "../../../../libs";
import { EXPORT_FORMAT } from "../../../record-actions/exports/constants";

import { NAME, FORM_ID } from "./constants";
import { form } from "./form";

const Component = ({ close, i18n, open, pending, setPending, moduleID }) => {
  const dispatch = useDispatch();
  const dialogPending = typeof pending === "object" ? pending.get("pending") : pending;
  const insightFilters = useMemoizedSelector(state => getInsightFilters(state));

  const onSubmit = data => {
    const params = fromJS({
      ...data,
      export_type: EXPORT_FORMAT.EXCEL,
      record_type: RECORD_TYPES.incidents,
      module_id: moduleID,
      filters: insightFilters
    });

    setPending(true);
    dispatch(exportInsights({ params, message: i18n.t("managed_reports.success_message") }));
  };

  return (
    <ActionDialog
      open={open}
      confirmButtonProps={{
        form: FORM_ID,
        type: "submit"
      }}
      cancelHandler={close}
      dialogTitle={i18n.t("buttons.export")}
      confirmButtonLabel={i18n.t("buttons.export")}
      pending={dialogPending}
      omitCloseAfterSuccess
    >
      <Form useCancelPrompt formID={FORM_ID} mode="new" formSections={form(i18n)} onSubmit={onSubmit} />
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  close: PropTypes.func,
  i18n: PropTypes.object,
  moduleID: PropTypes.string,
  open: PropTypes.bool,
  pending: PropTypes.bool,
  setPending: PropTypes.func,
};

export default Component;
