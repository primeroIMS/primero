import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { CASE, FAMILIES, FAMILY_FROM_CASE } from "../../config";
import { useMemoizedSelector } from "../../libs";
import { useI18n } from "../i18n";
import { fetchRecord, getLoadingRecordState, selectRecord } from "../records";
import { getRecordFormsByUniqueId } from "../record-form";
import SubformDrawer from "../record-form/form/subforms/subform-drawer";
import RecordFormTitle from "../record-form/form/record-form-title";
import { useApp } from "../application";
import LoadingIndicator from "../loading-indicator/component";
import SubformEmptyData from "../record-form/form/subforms/subform-empty-data";

import FamilyRecordHeader from "./components/family-record-header";
import FamilyRecordForm from "./components/family-record-form";
import { FAMILY_ID } from "./constants";

function Component({ values, primeroModule, mobileDisplay, handleToggleNav }) {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { online } = useApp();
  const caseFamilyForm = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      formName: FAMILY_FROM_CASE,
      primeroModule,
      recordType: CASE,
      getFirst: true
    })
  );
  const familyId = values[FAMILY_ID];
  const record = useMemoizedSelector(state =>
    selectRecord(state, { isEditOrShow: true, recordType: FAMILIES, id: familyId })
  );
  const isRecordLoading = useMemoizedSelector(state => getLoadingRecordState(state, FAMILIES));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const title = caseFamilyForm.getIn(["name", i18n.locale], null);
  const formName = caseFamilyForm.i18nName ? i18n.t(title) : title;

  const handleOpenMatch = () => {
    setDrawerOpen(true);
  };

  const handleCancel = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (record.isEmpty() && familyId && online) {
      dispatch(fetchRecord(FAMILIES, familyId));
    }
  }, [familyId, online, record.isEmpty()]);

  return (
    <>
      <RecordFormTitle mobileDisplay={mobileDisplay} handleToggleNav={handleToggleNav} displayText={formName} />
      {familyId ? (
        <LoadingIndicator loading={isRecordLoading} hasData={!record.isEmpty()}>
          <FamilyRecordHeader record={record} values={values} formName={formName} handleOpenMatch={handleOpenMatch} />
          <SubformDrawer open={drawerOpen} cancelHandler={handleCancel} title={formName}>
            <FamilyRecordForm record={record} handleCancel={handleCancel} />
          </SubformDrawer>
        </LoadingIndicator>
      ) : (
        <SubformEmptyData subformName={formName} single />
      )}
    </>
  );
}

Component.displayName = "CaseFamily";

Component.propTypes = {
  handleToggleNav: PropTypes.func.isRequired,
  mobileDisplay: PropTypes.bool.isRequired,
  primeroModule: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired
};

export default Component;
