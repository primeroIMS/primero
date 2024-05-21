import { fireEvent, waitFor } from "@testing-library/react";

import { mountedComponent, screen } from "../../test-utils";

import Lightbox from "./component";

describe("layouts/components/<Lightbox />", () => {
  beforeEach(() => {
    const props = {
      image: "/image.png",
      trigger: (
        <div id="lightbox-button" data-testid="lightbox-button">
          lightbox-button
        </div>
      )
    };

    mountedComponent(<Lightbox {...props} />);
  });

  it("should render clickable button to trigger lightbox", () => {
    expect(screen.getByText("lightbox-button")).toBeInTheDocument();
  });

  it("should open/close lightbox", async () => {
    const button = screen.getByText("lightbox-button");

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "svg")).toBeInTheDocument();
    });
  });

  it("should render image in lightbox", async () => {
    const button = screen.getByText("lightbox-button");

    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText((content, element) => element.tagName.toLowerCase() === "img")).toBeInTheDocument();
    });
  });

  it("should return false if no image available", () => {
    expect(document.getElementsByTagName("img")).toHaveLength(0);
  });
});
