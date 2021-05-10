import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import NavGroup from "../nav-group";
import { useI18n } from "../../../../i18n";
import { RECORD_TYPES } from "../../../../../config";
import { getPermissionsByRecord } from "../../../../user/selectors";
import { useMemoizedSelector } from "../../../../../libs";
import { getRecordInformationNav } from "../../../selectors";

import { NAME } from "./constants";

const Component = ({ open, handleClick, primeroModule, selectedForm, formGroupLookup, match, recordAlerts }) => {
  const { params } = match;
  const { recordType } = params;
  const i18n = useI18n();

  const userPermissions = useMemoizedSelector(state => getPermissionsByRecord(state, recordType));

  const recordInformationNav = useMemoizedSelector(state =>
    getRecordInformationNav(
      state,
      {
        checkVisible: true,
        i18n,
        recordType: RECORD_TYPES[recordType],
        primeroModule
      },
      userPermissions
    )
  );

  return (
    <>
      <NavGroup
        group={recordInformationNav}
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
  formGroupLookup: PropTypes.array,
  handleClick: PropTypes.func,
  match: PropTypes.object.isRequired,
  open: PropTypes.string,
  primeroModule: PropTypes.string,
  recordAlerts: PropTypes.object,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default withRouter(Component);
