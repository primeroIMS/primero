// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PrimeroLogo from "../../images/primero-logo.png";
import PrimeroLogoWhite from "../../images/primero-logo-white.png";
import GBVLogo from "../../images/gbv-logo.png";
import GBVLogoWhite from "../../images/gbv-logo-white.png";
import MRMLogo from "../../images/mrm-logo.png";
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
        expect(utils.getLogo(primeroModule)).toEqual([MRMLogo, PrimeroPictorial]);
      });

      it("should return MRMLogo and PrimeroPictorial if white is true", () => {
        expect(utils.getLogo(primeroModule, true)).toEqual([MRMLogo, PrimeroPictorial]);
      });
    });

    describe("when module is primeromodule-gbv", () => {
      const primeroModule = "primeromodule-gbv";

      it("should return GBVLogo and GBVPictorial if white is false", () => {
        expect(utils.getLogo(primeroModule)).toEqual([GBVLogo, GBVPictorial]);
      });

      it("should return GBVLogoWhite and GBVPictorial if white is true", () => {
        expect(utils.getLogo(primeroModule, true)).toEqual([GBVLogoWhite, GBVPictorial]);
      });
    });

    describe("when module is primeromodule-cp", () => {
      const primeroModule = "primeromodule-cp";

      it("should return CPIMSLogo and CPIMSPictorial if white is false", () => {
        expect(utils.getLogo(primeroModule)).toEqual([CPIMSLogo, CPIMSPictorial]);
      });

      it("should return CPIMSLogoWhite and CPIMSPictorial if white is true", () => {
        expect(utils.getLogo(primeroModule, true)).toEqual([CPIMSLogoWhite, CPIMSPictorial]);
      });
    });

    describe("when module is not a valid option", () => {
      const primeroModule = "primero";

      it("should return PrimeroLogo and PrimeroPictorial if white is false", () => {
        expect(utils.getLogo(primeroModule)).toEqual([PrimeroLogo, PrimeroPictorial]);
      });

      it("should return PrimeroLogoWhite and PrimeroPictorial if white is true", () => {
        expect(utils.getLogo(primeroModule, true)).toEqual([PrimeroLogoWhite, PrimeroPictorial]);
      });
    });
  });
});
