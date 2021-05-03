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

import * as utils from "./utils";

describe("<Nav /> - Selectors", () => {
  describe("getLogo", () => {
    describe("when module is primeromodule-mrm", () => {
      const primeroModule = "primeromodule-mrm";

      it("should return MRMLogo and PrimeroPictorial if white is false", () => {
        expect(utils.getLogo(primeroModule)).to.deep.equals([MRMLogo, PrimeroPictorial]);
      });

      it("should return MRMLogoWhite and PrimeroPictorial if white is true", () => {
        expect(utils.getLogo(primeroModule, true)).to.deep.equals([MRMLogoWhite, PrimeroPictorial]);
      });
    });

    describe("when module is primeromodule-gbv", () => {
      const primeroModule = "primeromodule-gbv";

      it("should return GBVLogo and GBVPictorial if white is false", () => {
        expect(utils.getLogo(primeroModule)).to.deep.equals([GBVLogo, GBVPictorial]);
      });

      it("should return GBVLogoWhite and GBVPictorial if white is true", () => {
        expect(utils.getLogo(primeroModule, true)).to.deep.equals([GBVLogoWhite, GBVPictorial]);
      });
    });

    describe("when module is primeromodule-cp", () => {
      const primeroModule = "primeromodule-cp";

      it("should return CPIMSLogo and CPIMSPictorial if white is false", () => {
        expect(utils.getLogo(primeroModule)).to.deep.equals([CPIMSLogo, CPIMSPictorial]);
      });

      it("should return CPIMSLogoWhite and CPIMSPictorial if white is true", () => {
        expect(utils.getLogo(primeroModule, true)).to.deep.equals([CPIMSLogoWhite, CPIMSPictorial]);
      });
    });

    describe("when module is not a valid option", () => {
      const primeroModule = "primero";

      it("should return PrimeroLogo and PrimeroPictorial if white is false", () => {
        expect(utils.getLogo(primeroModule)).to.deep.equals([PrimeroLogo, PrimeroPictorial]);
      });

      it("should return PrimeroLogoWhite and PrimeroPictorial if white is true", () => {
        expect(utils.getLogo(primeroModule, true)).to.deep.equals([PrimeroLogoWhite, PrimeroPictorial]);
      });
    });
  });
});
