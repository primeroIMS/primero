// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
import { fromJS } from "immutable";
import { mountedComponent, screen } from "test-utils";

import Datatable from "./data-table";

describe("<Datatable /> components/index-table/components", () => {
  const props = {
    title: "This is a title",
    bypassInitialFetch: true,
    columns: ["column A", "column B"],
    data: fromJS([]),
    onTableChange: () => {}
  };

  it("renders a <Datatable /> component", () => {
    mountedComponent(<Datatable {...props} />);

    expect(screen.getByText("This is a title", { selector: "h6" })).toBeInTheDocument();
    expect(screen.getByText("column A")).toBeInTheDocument();
  });
});
