import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../test-utils";
import { MODULES } from "../../../config";

import mockUsers from "./mocked-users";
import Transitions from "./component";

describe("<Transitions />", () => {
    
    const initialState = fromJS({
        application: {
            agencies: [{ unique_id: "agency-unicef", name: "UNICEF" }]
        },
        transitions: {
            reassign: {
                users: [{ user_name: "primero" }]
            },
            mockUsers,
            transfer: {
                users: [{ user_name: "primero_cp" }]
            }
        }
    });
    const record = fromJS({
        id: "03cdfdfe-a8fc-4147-b703-df976d200977",
        case_id: "1799d556-652c-4ad9-9b4c-525d487b5e7b",
        case_id_display: "9b4c525",
        name_first: "W",
        name_last: "D",
        name: "W D",
        module_id: MODULES.CP,
        consent_for_services: true,
        disclosure_other_orgs: true
    });

    // describe("when Transitions is rendered", () => {
    //     const props = {
    //         assignDialog: true,
    //         currentPage: 0,
    //         handleAssignClose: () => { },
    //         handleReferClose: () => { },
    //         handleTransferClose: () => { },
    //         pending: false,
    //         record,
    //         recordType: "cases",
    //         referDialog: false,
    //         selectedRecords: {},
    //         setPending: () => { },
    //         transferDialog: false,
    //         userPermissions: {}
    //     };

    // });

    describe("when transitionType is 'referral'", () => {
        const referralProps = {
            record,
            recordType: "cases",
            userPermissions: fromJS({ cases: ["manage"] }),
            currentDialog: "referral",
            open: true,
            close: () => { },
            pending: false,
            setPending: () => { }
        };

        it("renders TransitionDialog", () => {
            mountedComponent(<Transitions {...referralProps} />, initialState)
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it("renders ReferralForm", () => {
            mountedComponent(<Transitions {...referralProps} />, initialState)
            expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'form')).toBeInTheDocument();
        });
    });

    describe("when transitionType is 'reassign'", () => {
        const reassignProps = {
            record,
            recordType: "cases",
            userPermissions: fromJS({ cases: ["manage"] }),
            currentDialog: "assign",
            open: true,
            close: () => { },
            pending: false,
            setPending: () => { }
        };

        it("renders TransitionDialog", () => {
            mountedComponent(<Transitions {...reassignProps} />, initialState)
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it("renders ReassignForm", () => {
            mountedComponent(<Transitions {...reassignProps} />, initialState)
            expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'form')).toBeInTheDocument();
        });
    });

    describe("when transitionType is 'transfer'", () => {
        const transferProps = {
            record,
            recordType: "cases",
            userPermissions: fromJS({ cases: ["manage"] }),
            currentDialog: "transfer",
            open: true,
            close: () => { },
            pending: false,
            isBulkTransfer: false,
            setPending: () => {}
        };

        it("renders TransitionDialog", () => {
            mountedComponent(<Transitions {...transferProps} />, initialState)
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it("renders TransferForm", () => {
            mountedComponent(<Transitions {...transferProps} />, initialState)
            expect(screen.getByText((content, element) => element.tagName.toLowerCase() === 'form')).toBeInTheDocument();
        })
    });
});
