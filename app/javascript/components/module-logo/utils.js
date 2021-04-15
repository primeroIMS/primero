/* eslint-disable import/prefer-default-export */
import PrimeroLogo from "../../images/primero-logo.png";
import PrimeroLogoWhite from "../../images/primero-logo-white.png";
import GBVLogo from "../../images/gbv-logo.png";
import GBVLogoWhite from "../../images/gbv-logo-white.png";
import MRMLogo from "../../images/mrm-logo.png";
import MRMLogoWhite from "../../images/mrm-logo-white.png";
import CPIMSLogo from "../../images/cpims-logo.png";
import CPIMSLogoWhite from "../../images/cpims-logo-white.png";
import PrimeroPictorial from "../../images/primero-pictorial.png";
import GBVPictorial from "../../images/gbv-pictorial.png";
import CPIMSPictorial from "../../images/cpims-pictorial.png";
import { MODULES } from "../../config";

export const getLogo = (moduleLogo, white = false) => {
  switch (moduleLogo) {
    case MODULES.MRM:
      return [white ? MRMLogoWhite : MRMLogo, PrimeroPictorial];
    case MODULES.GBV:
      return [white ? GBVLogoWhite : GBVLogo, GBVPictorial];
    case MODULES.CP:
      return [white ? CPIMSLogoWhite : CPIMSLogo, CPIMSPictorial];
    default:
      return [white ? PrimeroLogoWhite : PrimeroLogo, PrimeroPictorial];
  }
};
