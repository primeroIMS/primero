import { fromJS } from "immutable";

import { mergeRecord, listAttachmentFields } from "./reducer-helpers";

describe("libs/reducer-helpers.js", () => {
  describe("listAttachmentFields", () => {
    it("returns attachment fields and forms object", () => {
      const expected = {
        fields: ["document_field"],
        forms: {
          document_form: { en: "Document Form" }
        }
      };

      const formSections = [
        {
          unique_id: "document_form",
          id: 1,
          name: { en: "Document Form" }
        },
        {
          unique_id: "text_form",
          id: 2,
          name: { en: "Text Form" }
        }
      ];

      const fields = [
        { type: "photo_upload_box", form_section_id: 1, name: "document_field" },
        { type: "text_field", form_section_id: 2, name: "text_field" }
      ];

      expect(listAttachmentFields(formSections, fields)).to.deep.equal(expected);
    });
  });

  describe("mergeRecord", () => {
    it("should merge deep object and update/concat arrays", () => {
      const record = fromJS({
        id: 1,
        first_name: "Josh",
        middle_name: "Fren",
        photos: [
          { id: 1, attachment_url: "url 1" },
          { id: 2, attachment_url: "url 2" }
        ],
        locations: [],
        countries: ["united_states"],
        nationality: ["american"],
        followups: [
          {
            unique_id: 1,
            field: "field-value-1"
          },
          {
            unique_id: 2,
            field2: "field2-value-2",
            nationality: ["french"]
          },
          {
            unique_id: 4,
            field1: "field1-value-4"
          }
        ]
      });

      const payload = fromJS({
        last_name: "James",
        countries: ["united_states", "spain"],
        nationality: ["brazillian", "british"],
        photos: [
          { id: 1, attachment_url: "url 1" },
          { id: 2, attachment_url: "url 2" },
          { id: 3, attachment_url: "url 3" }
        ],
        followups: [
          {
            unique_id: 2,
            field3: "field3-value-2",
            nationality: ["japanese", "american"]
          },
          {
            unique_id: 3,
            field2: "field2-value-3",
            field3: "field3-value-3"
          },
          {
            unique_id: 4,
            field1: ""
          }
        ]
      });

      const expected = fromJS({
        id: 1,
        first_name: "Josh",
        middle_name: "Fren",
        last_name: "James",
        locations: [],
        countries: ["united_states", "spain"],
        nationality: ["brazillian", "british"],
        photos: [
          { id: 1, attachment_url: "url 1" },
          { id: 2, attachment_url: "url 2" },
          { id: 3, attachment_url: "url 3" }
        ],
        followups: [
          {
            unique_id: 2,
            field3: "field3-value-2",
            nationality: ["japanese", "american"]
          },
          {
            unique_id: 3,
            field2: "field2-value-3",
            field3: "field3-value-3"
          },
          {
            unique_id: 4,
            field1: ""
          }
        ]
      });

      expect(mergeRecord(record, payload).toJS()).to.deep.equal(expected.toJS());
    });

    it("should merge deep object and preserves the order of update/concat arrays", () => {
      const services = [
        {
          unique_id: "3bd56041-420f-4c8c-ab2c-72a7db49ee60",
          field: "field-value-1"
        },
        {
          unique_id: "26723ea0-e525-4e2a-9e2b-63407d23a432",
          field1: "field2-value-2"
        },
        {
          unique_id: "bb403c6b-e870-44b9-ac8a-02de791da5cb",
          field1: "field1-value-3"
        },
        {
          unique_id: "ac873fc6-f116-4a47-a004-992a46632bc0",
          field1: "field1-value-4"
        },
        {
          unique_id: "1288d7dd-4d5a-478d-abbb-242d6ffb1c79",
          field1: "field1-value-5"
        },
        {
          unique_id: "4015d71f-a94b-444c-b2a3-437fc697fc90",
          field1: "field1-value-6"
        },
        {
          unique_id: "2856f54e-a157-4763-9e29-42284d841aef",
          field1: "field1-value-7"
        },
        {
          unique_id: "08f4d874-5d5d-4143-a034-894fb0476115",
          field1: "field1-value-8"
        },
        {
          unique_id: "81e2aebb-1b3c-4a78-85c4-32586a946f75",
          field1: "field1-value-9"
        },
        {
          unique_id: "15fc8d49-419a-4870-9889-3cc8fb21e0c4",
          field1: "field1-value-10"
        },
        {
          unique_id: "3bb0dbf3-19ca-46e4-aa10-90bd7d11a09d",
          field1: "field1-value-11"
        }
      ];

      const record = fromJS({
        id: 1,
        first_name: "Josh",
        middle_name: "Fren",
        photos: [
          { id: 1, attachment_url: "url 1" },
          { id: 2, attachment_url: "url 2" }
        ],
        locations: [],
        countries: ["united_states"],
        nationality: ["american"],
        services
      });

      const payload = fromJS({
        services
      });

      expect(mergeRecord(record, payload).toJS()).to.deep.equal(record.toJS());
    });
  });
});
