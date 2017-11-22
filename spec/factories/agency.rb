FactoryBot.define do
  factory :agency, :traits => [ :model ] do
    id {"agency#{counter}"}
    name {"agency#{counter}"}
    agency_code {"AGENCY#{counter}"}
  end
end