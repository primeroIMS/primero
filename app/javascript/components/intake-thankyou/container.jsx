import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import ActionButton from "../action-button";
import { useMemoizedSelector } from "../../libs";
import { getRegistrationStreamsThankyouMessage, getRegistrationStreamsTitle } from "../application/selectors";
import { useI18n } from "../i18n";
import RecordFormToolbar from "../record-form/form/record-form-toolbar";

import css from "./styles.css";

function Container() {
  const params = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();

  const intakeStreamTitle = useMemoizedSelector(state => getRegistrationStreamsTitle(state));
  const intakeThankyouMessage = useMemoizedSelector(state => getRegistrationStreamsThankyouMessage(state));

  const handleContinue = () => {
    dispatch(push(`/intake/${params.id}/new`));
  };

  const toolbarProps = {
    title: intakeStreamTitle.getIn([i18n.locale, params.id], ""),
    params: {},
    mode: {}
  };

  return (
    <>
      <RecordFormToolbar {...toolbarProps} />
      <div className={css.container}>
        <div>{intakeThankyouMessage.getIn([i18n.locale, params.id], "")}</div>
        <ActionButton onClick={handleContinue} text="buttons.start_over" />
      </div>
    </>
  );
}

Container.displayName = "IntakeThankYou";

export default Container;
