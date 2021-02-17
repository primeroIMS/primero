import { fromJS } from "immutable";
import { Link } from "react-router-dom";

import { setupMockFormComponent } from "../../../../../../test";

import TranslationsNote from "./component";

describe("<SettingsTab />", () => {
  let component;

  beforeEach(() => {
    ({ component } = setupMockFormComponent(TranslationsNote, {
      props: { moduleId: "primeromodule-my-module", parentForm: "parent" },
      state: fromJS({
        forms: {
          options: { lookups: [{ id: 1, unique_id: "lookup-form-group-my-module-parent" }] }
        }
      })
    }));
  });

  it("should render <SettingsTab />", () => {
    expect(component.find(TranslationsNote)).to.have.lengthOf(1);
  });

  it("should render a link to the lookup", () => {
    const lookupLink = component.find(TranslationsNote).find(Link);

    expect(lookupLink).to.have.lengthOf(1);
    expect(lookupLink.props().to).to.equal("/admin/lookups/1/edit");
  });
});
