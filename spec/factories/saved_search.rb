FactoryBot.define do
  factory :saved_search, :traits => [ :model ] do
    name { "saved_search_#{counter}" }
    user_name { "zuul" }
  end
end
