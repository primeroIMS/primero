import { screen, setupMockFormComponent } from "test-utils";
import DateFilter from "./component";

describe("<DateFilter>", () => {
    const filter = {
        field_name: "filter",
        name: "Filter 1",
        options: {
            en: [
                { id: "option-1", display_text: "Option 1" },
                { id: "option-2", display_text: "Option 2" }
            ]
        }
    };

    const props = {
        addFilterToList: () => { },
        filter,
        filterToList: {}
    };

    it("renders panel", () => {
        setupMockFormComponent(DateFilter, { props, includeFormProvider: true });
        expect(screen.getByText("Filter 1")).toBeInTheDocument();
    });
});




