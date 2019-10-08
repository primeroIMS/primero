import "test/test.setup";
import { expect } from "chai";
import { setupMountedComponent } from "test";
import { NotImplemented } from "components/not-implemented";
import ReferralForm from "./referral-form";

describe("<ReferralForm />", () => {
  let component;
  beforeEach(() => {
    ({ component } = setupMountedComponent(ReferralForm, {}));
  });

  it("renders NotImplemented", () => {
    expect(component.find(NotImplemented)).to.have.length(1);
  });
});
