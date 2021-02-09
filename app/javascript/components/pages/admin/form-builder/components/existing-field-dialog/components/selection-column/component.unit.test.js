import { fromJS } from "immutable";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import { setupMockFormComponent } from "../../../../../../../../test";

import SelectionColumn from "./component";

describe("<SelectionColumn />", () => {
  it("should render the SelectionColumn with an AddIcon when is not selected", () => {
    const { component } = setupMockFormComponent(SelectionColumn, {
      props: { addField: () => {}, removeField: () => {}, field: {}, selected: false },
      state: fromJS({})
    });

    expect(component.find(SelectionColumn)).to.have.lengthOf(1);
    expect(component.find(SelectionColumn).find(AddIcon)).to.have.lengthOf(1);
    expect(component.find(SelectionColumn).find(RemoveIcon)).to.have.lengthOf(0);
  });

  it("should render the SelectionColumn with an RemoveIcon when is selected", () => {
    const { component } = setupMockFormComponent(SelectionColumn, {
      props: { addField: () => {}, removeField: () => {}, field: {}, selected: true },
      state: fromJS({})
    });

    expect(component.find(SelectionColumn)).to.have.lengthOf(1);
    expect(component.find(SelectionColumn).find(RemoveIcon)).to.have.lengthOf(1);
    expect(component.find(SelectionColumn).find(AddIcon)).to.have.lengthOf(0);
  });
});
