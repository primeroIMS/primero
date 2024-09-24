import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../../../test-utils";

import ViolationTitle from "./component";

describe("<RecordForm>/form/subforms/subform-fields/<ViolationTitle>", () => {
  const props = {
    title: "This is a title",
    values: {
      unique_id: "ab123cde",
      relation_name: "this is a relation",
      ctfmr_verified: "status_1"
    },
    fields: [{ name: "ctfmr_verified", option_strings_source: "lookup lookup-status" }]
  };

  const initialState = fromJS({
    forms: {
      options: {
        lookups: [
          {
            unique_id: "lookup-status",
            values: [
              { id: "status_1", display_text: { en: "status 1" } },
              { id: "status_2", display_text: { en: "status 2" } }
            ]
          }
        ]
      }
    }
  });

  it("should render violation title", () => {
    mountedComponent(<ViolationTitle {...props} />, initialState);

    expect(screen.getByText("This is a title - b123cde")).toBeInTheDocument();
    expect(screen.getByTestId("violation-title")).toBeInTheDocument();
    expect(screen.getByText("status 1")).toBeInTheDocument();
  });

  describe("when short id is not present", () => {
    it("renders a violation title with chip", () => {
      mountedComponent(
        <ViolationTitle
          {...{
            ...props,
            values: {
              ctfmr_verified: "status_1"
            }
          }}
        />,
        initialState
      );

      expect(screen.getByText("status 1")).toBeInTheDocument();
      expect(screen.getByText("This is a title")).toBeInTheDocument();
      expect(screen.getByTestId("violation-title")).toBeInTheDocument();
    });
  });

  describe("when violation status is not present", () => {
    it("renders a vioaltion title without chip component", () => {
      mountedComponent(<ViolationTitle {...{ title: "This is a title", values: {}, fields: [] }} />, initialState);

      expect(screen.queryByText("status 1")).not.toBeInTheDocument();
      expect(screen.getByText("This is a title")).toBeInTheDocument();
      expect(screen.getByTestId("violation-title")).toBeInTheDocument();
    });
  });

  describe("when violation status and short_id is not present", () => {
    it("renders a violation title with chip", () => {
      mountedComponent(
        <ViolationTitle
          {...{
            ...props,
            title: "This is a title",
            values: {
              relation_name: "this is a relation"
            }
          }}
        />,
        initialState
      );

      expect(screen.getByText("This is a title")).toBeInTheDocument();
      expect(screen.getByTestId("violation-title")).toBeInTheDocument();
      expect(screen.queryByText("status 1")).not.toBeInTheDocument();
    });
  });
});
