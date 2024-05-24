// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "test-utils";

import Exporter from "./exporter";

describe("<Exporter />", () => {
  describe("when includesGraph is true", () => {
    const props = {
      includesGraph: true
    };

    beforeEach(() => {
      mountedComponent(<Exporter {...props} />);
    });

    it("renders DefaultButton with text", () => {
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });

    it("renders DefaultButton with text 2", () => {
      const newProps = {
        includesGraph: false
      };

      mountedComponent(<Exporter {...newProps} />);
      expect(screen.getAllByRole("button")).toHaveLength(3);
    });
  });
});
