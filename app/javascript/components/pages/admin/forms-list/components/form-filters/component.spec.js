import { mountedComponent, screen } from "test-utils";
import { List } from "immutable";
import FormExporter from "./component";

describe("<FormsList />/components/<FormExporter />", () => {
  const props = {
    
        modules: List([
          {
            name: "Module 1",
            unique_id: "module-1",
            associated_record_types: ["record-type-1"]
          },
          {
            name: "Module 2",
            unique_id: "module-2",
            associated_record_types: ["record-type-2"]
          }
        ]),
        handleClearValue: () => {},
        handleSetFilterValue: () => {}
      
  };   
 
  beforeEach(() => {
    mountedComponent(<FormExporter {...props}  />);
  });

  it("renders clear button", () => {
    expect(screen.getByText('clear')).toBeInTheDocument();
  });

  it("renders <FiltersExpansionPanel />", () => {
    expect(screen.getAllByTestId('test')).toHaveLength(2);
    
  });
});
