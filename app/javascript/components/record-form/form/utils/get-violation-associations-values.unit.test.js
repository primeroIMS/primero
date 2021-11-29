import getViolationAssociationsValues from "./get-violation-associations-values";

describe("getViolationAssociationsValues", () => {
  it("should return the object with all the associated data to the violation", () => {
    const values = {
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
    const result = getViolationAssociationsValues(values);
    const expected = {
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
