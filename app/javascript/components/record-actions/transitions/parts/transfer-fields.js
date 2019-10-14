export default {
  internal: [
    {
      id: "agency",
      label: i18n.t("transfer.agency_label"),
      options: mockData
    },
    {
      id: "location",
      label: i18n.t("transfer.location_label"),
      options: mockData
    },
    {
      id: "recipient",
      label: i18n.t("transfer.recipient_label"),
      options: mockData
    },
    {
      id: "internalNotes",
      label: i18n.t("transfer.notes_label")
    }
  ],
  external: [
    {
      id: "typeOfTransition",
      label: "Type of transition",
      options: [{ value: "transfer", label: "Transfer" }]
    },
    {
      id: "otherUser",
      label: "Other User"
    },
    {
      id: "otherUserAgency",
      label: "Other User's Agency"
    },
    {
      id: "externalNotes",
      label: i18n.t("transfer.notes_label")
    },
    {
      id: "typeExport",
      label: "What type of export do you want?",
      options: [
        { value: "primero", label: "JSON (Primero)" },
        { value: "non_primero", label: "JSON (Non-Primero)" }
      ]
    },
    {
      id: "passwordFile",
      label: "Please enter a password that will encrypt your file."
    },
    {
      id: "fileName",
      label: "Create your own file name (Optional)"
    }
  ]
};
