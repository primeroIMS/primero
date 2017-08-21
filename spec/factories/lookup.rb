FactoryGirl.define do
  factory :lookup, :traits => [ :model ] do
    name { "test_lookup_#{counter}" }
    lookup_values ['value1', 'value2']
  end
end