import { mountedComponent, screen } from "../../../../test-utils";

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
    mountedComponent(<Logos {...props} />);

    expect(screen.getByText(/exports.printed/i)).toBeInTheDocument();
  });

  it("renders img", () => {
    mountedComponent(<Logos {...props} />);

    expect(screen.getAllByText((_, element) => element.tagName.toLowerCase() === "img")).toHaveLength(2);
  });
});
