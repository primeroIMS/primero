FactoryBot.define do
  factory :agency, traits: [:active_model] do
    id {counter}
    name {"agency#{counter}"}
    agency_code {"AGENCY#{counter}"}
  end
end