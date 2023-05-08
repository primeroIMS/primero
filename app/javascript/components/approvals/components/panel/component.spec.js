import { mountedComponent, screen } from "test-utils";
import ApprovalPanel from "./component";
import { fromJS } from "immutable";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import ApprovalSummary from "../summary";
import ApprovalDetail from "../detail";
import { CASE_PLAN, STATUS_APPROVED } from "../../constants";
describe("<ApprovalPanel /> - Component", () => {
  const props = {
    approvalSubform: fromJS({
      approval_date: "2020-01-01",
      approval_status: STATUS_APPROVED,
      approval_response_for: CASE_PLAN
    }),
    css: {}
  };

  beforeEach(() => {
    mountedComponent(<ApprovalPanel {...props} />);
  });

  it("render ApprovalPanel component", () => {
    const element = screen.getByText("approvals.status.approved");
    expect(element).toBeInTheDocument();
  });

  // it("render a Accordion", () => {
  //   expect(component.find(Accordion)).to.have.lengthOf(1);
  //   expect(component.find(AccordionSummary)).to.have.lengthOf(1);
  //   expect(component.find(AccordionDetails)).to.have.lengthOf(1);
  // });

  // it("render a ApprovalSummary", () => {
  //   expect(component.find(ApprovalSummary)).to.have.lengthOf(1);
  // });

  // it("render a ApprovalSummary", () => {
  //   expect(component.find(ApprovalDetail)).to.have.lengthOf(1);
  // });

  it('should accept valid props', () => {
    expect(props.approvalSubform).toBeDefined();
    expect(props.css).toBeDefined();
  });
});








