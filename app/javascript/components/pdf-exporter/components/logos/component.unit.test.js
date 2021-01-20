import { setupMountedComponent } from "../../../../test";

import Logos from "./component";

describe("<Logos />", () => {
  const props = {
    shortId: "123456",
    logos: [
      {
        logoFull: "/rails/active_storage/blobs/2lkIn19--049c807149445f6bd72621ae500340ac544e85d8/unicef-full.png"
      },
      {
        logoFull: "/rails/active_storage/blobs/2lkIn19--3cfbfc331a4c4276b26b665b52a5aba0c920d642/test.png"
      }
    ],
    css: {
      info: "",
      caseID: "",
      logos: ""
    }
  };

  it("renders Logos", () => {
    const { component } = setupMountedComponent(Logos, props);

    expect(component.find(Logos)).to.have.lengthOf(1);
  });

  it("renders img", () => {
    const { component } = setupMountedComponent(Logos, props);

    expect(component.find("img")).to.have.lengthOf(2);
  });
});
