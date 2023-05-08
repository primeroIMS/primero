import { mountedComponent, screen } from "test-utils";
import ApprovalDetail from "./component";
import { fromJS } from "immutable";
import { CASE_PLAN, STATUS_APPROVED } from "../../constants";
describe("<ApprovalDetail /> - Component", () => {
  const props = {
    approvalSubform: fromJS({
      approval_date: "2020-01-01",
      approval_status: STATUS_APPROVED,
      approval_response_for: CASE_PLAN
    }),
    css: {},
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
    mountedComponent(<ApprovalDetail {...props} />, initialState);
  });

  it("render ApprovalDetail component", () => {
    const element = screen.getByText("approvals.response_for_label");
    expect(element).toBeInTheDocument();
  });

  // it("render a Grid", () => {
  //     expect(screen.getAllByRole('div', { className: 'MuiGrid-root' })).toBeDefined();
  // });

  // it("render a DisplayData", () => {
  //   expect(component.find(DisplayData)).to.have.lengthOf(4);
  // });

  it("render the correct approvals label", () => {
    expect(screen.getAllByText(CASE_PLAN)).toBeTruthy();
  });

  it('should accept valid props', () => {
    expect(props.approvalSubform).toBeDefined();
    expect(props.css).toBeDefined();
    expect(props.isResponse).toBe(true);
    expect(props.isRequest).toBe(false);
  });
});






