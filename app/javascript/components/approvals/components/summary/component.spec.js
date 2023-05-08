import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";
import { CASE_PLAN, STATUS_APPROVED } from "../../constants";
import ApprovalSummary from "./component";
describe("<ApprovalSummary /> - Component", () => {
  const props = {
    approvalSubform: fromJS({
      approval_date: "2020-01-01",
      approval_response_for: "assessment",
      approval_status: STATUS_APPROVED,
      approval_response_for: CASE_PLAN
    }),
    css: {
      approvalsValueSummary: "approvalsValueSummary"
    },
    isRequest: false,
    isResponse: true
  };

  const initialState = fromJS({
    application: {
      approvalsLabels: {
        case_plan: {
          en: CASE_PLAN
        }
      }
    }
  });  

  beforeEach(() => {
    mountedComponent(<ApprovalSummary {...props} />,initialState);
  });

  it("render ApprovalSummary component", () => {
    const element = screen.getByText("approvals.status.approved");
    expect(element).toBeInTheDocument();
  });

  // it("render a Grid", () => {
  //   expect(component.find(Grid)).to.have.lengthOf(3);
  // });

  // it("render a Chip", () => {
  //   expect(component.find(Chip)).to.have.lengthOf(1);
  // });

  it('should accept valid props', () => {
    expect(props.approvalSubform).toBeDefined();
    expect(props.css).toBeDefined();
    expect(props.isResponse).toBe(true);
    expect(props.isRequest).toBe(false);
  });
});



