FactoryBot.define do
  factory :form_section, traits: [:active_model] do
    unique_id { "form_section_#{counter}" }
    form_group_id { "form_section_#{counter}" }
    name { "Form Section #{counter}" }
    fields { [] }
    parent_form { 'case' }
    is_first_tab { false }
  end

  factory :subform_section, class: FormSection, traits: [:active_model] do
    unique_id { "form_section_#{counter}" }
    form_group_id { "form_section_#{counter}" }
    name { "Form Section #{counter}" }
    fields { [] }
    is_first_tab { false }
    is_nested { true }
    initial_subforms { 1 }
    parent_form { 'case' }
    visible { false }
  end
end
