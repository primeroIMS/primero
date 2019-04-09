FactoryBot.define do
  factory :primero_module, :traits => [:model] do
    name { "test_module_#{counter}"}
    description "test description"
    program_id 'test-program'
    associated_record_types ['case', 'incident']
    form_section_ids ['test-form-1']
  end
end
