import { fromJS } from "immutable";

import { mountedComponent, screen } from "../../../../../test-utils";

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

  it("should render h2", () => {
    mountedComponent(<CodeOfConduct />, state);
    expect(screen.getByText(/Test code of conduct/i)).toBeInTheDocument();
  });

  it("should render 2 h3", () => {
    mountedComponent(<CodeOfConduct />, state);
    expect(screen.getByText(/updated March 19, 2021/i)).toBeInTheDocument();
    expect(screen.getByText(/accepted March 23, 2021/i)).toBeInTheDocument();
  });
});
