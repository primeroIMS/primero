import getSubformValues from "./get-subform-values";

describe("getSubformValues", () => {
  const index = 1;
  const field = { name: "services_section", subform_section_configuration: {} };
  const values = {
    services_section: [
      {
        response_type: "response-type-2"
      },
      {
        response_type: "response-type-1"
      }
    ]
  };

  context("when subforms are not sorted", () => {
    it("should return the subform object from formik values", () => {
      const result = getSubformValues(field, index, values);

      expect(result).to.deep.equal({
        response_type: "response-type-1"
      });
    });
  });

  context("when subforms are sorted", () => {
    it("should return the subform object from orderedValues values and not from formik", () => {
      const orderedValues = [
        {
          response_type: "response-type-1"
        },
        {
          response_type: "response-type-2"
        }
      ];
      const result = getSubformValues(field, index, values, orderedValues);

      expect(result).to.deep.equal({
        response_type: "response-type-2"
      });
    });
  });
});
