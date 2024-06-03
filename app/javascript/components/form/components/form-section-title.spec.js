import { mountedComponent, screen } from "test-utils";

import { FormSectionRecord } from "../records";

import FormSectionTitle from "./form-section-title";

describe("<Form /> - components/<FormSectionTitle />", () => {
  it("should not render title if name not set on form section", () => {
    const formSection = FormSectionRecord({ unique_id: "form_section" });

    mountedComponent(<FormSectionTitle formSection={formSection} />);
    expect(screen.queryByText("Form Section Title")).toBeNull();
  });

  it("should render title if name set on form section", () => {
    const formSection = FormSectionRecord({
      unique_id: "form_section",
      name: "Form Section Title"
    });

    mountedComponent(<FormSectionTitle formSection={formSection} />);

    expect(screen.getByText("Form Section Title")).toBeInTheDocument();
  });
});
