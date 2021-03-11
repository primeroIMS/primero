import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import SubformChip from "../../../subform-chip";
import { getOptions } from "../../../../../../form/selectors";
import { getFieldByName } from "../../../../../selectors";
import { compare } from "../../../../../../../libs";
import { useI18n } from "../../../../../../i18n";
import { TRACING_REQUEST_STATUS_FIELD_NAME } from "../../../../../../../config";
import { get } from "../../../../../../form/utils";

import { NAME } from "./constants";

const Component = ({ values }) => {
  const i18n = useI18n();
  const tracingRequestStatus = useSelector(state => getFieldByName(state, TRACING_REQUEST_STATUS_FIELD_NAME), compare);
  const tracingRequestStatusLookup = useSelector(
    state => getOptions(state, tracingRequestStatus.option_strings_source, i18n),
    compare
  );

  const status = get(
    tracingRequestStatusLookup?.find(option => option.id === values.tracing_request_status),
    ["display_text", i18n.locale]
  );

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
