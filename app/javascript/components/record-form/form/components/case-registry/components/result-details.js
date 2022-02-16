import { useDispatch } from "react-redux";
import { fromJS } from "immutable";

import { getRecordFormsByUniqueId } from "../../../..";
import { useMemoizedSelector } from "../../../../../../libs";
import { RECORD_TYPES } from "../../../../../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../action-button";
import css from "../../../subforms/styles.css";
import Table from "../../../../../pdf-exporter/components/table";

const ResultDetails = ({
  id,
  handleCancel,
  shouldSelect = false,
  handleReturn,
  setDrawerTitle,
  mode,
  primeroModule,
  recordType
}) => {
  const dispatch = useDispatch();
  const formSection = useMemoizedSelector(state =>
    getRecordFormsByUniqueId(state, {
      checkVisible: false,
      formName: "basic_identity",
      primeroModule,
      recordType: RECORD_TYPES[recordType],
      getFirst: true
    })
  );
  const record = fromJS({});

  setDrawerTitle("Details");

  const selectButtonText = shouldSelect ? "Select" : "Deselect";
  const backButtonText = shouldSelect ? "Back to Results" : "Back to Case";
  const backButtonFunc = shouldSelect ? handleReturn : handleCancel;

  const handleSelection = () => {
    // connect to endpoint action
    handleCancel();
  };

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <ActionButton type={ACTION_BUTTON_TYPES.default} text={backButtonText} rest={{ onClick: backButtonFunc }} />
        {mode.isShow || (
          <ActionButton type={ACTION_BUTTON_TYPES.default} text={selectButtonText} onClick={handleSelection} />
        )}
      </div>
      <Table fields={formSection.fields} record={record} />
    </>
  );
};

ResultDetails.displayName = "ResultDetails";

export default ResultDetails;
