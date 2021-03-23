import { fromJS } from "immutable";

import { setupMountedComponent } from "../../../../../test";

import CodeOfConduct from "./component";

describe("<CodeOfConduct />", () => {
  const state = fromJS({
    user: {
      codeOfConductId: 1,
      codeOfConductAcceptedOn: "2021-03-23T18:14:19.762Z"
    },
    application: {
      codesOfConduct: {
        id: 1,
        title: "Test code of conduct",
        content: "Lorem ipsum",
        created_on: "2021-03-19T15:21:38.950Z",
        created_by: "primero"
      }
    }
  });

  let component;

  beforeEach(() => {
    ({ component } = setupMountedComponent(CodeOfConduct, {}, state));
  });

  it("should render h2", () => {
    const h2Tag = component.find("h2");

    expect(h2Tag).to.have.lengthOf(1);
    expect(h2Tag.text()).to.be.equal("Test code of conduct");
  });

  it("should render 2 h3", () => {
    const h3Tag = component.find("h3");

    expect(h3Tag).to.have.lengthOf(2);
    expect(h3Tag.at(0).text()).to.be.equal("updated March 19, 2021");
    expect(h3Tag.at(1).text()).to.be.equal("accepted March 23, 2021");
  });
});
