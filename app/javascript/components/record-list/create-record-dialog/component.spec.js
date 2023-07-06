import { mountedComponent, screen, userEvent } from "test-utils";

import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { fromJS } from "immutable";
import ActionButton from '../../action-button';

import CreateRecordDialog from "./component";

describe("<CreateRecordDialog /> record-list/create-record-dialog", () => {
    const props = {
        open: true,
        setOpen: () => { },
        moduleUniqueId: "testmodule-1",
        recordType: "cases"
    };

    const state = fromJS({
        records: {
            cases: {
                data: [{ unique_id: "testcase-1" }]
            }
        }
    });

    it("renders a <CreateRecordDialog />", () => {

        mountedComponent(<CreateRecordDialog {...props} />, state);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    xit("redirects to new case if create new case is clicked", () => {
        const onClose = jest.fn();

        const user = userEvent.setup();

        mountedComponent(<CreateRecordDialog {...props} />, state);
        const button = screen.getByRole('button');
        user.click(button);
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
