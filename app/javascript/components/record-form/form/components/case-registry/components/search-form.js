import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../action-button";
import Form, { FieldRecord, FormSectionRecord, SELECT_FIELD } from "../../../../../form";
import css from "../../../subforms/styles.css";
import { FORM_ID } from "../constants";

const SearchForm = ({ setComponent, setSearchParams, handleCancel, fields, setDrawerTitle }) => {
  setDrawerTitle("Search for Farmer");

  const handleSearch = async data => {
    const { search_by, ...searchParams } = data;

    await setSearchParams(searchParams);
    setComponent(1);
  };

  const searchByField = FieldRecord({
    display_name: "search_by",
    name: "search_by",
    type: SELECT_FIELD,
    option_strings_text: [
      { id: "registry_no", display_text: "Reg" },
      { id: "name", display_text: "Name" }
    ]
  });

  const formFields = [
    FormSectionRecord({
      unique_id: "registry-search",
      fields: [searchByField, ...fields.valueSeq()].map(field => {
        if (["name", "registry_no"].includes(field.name)) {
          return field.merge({
            watchedInputs: "search_by",
            showIf: searchBy => {
              if (field.name === "name") {
                return searchBy === field.name;
              }

              if (field.name === "registry_no") {
                return searchBy === field.name;
              }

              return false;
            }
          });
        }

        return field;
      })
    })
  ];

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <ActionButton type={ACTION_BUTTON_TYPES.default} text="Back to Case" rest={{ onClick: handleCancel }} />
        <ActionButton type={ACTION_BUTTON_TYPES.default} text="Search" rest={{ form: FORM_ID, type: "submit" }} />
      </div>
      <Form formID={FORM_ID} formSections={formFields} onSubmit={handleSearch} />
    </>
  );
};

SearchForm.displayName = "SearchForm";

export default SearchForm;
