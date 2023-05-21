import { screen, mountedComponent,userEvent } from "test-utils";
import { fromJS } from "immutable";
import IndexFilters from "./component";

describe("<IndexFitlers>", () => {
    const state = fromJS({
        user: {
            filters: {
                cases: [
                    {
                        field_name: "filter1",
                        name: "filter1",
                        options: [{ id: "true", display_name: "Filter 1" }],
                        type: "checkbox"
                    }
                ]
            }
        }
    });

    const props = {
        recordType: "cases"
    };

    it("renders search bar", () => {
        mountedComponent(<IndexFilters {...props} />, state);
        expect(document.querySelector("#search-input")).toBeInTheDocument();
    });

    it("renders MoreSection filters", () => {
        mountedComponent(<IndexFilters {...props} />, state);
        expect(screen.getByText("filters.more")).toBeInTheDocument();
    });

    it("renders FilterActions filters", () => {
        mountedComponent(<IndexFilters {...props} />, state);
        expect(screen.getByText("filters.apply_filters")).toBeInTheDocument();
    });

    it("clear filters", () => {
        const propFilters = {
          ...props,
          defaultFilters: fromJS({
            record_state: ["true"],
            status: ["open"],
            risk_level: ["medium"]
          }),
          setSelectedRecords: () => {},
          metadata: {}
        };

        mountedComponent(<IndexFilters {...propFilters} />, state,[
            "/cases?record_state[0]=true&status[0]=open&risk_level[0]=medium&page=1&per=20"
          ]);
        
          const FilterActions = screen.getAllByRole('button')[1];
          expect(FilterActions).toBeInTheDocument();
          userEvent.click(FilterActions); 
        
    
       // component.find(FilterActions).find("button").last().simulate("click");
    
        // expect(component.props().store.getActions()[0]).to.deep.equals({
        //   type: "cases/SET_FILTERS",
        //   payload: { fields: "short", status: ["open"], record_state: ["true"] }
        // });
      });
});




