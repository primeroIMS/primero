// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import { fireEvent, waitFor } from "@testing-library/react";

import { mountedComponent, screen, userEvent } from "../../test-utils";

import Summary from "./component";

describe("<Summary />", () => {
  const props = {
    record: fromJS({}),
    recordType: "case",
    mobileDisplay: false,
    handleToggleNav: () => {},
    form: {},
    mode: { isNew: false }
  };

  const formProps = { initialValues: { name: "" } };

  const initialState = fromJS({});

  it("should render a <RecordFormTitle /> component", () => {
    mountedComponent(<Summary {...props} />, initialState, {}, [], formProps);

    expect(screen.getByTestId("record-form-title")).toBeInTheDocument();
  });

  it("should render 3 <ActionButton /> component", () => {
    mountedComponent(<Summary {...props} />, initialState, {}, [], formProps);

    expect(screen.getAllByTestId("action-button")).toHaveLength(3);
  });

  it("should render 5 <FormSectionField /> components", () => {
    mountedComponent(<Summary {...props} />, initialState, {}, [], formProps);

    expect(screen.getAllByTestId("form-section-field")).toHaveLength(5);
  });

  it("should render a <SubformDrawer /> when find match is clicked", async () => {
    mountedComponent(<Summary {...props} values={{ consent_for_tracing: true }} />, initialState, {}, [], formProps);

    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "cases.summary.find_match" }));

    expect(screen.getAllByTestId("drawer")).toHaveLength(1);
  });

  describe("when consent_for_tracing is not set", () => {
    it("should render a tooltip for the find match button", async () => {
      mountedComponent(<Summary {...props} />, initialState, {}, [], formProps);

      await fireEvent.mouseOver(screen.getByRole("button", { name: "cases.summary.find_match" }));

      waitFor(() => {
        expect(screen.getByText("cases.summary.cannot_find_matches")).toBeInTheDocument();
      });
    });

    it("should disable the find match button", () => {
      mountedComponent(<Summary {...props} />, initialState, {}, [], formProps);

      expect(screen.getByRole("button", { name: "cases.summary.find_match" })).toBeDisabled();
    });
  });

  describe("when consent_for_tracing is set to true", () => {
    it("should not render a tooltip for the find match button", async () => {
      mountedComponent(<Summary {...props} />, initialState, {}, [], formProps);

      await fireEvent.mouseOver(screen.getByRole("button", { name: "cases.summary.find_match" }));

      waitFor(() => {
        expect(screen.queryByText("cases.summary.cannot_find_matches")).toBeNull();
      });
    });

    it("should enable the find match button", () => {
      mountedComponent(<Summary {...props} values={{ consent_for_tracing: true }} />, initialState, {}, [], formProps);

      expect(screen.getByRole("button", { name: "cases.summary.find_match" })).toBeEnabled();
    });
  });

  describe("when is new record", () => {
    it("should not dispatch fetchmatchedTraces", () => {
      const { store } = mountedComponent(
        <Summary {...{ ...props, mode: { isNew: true } }} />,
        initialState,
        {},
        [],
        formProps
      );

      const calls = store.getActions();

      expect(calls).toHaveLength(0);
    });
  });
});
