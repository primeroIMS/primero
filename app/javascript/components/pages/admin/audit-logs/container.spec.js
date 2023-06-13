
import { mountedComponent, screen } from "test-utils";

import { fromJS } from "immutable";


import { PageHeading } from "../../../page";
import { ACTIONS } from "../../../permissions";
import IndexTable from "../../../index-table";
import { FiltersForm } from "../../../form-filters/components";

import AuditLogs from "./container";

describe("<AuditLogs />", () => {
    let component;
    const state = fromJS({
        user: {
            permissions: {
                audit_logs: [ACTIONS.MANAGE]
            }
        }
    });

    beforeEach(() => {
        mountedComponent(<AuditLogs />, state, ["/admin/audit_logs"]);

    });
    it("renders <PageHeading /> component", () => {
        expect(screen.getByTestId('page-heading')).toBeInTheDocument();
    });

    it("renders <IndexTable /> component", () => {
        expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it("renders <FiltersForm /> component", () => {
        expect(screen.getByTestId('form-filter')).toBeInTheDocument();
    });

});
