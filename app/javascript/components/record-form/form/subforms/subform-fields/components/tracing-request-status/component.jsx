import PropTypes from "prop-types";
import { fromJS } from "immutable";

import SubformChip from "../../../subform-chip";
import { getLookupByUniqueId } from "../../../../../../form/selectors";
import { getFieldByName } from "../../../../../selectors";
import { useMemoizedSelector } from "../../../../../../../libs";
import { useI18n } from "../../../../../../i18n";
import { TRACING_REQUEST_STATUS_FIELD_NAME } from "../../../../../../../config";

import { NAME } from "./constants";

const Component = ({ values }) => {
  const i18n = useI18n();

  const tracingRequestStatus = useMemoizedSelector(state => getFieldByName(state, TRACING_REQUEST_STATUS_FIELD_NAME));
  const tracingRequestStatusLookup = useMemoizedSelector(state =>
    getLookupByUniqueId(state, tracingRequestStatus.option_strings_source.replace(/lookup /, ""))
  );

  const status = tracingRequestStatusLookup
    ?.get("values", fromJS([]))
    ?.find(option => option.get("id") === values.tracing_request_status)
    ?.getIn(["display_text", i18n.locale]);

  return (
    <>
      {values.matched_case_id && <SubformChip label={i18n.t("tracing_request.has_match")} type="success" />}
      {values.tracing_request_status && <SubformChip label={status || values.tracing_request_status} />}
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  values: PropTypes.object.isRequired
};

export default Component;
