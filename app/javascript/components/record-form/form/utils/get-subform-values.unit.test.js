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

  context("when isViolation", () => {
    it("should return the object with all the associated data to the current violation", () => {
      const indexViolation = 0;
      const fieldViolation = { name: "killing", subform_section_configuration: {} };
      const valuesViolation = {
        killing: [
          {
            killing_number_of_victims: {
              boys: 1,
              girls: 2
            },
            attack_type: "aerial_attack"
          },
          {
            killing_number_of_victims: {
              boys: 2,
              girls: 1
            },
            attack_type: "other"
          }
        ],
        random_value: "testing",
        individual_victims: [
          {
            unique_id: "individual1"
          },
          {
            unique_id: "individual2"
          }
        ],
        perpetrators: [
          {
            unique_id: "perpetrator1"
          }
        ]
      };
      const result = getSubformValues(fieldViolation, indexViolation, valuesViolation, [], true);
      const expected = {
        killing_number_of_victims: {
          boys: 1,
          girls: 2
        },
        attack_type: "aerial_attack",
        individual_victims: [
          {
            unique_id: "individual1"
          },
          {
            unique_id: "individual2"
          }
        ],
        perpetrators: [
          {
            unique_id: "perpetrator1"
          }
        ]
      };

      expect(result).to.deep.equal(expected);
    });
  });
});
