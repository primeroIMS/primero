import ContactInformation from "../../contact-information";
import NotImplemented from "../../not-implemented/component";

import { CodeOfConduct, TermOfUse } from "./components";
import { SUPPORT_FORMS } from "./constants";

export const menuList = (i18n, disableCodeOfConduct) => [
  {
    id: SUPPORT_FORMS.contactInformation,
    text: i18n.t(`navigation.support_menu.${SUPPORT_FORMS.contactInformation}`)
  },
  {
    id: SUPPORT_FORMS.termsOfUse,
    text: i18n.t(`navigation.support_menu.${SUPPORT_FORMS.termsOfUse}`)
  },
  {
    id: SUPPORT_FORMS.codeOfConduct,
    text: i18n.t(`navigation.support_menu.${SUPPORT_FORMS.codeOfConduct}`),
    disabled: disableCodeOfConduct
  }
];

export const renderSupportForm = id => {
  switch (id) {
    case SUPPORT_FORMS.contactInformation:
      return ContactInformation;
    case SUPPORT_FORMS.codeOfConduct:
      return CodeOfConduct;
    case SUPPORT_FORMS.termsOfUse:
      return TermOfUse;

    default:
      return NotImplemented;
  }
};
