import checkFieldSubformErrors from "./check-fields-subform-errors";

describe("middleware/utils/check-fields-subform-errors.js", () => {
  const subformFields = [
    {
      type: "subform",
      name: { en: "Test Subform 1" },
      visible: true
    },
    {
      type: "text_field",
      name: { en: "Test text_field" },
      visible: true
    },
    {
      type: "subform",
      name: { en: "Test Subform 2" },
      subform_section_id: 1,
      visible: true
    }
  ];

  it("returns all subformFields if there are not errors", () => {
    expect(checkFieldSubformErrors(subformFields, [])).to.be.deep.equals(subformFields);
  });

  it("returns all subformFields without the ones that contains errors", () => {
    const errors = [
      {
        type: "subform",
        name: { en: "Test Subform 1" },
        visible: true
      }
    ];
    const expected = [
      {
        type: "text_field",
        name: { en: "Test text_field" },
        visible: true
      },
      {
        type: "subform",
        name: { en: "Test Subform 2" },
        subform_section_id: 1,
        visible: true
      }
    ];

    expect(checkFieldSubformErrors(subformFields, errors)).to.be.deep.equals(expected);
  });
});
