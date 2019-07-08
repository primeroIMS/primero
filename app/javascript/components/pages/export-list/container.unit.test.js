import { expect } from "chai";
import "test/test.setup";
import { setupMountedComponent } from "test";
import { fromJS, Map } from "immutable";
import ExportList from "./container";

describe("<ExportList />", () => {
  let component;

  before(() => {
    component = setupMountedComponent(
      ExportList,
      {},
      Map({
        records: Map({
          ExportList: {
            exports: fromJS([
              {
                id: "d5e1a4a019ec727efd34a35d1d9a271e",
                file: "PRIMERO-CHILD-UNHCR.CSV",
                type: "Case",
                started: "05-Jul-2019 09:36"
              },
              {
                id: "d5e1a4a019ec727efd34a35d1d9a271e",
                file: "PRIMERO - CHILD.PDF",
                type: "Case",
                started: "05-Jul-2019 09:36"
              },
              {
                id: "d5e1a4a019ec727efd34a35d1d9a271e",
                file: "PRIMERO - CHILD.JSON",
                type: "Case",
                started: "05-Jul-2019 09:36"
              }
            ]),
          }
        })
      })
    ).component;
  });

  it("renders export table", () => {
    expect(component.find("table").first().find("tbody").first().find("tr")).to.have.length(3);
  });
});