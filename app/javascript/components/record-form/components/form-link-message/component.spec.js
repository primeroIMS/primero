import { mountedComponent, screen, fireEvent } from "../../../../test-utils";

import FormLinkMessage from "./component";

describe("<FormLinkMessage />", () => {
  const translations = {
    "some.message": "Go to the %{link} to continue.",
    "some.link": "Other form"
  };
  const originalTranslate = window.I18n.t;

  const translate = (key, options) =>
    (translations[key] || key).replace(/%{(\w+)}/g, (_match, name) => options?.[name] ?? `[missing ${name} value]`);

  const props = { messageKey: "some.message", linkKey: "some.link", formUniqueId: "other_form" };

  beforeEach(() => {
    window.I18n.t = translate;
  });

  afterEach(() => {
    window.I18n.t = originalTranslate;
  });

  it("renders the link in place of the translation placeholder", () => {
    const { container } = mountedComponent(<FormLinkMessage {...props} />);

    expect(container.textContent).toBe("Go to the Other form to continue.");
  });

  it("renders the link after the message when the translation has no placeholder", () => {
    window.I18n.t = key => (key === "some.link" ? "Other form" : "Go elsewhere");

    const { container } = mountedComponent(<FormLinkMessage {...props} />);

    expect(container.textContent).toBe("Go elsewhere Other form");
  });

  it("selects the form when the link is clicked", () => {
    const { store } = mountedComponent(<FormLinkMessage {...props} />);

    fireEvent.click(screen.getByRole("button", { name: "Other form" }));

    expect(store.getActions()).toEqual(
      expect.arrayContaining([{ type: "forms/SET_SELECTED_FORM", payload: "other_form" }])
    );
  });

  it.each(["Enter", " "])("selects the form when the link is activated with the %p key", key => {
    const { store } = mountedComponent(<FormLinkMessage {...props} />);

    fireEvent.keyDown(screen.getByRole("button", { name: "Other form" }), { key });

    expect(store.getActions()).toEqual(
      expect.arrayContaining([{ type: "forms/SET_SELECTED_FORM", payload: "other_form" }])
    );
  });

  it("does not select the form for other keys", () => {
    const { store } = mountedComponent(<FormLinkMessage {...props} />);

    fireEvent.keyDown(screen.getByRole("button", { name: "Other form" }), { key: "Tab" });

    expect(store.getActions()).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ type: "forms/SET_SELECTED_FORM" })])
    );
  });

  it("does not propagate the click to its container", () => {
    const onContainerClick = jest.fn();

    mountedComponent(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={onContainerClick}>
        <FormLinkMessage {...props} />
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: "Other form" }));

    expect(onContainerClick).not.toHaveBeenCalled();
  });
});
