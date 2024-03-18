import { mountedFormComponent, screen } from "test-utils";

import TranslationsTab from "./component";

describe("<TranslationsTab />", () => {
  const props = {
    index: 1,
    tab: 1,
    formContextFields: {},
    fieldDialogMode: "new",
    moduleId: "module_1",
    parentForm: "parent"
  };

  beforeEach(() => {
    mountedFormComponent(<TranslationsTab {...props} />);
  });

  it("should render <TranslationTab />", () => {
    expect(screen.getByText("forms.translations.title")).toBeInTheDocument();
  });
});
