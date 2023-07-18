import { Map } from "immutable";

import { mountedComponent, screen } from "../../../../test-utils";

import TransitionDialog from "./transition-dialog";

describe("<TransitionDialog />", () => {
  const record = Map({ case_id_display: "1234abc" });
  const props = {
    open: true,
    transitionType: "referral",
    record,
    children: <></>,
    handleClose: () => {},
    recordType: "cases",
    onClose: () => {},
    successHandler: () => {}
  };

  it("renders Dialog", () => {
    mountedComponent(<TransitionDialog {...props} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders DialogTitle", () => {
    mountedComponent(<TransitionDialog {...props} />);
    expect(screen.getByText(/transition.type.referral forms.record_types.case 1234abc/)).toBeInTheDocument();
  });

  it("renders DialogContent", () => {
    mountedComponent(<TransitionDialog {...props} />);
    expect(screen.getByText(/transition.type.referral forms.record_types.case 1234abc/)).toBeInTheDocument();
  });

  it("renders IconButton", () => {
    mountedComponent(<TransitionDialog {...props} />);
    expect(screen.queryAllByText((content, element) => element.tagName.toLowerCase() === "svg")).toHaveLength(3);
  });

  describe("when transitionType is 'referral'", () => {
    const referralProps = {
      ...props,
      transitionType: "referral"
    };

    it("should render 'Referral Case No.' as title", () => {
      mountedComponent(<TransitionDialog {...referralProps} />);
      expect(screen.getByText(/transition.type.referral forms.record_types.case 1234abc/i)).toBeInTheDocument();
    });
  });

  describe("when transitionType is 'reassign'", () => {
    const reassignProps = {
      ...props,
      transitionType: "reassign"
    };

    it("should render 'Assign Case No.' as title", () => {
      mountedComponent(<TransitionDialog {...reassignProps} />);
      expect(screen.getByText(/transition.type.reassign forms.record_types.case 1234abc/i)).toBeInTheDocument();
    });
  });

  describe("when transitionType is 'Transfer'", () => {
    const reassignProps = {
      ...props,
      transitionType: "transfer"
    };

    it("should render 'Transfer Case No.' as title", () => {
      mountedComponent(<TransitionDialog {...reassignProps} />);
      expect(screen.getByText(/transition.type.transfer forms.record_types.case 1234abc/i)).toBeInTheDocument();
    });
  });

  describe("when transitionType is 'reassign' for bulk operations", () => {
    const propsForBulk = {
      ...props,
      record: undefined,
      selectedIds: [12345, 67890]
    };

    const reassignBulkProps = {
      ...propsForBulk,
      transitionType: "reassign"
    };

    it("should render 'Assign Cases' as title", () => {
      mountedComponent(<TransitionDialog {...reassignBulkProps} />);
      expect(screen.getByText(/transition.type.reassign cases.label/i)).toBeInTheDocument();
    });
  });

});
