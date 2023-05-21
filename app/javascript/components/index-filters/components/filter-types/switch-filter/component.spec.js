import { screen, setupMockFormComponent } from "test-utils";
import SwitchFilter from "./component";

describe("<SwitchFilter>", () => {
    const filter = {
        field_name: "filter",
        name: "Filter 1",
        options: {
            en: [
                {
                    id: "true",
                    display_name: "Option 1"
                }
            ]
        }
    };

    const props = {
        addFilterToList: () => { },
        filter
    };

    it("renders panel", () => {
        setupMockFormComponent(SwitchFilter, { props, includeFormProvider: true });
        expect(screen.getByText("Filter 1")).toBeInTheDocument();
    });    
});




