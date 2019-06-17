FactoryBot.define do
  factory :primero_module, :traits => [:active_model] do
    id {counter}
    name { "test_module_#{counter}"}
    description { "test description" }
    association :primero_program, factory: :primero_program, strategy: :build
    associated_record_types { ['case', 'incident'] }
    form_sections {[FactoryBot.create(:form_section)]}
  end
end
