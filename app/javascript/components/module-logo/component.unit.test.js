import { fromJS } from "immutable";

import PrimeroLogo from "../../images/primero-logo.png";
import MRMLogo from "../../images/mrm-logo.png";
import { setupMountedComponent } from "../../test";
import { MODULES } from "../../config";
import { PrimeroModuleRecord } from "../application/records";

import ModuleLogo from "./component";

describe("<ModuleLogo />", () => {
  it("renders a default primero module logo", () => {
    const state = fromJS({
      application: {
        modules: [
          {
            unique_id: "test-1"
          }
        ]
      },
      user: {
        modules: ["test-1"]
      }
    });

    const { component } = setupMountedComponent(ModuleLogo, {}, state);

    expect(component.find("img").prop("src")).to.equal(PrimeroLogo);
  });

  it("renders a primero module logo from props", () => {
    const state = fromJS({
      application: {
        modules: [
          PrimeroModuleRecord({
            unique_id: MODULES.MRM
          })
        ]
      },
      user: {
        modules: [MODULES.MRM]
      }
    });

    const { component } = setupMountedComponent(ModuleLogo, {}, state);

    expect(component.find("img").prop("src")).to.equal(MRMLogo);
  });
});
