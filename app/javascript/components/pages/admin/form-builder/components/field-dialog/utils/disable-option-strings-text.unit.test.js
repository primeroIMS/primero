// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { fromJS } from "immutable";

import disableOptionStringsText from "./disable-option-strings-text";

describe("disableOptionStringsText", () => {
  describe("when is radio_button", () => {
    it("should return OptionStringsText with disabled options", () => {
      const selectedField = fromJS({
        guiding_questions: {},
        display_name: {
          en: "color options"
        },
        created_at: "2023-01-10T16:45:57.556Z",
        name: "name_test_6be1d50",
        help_text: {},
        order: 6,
        form_section_id: 140,
        visible: true,
        option_strings_text: [
          {
            id: "blue",
            disabled: false,
            display_text: {
              en: "Blue"
            }
          },
          {
            id: "red",
            disabled: false,
            display_text: {
              en: "Red"
            }
          },
          {
            id: "yellow",
            disabled: false,
            display_text: {
              en: "Yellow"
            }
          },
          {
            id: "pink",
            disabled: false,
            display_text: {
              en: "Pink"
            }
          },
          {
            id: "green",
            disabled: true,
            display_text: {
              en: "Green"
            }
          }
        ],
        type: "radio_button",
        id: 2654,
        disabled: false
      });
      const fieldData = {
        guiding_questions: {},
        display_name: {
          en: "color options"
        },
        created_at: "2023-01-10T16:45:57.556Z",
        name: "name_test_6be1d50",
        help_text: {
          en: "This is a help text1"
        },
        order: 6,
        form_section_id: 140,
        visible: true,
        option_strings_text: [
          {
            id: "blue",
            disabled: false,
            display_text: {
              en: "Blue"
            }
          },
          {
            id: "red",
            disabled: false,
            display_text: {
              en: "Red"
            }
          },
          {
            id: "yellow",
            disabled: false,
            display_text: {
              en: "Yellow"
            }
          },
          {
            id: "pink",
            disabled: false,
            display_text: {
              en: "Pink"
            }
          },
          {
            id: "green",
            disabled: true,
            display_text: {
              en: "Green"
            }
          }
        ],
        type: "radio_button",
        id: 2654
      };
      const optionStringsText = [
        {
          id: "blue",
          disabled: true,
          display_text: {
            en: "Blue"
          }
        },
        {
          id: "red",
          disabled: true,
          display_text: {
            en: "Red"
          }
        },
        {
          id: "yellow",
          disabled: true,
          display_text: {
            en: "Yellow"
          }
        },
        {
          id: "pink",
          disabled: true,
          display_text: {
            en: "Pink"
          }
        },
        {
          id: "green",
          disabled: false,
          display_text: {
            en: "Green"
          }
        }
      ];
      const expected = [
        {
          disabled: false,
          display_text: {
            en: "Blue"
          },
          id: "blue"
        },
        {
          disabled: false,
          display_text: {
            en: "Red"
          },
          id: "red"
        },
        {
          disabled: false,
          display_text: {
            en: "Yellow"
          },
          id: "yellow"
        },
        {
          disabled: false,
          display_text: {
            en: "Pink"
          },
          id: "pink"
        },
        {
          disabled: true,
          display_text: {
            en: "Green"
          },
          id: "green"
        }
      ];

      expect(disableOptionStringsText(selectedField, fieldData, optionStringsText)).toEqual(expected);
    });
  });

  describe("when is select_box", () => {
    it("should return OptionStringsText with disabled options", () => {
      const selectedField = fromJS({
        guiding_questions: {},
        display_name: {
          en: "options field"
        },
        created_at: "2023-01-10T16:45:57.556Z",
        name: "select_box_field",
        help_text: {},
        order: 6,
        form_section_id: 140,
        visible: true,
        option_strings_text: [
          {
            id: "option_1",
            disabled: true,
            display_text: {
              en: "Option 1"
            }
          },
          {
            id: "option_2",
            disabled: true,
            display_text: {
              en: "Option 2"
            }
          },
          {
            id: "option_3",
            disabled: false,
            display_text: {
              en: "Option 3"
            }
          }
        ],
        type: "select_box",
        id: 2654,
        disabled: false
      });
      const fieldData = {
        guiding_questions: {},
        display_name: {
          en: "options field"
        },
        created_at: "2023-01-09T16:45:57.556Z",
        name: "name_test_6be1d50",
        help_text: {},
        order: 6,
        form_section_id: 140,
        visible: true,
        option_strings_text: [
          {
            id: "option_1",
            disabled: true,
            display_text: {
              en: "Option 1"
            }
          },
          {
            id: "option_2",
            disabled: true,
            display_text: {
              en: "Option 2"
            }
          },
          {
            id: "option_3",
            disabled: false,
            display_text: {
              en: "Option 3"
            }
          }
        ],
        type: "select_box",
        id: 2654
      };
      const optionStringsText = [
        {
          id: "option_1",
          disabled: true,
          display_text: {
            en: "Option 1"
          }
        },
        {
          id: "option_2",
          disabled: true,
          display_text: {
            en: "Option 2"
          }
        },
        {
          id: "option_3",
          disabled: false,
          display_text: {
            en: "Option 3"
          }
        }
      ];
      const expected = [
        {
          disabled: false,
          display_text: {
            en: "Option 1"
          },
          id: "option_1"
        },
        {
          disabled: false,
          display_text: {
            en: "Option 2"
          },
          id: "option_2"
        },
        {
          disabled: true,
          display_text: {
            en: "Option 3"
          },
          id: "option_3"
        }
      ];

      expect(disableOptionStringsText(selectedField, fieldData, optionStringsText)).toEqual(expected);
    });
  });
});
