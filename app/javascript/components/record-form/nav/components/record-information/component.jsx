import { fromJS } from "immutable";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";

import { checkPermissions } from "../../../../../libs/permissions";
import NavGroup from "../nav-group";
import { useI18n } from "../../../../i18n";
import { RECORD_TYPES } from "../../../../../config";
import { getPermissionsByRecord } from "../../../../user/selectors";

import { NAME } from "./constants";
import { getRecordInformationNav } from "./utils";

const Component = ({ open, handleClick, selectedForm, formGroupLookup, match, recordAlerts }) => {
  const { params } = match;
  const { recordType } = params;
  const i18n = useI18n();
  const recordInformationNavs = getRecordInformationNav(i18n, RECORD_TYPES[recordType]);

  const userPermissions = useSelector(state => getPermissionsByRecord(state, recordType));
  const forms = recordInformationNavs.reduce((acum, form) => {
    if (isEmpty(form.permission_actions) || checkPermissions(userPermissions, form.permission_actions)) {
      return acum.push(form);
    }

    return acum;
  }, fromJS([]));

  return (
    <>
      <NavGroup
        group={forms}
        handleClick={handleClick}
        open={open}
        selectedForm={selectedForm}
        formGroupLookup={formGroupLookup}
        recordAlerts={recordAlerts}
      />
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formGroupLookup: PropTypes.object,
  handleClick: PropTypes.func,
  match: PropTypes.object.isRequired,
  open: PropTypes.string,
  recordAlerts: PropTypes.object,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withRouter(Component);
