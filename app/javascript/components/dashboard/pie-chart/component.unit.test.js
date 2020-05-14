import { setupMountedComponent } from "../../../test";

import PieChart from "./component";

describe("<PieChart />", () => {
  let component;
  const props = {
    data: [10, 12, 8],
    labels: ["Care plan", "New", "Service provision"],
    query: [
      ["workflow=care_plan"],
      ["workflow=new"],
      ["workflow=service_provision"]
    ]
  };

  beforeEach(() => {
    ({ component } = setupMountedComponent(PieChart, props, {}));
  });

  it("renders a PieChart />", () => {
    expect(component.find(PieChart)).to.have.lengthOf(1);
  });
});
