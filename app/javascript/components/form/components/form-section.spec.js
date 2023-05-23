import { screen, setupMockFormComponent } from "test-utils";
import { FieldRecord, FormSectionRecord } from "../records";
import FormSection from "./form-section";

describe("<Form /> - components/<FormSection />", () => {
    it("renders a form section with title and fields", () => {
        const formSection = FormSectionRecord({
            unique_id: "form_section",
            name: "Form Section",
            fields: [
                FieldRecord({
                    display_name: "Test Field",
                    name: "test_field",
                    type: "text_field"
                })
            ]
        });
        setupMockFormComponent(FormSection, { props: { formSection } });
        expect(document.querySelector("#test_field")).toBeInTheDocument();
        expect(screen.getByText("Form Section")).toBeInTheDocument();
    });
});