FactoryBot.define do
  factory :field, traits: [:active_model] do
    type Field::TEXT_FIELD
    name { "field_#{counter}" }
    display_name { "Field #{counter}" }
    visible true
    editable true
    disabled false
  end

  factory :select_field, class: Field, traits: [:active_model] do
    type Field::SELECT_BOX
    name { "select_field_#{counter}" }
    display_name { "Select Field #{counter}" }
    visible true
    editable true
    disabled false
    multi_select true
    option_strings_text_all %W(test1, test2, test3)
  end

  factory :subform_field, class: Field, traits: [:active_model] do
    transient do
      fields []
      initial_subforms 1
      unique_id { "form_section_#{counter}" }
    end

    type Field::SUBFORM
    name { "field_#{counter}" }
    display_name { "Field #{counter}" }
    visible true
    editable true
    disabled false

    after(:build) do |field, evaluator|
      fs = create :subform_section,
        unique_id: evaluator.unique_id,
        initial_subforms: evaluator.initial_subforms,
        fields: evaluator.fields
      #TODO: Why isn't this working?
      field.subform_section_id = fs.id
    end
  end
end