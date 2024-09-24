import { ListHeaderRecord } from "../components/user/records";
import { RECORD_PATH } from "../config";

const lookups = () => ({
  data: [
    {
      unique_id: "lookup-1",
      name: { en: "Lookup 1" },
      values: [
        { id: "a", display_text: [{ en: "Lookup 1 a" }] },
        { id: "b", display_text: [{ en: "Lookup 1 b" }] }
      ]
    },
    {
      unique_id: "lookup-2",
      name: { en: "Lookup 2" },
      values: [
        { id: "a", display_text: [{ en: "Lookup 2 a" }] },
        { id: "b", display_text: [{ en: "Lookup 2 b" }] }
      ]
    }
  ],
  metadata: {
    total: 2,
    per: 1,
    page: 1
  }
});

const listHeaders = recordType => {
  const commonHeaders = [
    ListHeaderRecord({
      name: "description",
      field_name: "description",
      id_search: false
    })
  ];

  switch (recordType) {
    case RECORD_PATH.user_groups:
      return [
        ListHeaderRecord({
          name: "user_group.name",
          field_name: "name",
          id_search: false
        }),
        ...commonHeaders
      ];

    case RECORD_PATH.agencies:
      return [
        ListHeaderRecord({
          name: "agency.name",
          field_name: "name",
          id_search: false
        }),
        ...commonHeaders
      ];

    default:
      return [];
  }
};

export { lookups, listHeaders };
