import { expect } from "chai";
import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../test";

import RequestApproval from "./component";

describe("<LoginSelection />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      RequestApproval,
      {},
      fromJS({

      })
    ).component;
  });

});
