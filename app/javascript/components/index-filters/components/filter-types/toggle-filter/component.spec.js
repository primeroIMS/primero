import { screen, setupMockFormComponent, userEvent, spy } from "test-utils";
import ToggleFilter from "./component";

describe("<ToggleFilter>", () => {
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
        filter
    };

    it("renders panel", () => {
        setupMockFormComponent(ToggleFilter, { props, includeFormProvider: true });
        expect(screen.getByText("Filter 1")).toBeInTheDocument();
    });

    it("renders toggle buttons", () => {
        setupMockFormComponent(ToggleFilter, { props, includeFormProvider: true });
        ["Option 1", "Option 2"].forEach(option =>
            expect(screen.getByText(`${option}`)).toBeInTheDocument());
    });

    it("should have not call setMoreSectionFilters if mode.secondary is false when changing value", async () => {
        const setMoreSectionFiltersSpy = jest.fn();
        const newProps = {
            addFilterToList: () => { },
            filter,
            mode: {
                secondary: true
            },
            moreSectionFilters: {},
            reset: false,
            setMoreSectionFilters: setMoreSectionFiltersSpy,
            setReset: () => { }
        };
        const user = userEvent.setup()
        setupMockFormComponent(ToggleFilter, { props: newProps, includeFormProvider: true });
        await user.click(screen.getAllByRole('button')[1]);
        expect(setMoreSectionFiltersSpy).toHaveBeenCalled();
    });
});




