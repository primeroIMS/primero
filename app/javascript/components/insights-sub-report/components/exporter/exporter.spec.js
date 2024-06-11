// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { mountedComponent, screen } from "../../../../test-utils";

import Exporter from "./exporter";

describe("<Exporter />", () => {
  describe("when includesGraph is true", () => {
    beforeEach(() => {
      mountedComponent(<Exporter includesGraph />);
    });

    it("should render 2 <ActionButton /> component", () => {
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });
  });

  describe("when includesGraph is false", () => {
    beforeEach(() => {
      mountedComponent(<Exporter />);
    });

    it("should render 1 <ActionButton /> component", () => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });
});
