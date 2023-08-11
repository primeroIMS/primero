import { fromJS } from "immutable";

import { mountedFormComponent, screen } from "../../test-utils";

import ReportTranslationsDialog from "./component";
import { NAME } from "./constants";

describe("<ReportsForm />/components/<TranslationsDialog/> - Container", () => {
  const state = fromJS({
    ui: { dialogs: { dialog: NAME, open: true } },
    application: { primero: { locales: ["en", "fr", "ar"] } }
  });

  it("should render <TranslationsDialog /> with fields for the selected locale", async () => {
   await mountedFormComponent(<ReportTranslationsDialog />, {
      props: { mode: "edit" },
      state,
      includeFormMethods: true
    });
   expect(screen.getAllByRole('dialog')).toHaveLength(1);
    expect(screen.getAllByRole("textbox")).toHaveLength(3);
  });
});
