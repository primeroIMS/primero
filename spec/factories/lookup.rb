FactoryBot.define do
  factory :lookup, class: Lookup, :traits => [ :active_model ] do
    name { "test_lookup_#{counter}" }
    lookup_values_en { [
      { id: 'province', display_text: 'Province' },
      { id: 'district', display_text: 'District' }
    ] }
  end
end
