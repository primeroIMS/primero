import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../test-utils";
import { PrimeroModuleRecord } from "../application/records";
import { MODULES } from "../../config";

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

    mountedComponent(<ModuleLogo />, state);
    expect(screen.getByTestId("logo-primero")).toBeInTheDocument();
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

    mountedComponent(<ModuleLogo />, state);
    expect(screen.getByTestId("logo-primeromodule-mrm")).toBeInTheDocument();
  });
});
