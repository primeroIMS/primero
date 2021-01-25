import { fromJS } from "immutable";

import * as utils from "./utils";

describe("components/exports/components/pdf-exporter/utils.js", () => {
  describe("with exposed properties", () => {
    it("should have known methods", () => {
      const clone = { ...utils };

      ["addPageHeaderFooter", "buildHeaderImage", "getLogosToRender"].forEach(property => {
        expect(clone).to.have.property(property);
        expect(clone[property]).to.be.a("function");
        delete clone[property];
      });
      expect(clone).to.be.empty;
    });
  });
  describe("getLogosToRender", () => {
    it("return an array of agencies", () => {
      const agencies = fromJS([
        {
          id: "agency1",
          name: "Agency 1",
          images: {
            logo_full: "example/logoFull/agency1",
            logo_icon: "example/logoIcon/agency1"
          }
        },
        {
          id: "agency2",
          name: "Agency 2",
          images: {
            logo_full: "example/logoFull/agency2",
            logo_icon: "example/logoIcon/agency2"
          }
        }
      ]);
      const user = fromJS({
        permissions: {},
        reportingLocationConfig: {},
        isAuthenticated: true,
        modules: ["primeromodule-cp"],
        listHeaders: {},
        agencyLogo: {
          id: 6,
          images: {
            logo_full: "example/logoFull/agency1",
            logo_icon: "example/logoIcon/agency1"
          }
        },
        roleId: "role-cp-case-worker",
        location: "GH",
        username: "test",
        permittedForms: [],
        locale: "en",
        id: 13,
        filters: {}
      });
      const includeOtherLogos = ["agency3"];
      const agencyLogosPdf = fromJS([
        {
          id: "agency3",
          name: "Agency 3",
          images: {
            logo_full: "example/logoFull/agency3",
            logo_icon: "example/logoIcon/agency3"
          }
        }
      ]);

      const expected = [
        {
          logoFull: "example/logoFull/agency1",
          name: "Agency 1"
        },
        {
          logoFull: "example/logoFull/agency2",
          name: "Agency 2"
        },
        {
          logoFull: "example/logoFull/agency3",
          name: "Agency 3"
        }
      ];

      expect(utils.getLogosToRender(agencies, user, includeOtherLogos, agencyLogosPdf, true, true)).to.deep.equal(
        expected
      );
    });
  });
});
