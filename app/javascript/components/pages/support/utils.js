import ContactInformation from "../../contact-information";
import NotImplemented from "../../not-implemented/component";

import { SUPPORT_FORMS } from "./constants";

export const menuList = i18n => [
  {
    id: SUPPORT_FORMS.contactInformation,
    text: i18n.t(`navigation.support_menu.${SUPPORT_FORMS.contactInformation}`)
  },
  {
    id: SUPPORT_FORMS.codeOfConduct,
    text: i18n.t(`navigation.support_menu.${SUPPORT_FORMS.codeOfConduct}`)
  },
  {
    id: SUPPORT_FORMS.termsOfUse,
    text: i18n.t(`navigation.support_menu.${SUPPORT_FORMS.termsOfUse}`)
    // disabled: true
  },
  {
    id: SUPPORT_FORMS.systemInformation,
    text: i18n.t(`navigation.support_menu.${SUPPORT_FORMS.systemInformation}`)
    // disabled: true
  }
];

// eslint-disable-next-line react/display-name
export const useSupportForm = id => {
  console.log("id", id);

  const Form = (formId => {
    switch (formId) {
      case SUPPORT_FORMS.contactInformation:
        return ContactInformation;

      default:
        return NotImplemented;
    }
  })(id);

  return <Form />;
};
