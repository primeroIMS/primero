import { fromJS } from "immutable";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";

import { setupMountedComponent } from "../../../../../test";

import ChangeLogItem from "./component";

describe("ChangeLogItems - Component", () => {
  let component;
  const changeLogMessage =
    "Changed from Nationality from Canada to Canada,Australia";
  const changeLogUser = "primero";
  const props = {
    changeLogDate: "2020-08-11T10:27:33Z",
    changeLogMessage,
    changeLogUser
  };

  before(() => {
    component = setupMountedComponent(ChangeLogItem, props, fromJS({}))
      .component;
  });

  it("renders ChangeLogItem", () => {
    expect(component.find(ChangeLogItem)).to.have.lengthOf(1);
  });

  it("renders TimelineItem", () => {
    expect(component.find(TimelineItem)).to.have.lengthOf(1);
  });

  it("renders TimelineSeparator", () => {
    expect(component.find(TimelineSeparator)).to.have.lengthOf(1);
  });

  it("renders TimelineDot", () => {
    expect(component.find(TimelineDot)).to.have.lengthOf(1);
  });

  it("renders TimelineConnector", () => {
    expect(component.find(TimelineConnector)).to.have.lengthOf(1);
  });

  it("renders TimelineContent", () => {
    expect(component.find(TimelineContent)).to.have.lengthOf(1);
  });

  it("renders div", () => {
    expect(component.find(TimelineContent).find("div")).to.have.lengthOf(5);
    expect(
      component.find(TimelineContent).find("div").at(3).text()
    ).to.be.equal(changeLogMessage);
    expect(
      component.find(TimelineContent).find("div").last().text()
    ).to.be.equal(changeLogUser);
  });
});
