
import { setupMountedThemeComponent } from "test";
import { expect } from "chai";

import UnicefLogo from "images/unicef.png";
import AgencyLogo from "./component";

describe("<AgencyLogo />", () => {
  it("renders agency logo from props", () => {
    const props = {
      logo: "http://primero.com/img.png",
      agency: "usng"
    };
    const component = setupMountedThemeComponent(AgencyLogo, props);

    expect(component.find("img").prop("src")).to.equal(props.logo);
    expect(component.find("img").prop("alt")).to.equal(props.agency);
  });

  it("renders default agency logo", () => {
    const component = setupMountedThemeComponent(AgencyLogo);

    expect(component.find("img").prop("src")).to.equal(UnicefLogo);
    expect(component.find("img").prop("alt")).to.equal("unicef");
  });
});
