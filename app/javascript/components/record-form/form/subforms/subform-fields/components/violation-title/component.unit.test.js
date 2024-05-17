// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";
import Chip from "@material-ui/core/Chip";

import { setupMountedComponent } from "../../../../../../../test";

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
    const { component } = setupMountedComponent(ViolationTitle, props, initialState);

    expect(component.find(ViolationTitle)).to.have.lengthOf(1);
    expect(component.find(ViolationTitle).text()).to.equal("This is a title - b123cde status 1");
    expect(component.find(Chip)).to.have.lengthOf(1);
  });

  context("when short id is not present", () => {
    it("renders a vioaltion title with chip", () => {
      const { component: currentComponent } = setupMountedComponent(
        ViolationTitle,
        {
          ...props,
          values: {
            ctfmr_verified: "status_1"
          }
        },
        initialState
      );

      expect(currentComponent.find(ViolationTitle)).to.have.lengthOf(1);
      expect(currentComponent.find(ViolationTitle).text()).to.equal("This is a title status 1");
      expect(currentComponent.find(Chip)).to.have.lengthOf(1);
    });
  });

  context("when violation status is not present", () => {
    it("renders a vioaltion title with chip", () => {
      const { component: currentComponent } = setupMountedComponent(
        ViolationTitle,
        {
          ...props,
          values: {
            unique_id: "ab123cde"
          }
        },
        {}
      );

      expect(currentComponent.find(ViolationTitle)).to.have.lengthOf(1);
      expect(currentComponent.find(ViolationTitle).text()).to.equal("This is a title - b123cde ");
      expect(currentComponent.find(Chip)).to.have.lengthOf(0);
    });
  });

  context("when violation status and short_id is not present", () => {
    it("renders a vioaltion title with chip", () => {
      const { component: currentComponent } = setupMountedComponent(
        ViolationTitle,
        {
          ...props,
          title: "This is a title",
          values: {
            relation_name: "this is a relation"
          }
        },
        {}
      );

      expect(currentComponent.find(ViolationTitle)).to.have.lengthOf(1);
      expect(currentComponent.find(ViolationTitle).text()).to.equal("This is a title ");
      expect(currentComponent.find(Chip)).to.have.lengthOf(0);
    });
  });
});
