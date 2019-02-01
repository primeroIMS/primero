FactoryBot.define do
  factory :agency do
    id {counter}
    name {"agency#{counter}"}
    agency_code {"AGENCY#{counter}"}
  end
end