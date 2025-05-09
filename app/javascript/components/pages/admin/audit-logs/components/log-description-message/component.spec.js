// Copyright (c) 2014 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";
import { fromJS } from "immutable";

import LogMessageRenderer from "./component";

describe("<LogMessageRenderer />", () => {
  const props = {
    value: {
      prefix: {
        key: "logger.update",
        approval_type: null
      },
      identifier: "Child '98765'",
      suffix: {
        key: "logger.by_user",
        user: "primero_admin_cp"
      }
    },
    rowIndex: 1,
    data: fromJS({
      data: [
        {
          record_id: null,
          record_type: "child",
          action: "index"
        },
        {
          record_id: "98765",
          record_type: "child",
          action: "update"
        }
      ]
    })
  };

  describe("When recordID exists", () => {
    it("should renders the LogMessageRenderer with id", () => {
      mountedComponent(<LogMessageRenderer {...props} />);
      expect(screen.getByText("logger.update")).toBeInTheDocument();
      expect(screen.getByText("logger.resources.child 98765")).toBeInTheDocument();
    });
  });

  describe("When recordID is empty", () => {
    it("should renders the LogMessageRenderer without id", () => {
      mountedComponent(<LogMessageRenderer {...props} rowIndex={0} />);
      expect(screen.getByText("logger.update logger.resources.child")).toBeInTheDocument();
    });
  });
});
