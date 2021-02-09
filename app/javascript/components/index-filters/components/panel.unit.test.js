import { fromJS } from "immutable";
import { AccordionSummary } from "@material-ui/core";

import { setupMockFormComponent, spy, fake } from "../../../test";

import Panel from "./panel";

describe("<IndexFilters />/<Panel />", () => {
  let props;

  beforeEach(() => {
    props = {
      filter: {
        field_name: "filter1",
        name: "filter1",
        options: [{ id: "true", display_name: "Filter 1" }],
        type: "checkbox"
      },
      getValues: fake.returns({ filter1: "option-1" }),
      handleReset: spy(),
      children: "Child Component"
    };
  });

  it("renders children", () => {
    const { component } = setupMockFormComponent(Panel, { props, includeFormProvider: true });

    expect(component.contains("Child Component")).to.be.true;
  });

  it("opens if field has value", () => {
    const { component } = setupMockFormComponent(Panel, { props, includeFormProvider: true });

    expect(component.find("Panel").childAt(0).prop("expanded")).to.be.true;
  });

  it("closes if field has value on click", () => {
    const { component } = setupMockFormComponent(Panel, { props, includeFormProvider: true });

    component.find("Panel button").simulate("click");
    expect(component.find("Panel").childAt(0).prop("expanded")).to.be.false;
  });

  it("resets field value", () => {
    const { component } = setupMockFormComponent(Panel, { props, includeFormProvider: true });

    component.find("button[aria-label='buttons.delete']").simulate("click");

    expect(props.handleReset).to.have.been.calledOnce;
  });

  it("renders valid props for Panel component", () => {
    const { component } = setupMockFormComponent(Panel, { props, includeFormProvider: true });

    const clone = { ...component.find(Panel).props() };

    ["filter", "getValues", "handleReset", "children", "commonInputProps", "moreSectionFilters"].forEach(property => {
      expect(clone).to.have.property(property);
      delete clone[property];
    });

    expect(clone).to.be.empty;
  });

  it("render the correct label if the filter is for approval", () => {
    const propsApprovals = {
      filter: {
        name: "approvals.case_plan",
        field_name: "approval_status_case_plan",
        options: {
          en: [
            { id: "pending", display_name: "Pending" },
            { id: "approved", display_name: "Approved" },
            { id: "rejected", display_name: "Rejected" }
          ]
        },
        type: "multi_toggle"
      },
      getValues: fake.returns({ filter1: "option-1" }),
      handleReset: spy(),
      children: "Child Component"
    };
    const initialStateApprovals = fromJS({
      application: {
        approvalsLabels: {
          case_plan: {
            en: "Case Plan"
          }
        }
      }
    });
    const { component } = setupMockFormComponent(Panel, {
      props: propsApprovals,
      state: initialStateApprovals,
      includeFormProvider: true
    });

    expect(component.find(AccordionSummary).text()).to.be.equal("Case Plan");
  });
});
