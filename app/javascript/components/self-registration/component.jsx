import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

import Form from "../form";
import { useI18n } from "../i18n";
import { useApp } from "../application";
import DisableOffline from "../disable-offline";
import { ConditionalWrapper, useThemeHelper } from "../../libs";
import ActionButton, { ACTION_BUTTON_TYPES } from "../action-button";
import { PageHeading } from "../page";
import { ROUTES } from "../../config";

import { form, validationSchema } from "./form";
import { FORM_ID } from "./constants";
import css from "./styles.css";
import { registerUser } from "./action-creators";

function Component() {
  const { online, allowSelfRegistration, registrationStreams, registrationStreamsConsentText } = useApp();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { mobileDisplay } = useThemeHelper();

  // TODO: Will need to adjust currentStream if we eventually allow multiple streams
  const currentStream = registrationStreams.getIn([0, "id"]);
  const formSections = form({ i18n, registrationStreamsConsentText, stream: currentStream });
  const validations = validationSchema(i18n);

  const handleSubmit = async values => {
    dispatch(registerUser({ ...values, registration_stream: currentStream }));
  };

  if (!allowSelfRegistration) {
    return <Redirect to={ROUTES.login} />;
  }

  return (
    <div>
      <PageHeading title={i18n.t("self_registration.title")} noPadding noElevation />
      <Form formSections={formSections} validations={validations} onSubmit={handleSubmit} formID={FORM_ID} />
      <ConditionalWrapper condition={!online} wrapper={DisableOffline} offlineTextKey="unavailable_offline">
        <ActionButton
          id={FORM_ID}
          text="self_registration.save"
          type={ACTION_BUTTON_TYPES.default}
          size="large"
          rest={{
            fullWidth: mobileDisplay,
            form: FORM_ID,
            type: "submit",
            className: css.registerButton
          }}
          disabled={!online}
        />
      </ConditionalWrapper>
    </div>
  );
}

Component.displayName = "SelfRegistration";

export default Component;
