import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import qs from "qs";

import { useI18n } from "../../i18n";
import ActionDialog from "../../action-dialog";
import Form, { FORM_MODE_DIALOG } from "../../form";
import { bulkAddFlag } from "../../flagging/action-creators";
import { form, validationSchema } from "../../flagging/components/flag-form/form";
import { toServerDateFormat, useMemoizedSelector } from "../../../libs";
import buildSelectedIds from "../utils/build-selected-ids";
import buildAppliedFilters from "../utils/build-applied-filters";
import { getFiltersValuesByRecordType } from "../../index-filters/selectors";
import { getMetadata } from "../../record-list/selectors";
import { getRecordsData } from "../../index-table";

import { NAME, FORM_ID } from "./constants";

function Component({ close, open, currentPage, selectedRecords, recordType, clearSelectedRecords }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = qs.parse(location.search.replace("?", ""));

  const records = useMemoizedSelector(state => getRecordsData(state, recordType));
  const appliedFilters = useMemoizedSelector(state => getFiltersValuesByRecordType(state, recordType));
  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));

  const selectedIds = buildSelectedIds(selectedRecords, records, currentPage, "id");
  const selectedRecordsLength = Object.values(selectedRecords || {}).flat()?.length;
  const count = selectedRecordsLength || selectedIds.length;
  const totalRecords = metadata?.get("total", 0);
  const currentRecordsSize = records?.size || 0;

  const handleSubmit = data => {
    const allCurrentRowsSelected =
      selectedRecordsLength > 0 && currentRecordsSize > 0 && selectedRecordsLength === currentRecordsSize;
    const allRecordsSelected = selectedRecordsLength === totalRecords;
    const filters = buildAppliedFilters(
      false,
      allCurrentRowsSelected,
      selectedIds,
      appliedFilters,
      queryParams,
      null,
      allRecordsSelected
    );

    dispatch(
      bulkAddFlag(
        { data: { ...filters, message: data.message, date: data.date } },
        i18n.t("flags.bulk_flag_success", { count }),
        `${recordType}/flags`
      )
    );
    clearSelectedRecords();
  };

  const schema = validationSchema({
    labels: {
      message: i18n.t("forms.required_field", { field: i18n.t("flags.flag_reason") })
    }
  });

  const defaultValues = { date: toServerDateFormat(Date.now()), message: "" };

  return (
    <ActionDialog
      open={open}
      dialogTitle={i18n.t("flags.bulk_flag_title")}
      dialogSubHeader={i18n.t("flags.bulk_selected", { count })}
      confirmButtonLabel={i18n.t("buttons.flag_records")}
      confirmButtonProps={{ form: FORM_ID, type: "submit" }}
      cancelHandler={close}
    >
      <Form
        mode={FORM_MODE_DIALOG}
        formSections={form(i18n)}
        onSubmit={handleSubmit}
        initialValues={defaultValues}
        validations={schema}
        formID={FORM_ID}
        showTitle={false}
      />
    </ActionDialog>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  clearSelectedRecords: PropTypes.func,
  close: PropTypes.func,
  currentPage: PropTypes.number,
  open: PropTypes.bool,
  recordType: PropTypes.string,
  selectedRecords: PropTypes.object
};

export default Component;
