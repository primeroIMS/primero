FactoryBot.define do
  factory :lookup, class: Lookup, :traits => [ :active_model ] do
    name { "test_lookup_#{counter}" }
    lookup_values { ['value1', 'value2'] }
  end
end
