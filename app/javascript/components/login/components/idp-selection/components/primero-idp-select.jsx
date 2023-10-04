import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { fromJS } from "immutable";
import { useHistory } from "react-router-dom";

import { attemptIDPLogin } from "../action-creators";
import { useI18n } from "../../../../i18n";
import { signIn } from "../auth-provider";
import { PRIMERO_IDP, FORM_ID } from "../constants";
import { SELECT_FIELD } from "../../../../form/constants";
import Form, { FormAction, FieldRecord, FormSectionRecord } from "../../../../form";
import { useApp } from "../../../../application";
import { ConditionalWrapper } from "../../../../../libs";
import disableOffline from "../../../../disable-offline";

const Component = ({ identityProviders, css }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const history = useHistory();
  const { online } = useApp();

  const primeroIdp = identityProviders.find(idp => idp.get("unique_id") === PRIMERO_IDP);

  const tokenCallback = accessToken => {
    dispatch(attemptIDPLogin(accessToken));
  };

  const handleSubmit = data => {
    const idp = identityProviders.find(prov => prov.get("unique_id") === data.idp);

    signIn(idp, tokenCallback, history);
  };

  if (primeroIdp && identityProviders?.size === 1) {
    return null;
  }

  const options = identityProviders.reduce((acc, idp) => {
    const uniqueID = idp.get("unique_id");

    if (uniqueID === PRIMERO_IDP) return acc;

    return [...acc, { id: idp.get("unique_id"), display_text: idp.get("name") }];
  }, []);

  const formSections = fromJS([
    FormSectionRecord({
      unique_id: "idp-form",
      fields: fromJS([
        FieldRecord({
          name: "idp",
          type: SELECT_FIELD,
          disabled: !online,
          option_strings_text: {
            [i18n.locale]: options
          }
        })
      ])
    })
  ]);

  return (
    <>
      <p className={css.selectProvider}>{i18n.t("select_provider")}</p>
      <div className={css.idpSelectContainer}>
        <Form
          formSections={formSections}
          onSubmit={handleSubmit}
          formID={FORM_ID}
          submitAllFields
          errorMessage={i18n.t("select_idp_error")}
        />
        <ConditionalWrapper wrapper={disableOffline} condition={!online} offlineTextKey="unavailable_offline">
          <FormAction options={{ form: FORM_ID, type: "submit" }} text={i18n.t("go")} />
        </ConditionalWrapper>
      </div>
    </>
  );
};

Component.propTypes = {
  css: PropTypes.object,
  identityProviders: PropTypes.object
};

Component.displayName = "PrimeroIdpSelect";

export default Component;
