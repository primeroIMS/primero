FactoryBot.define do
  factory :primero_program, :traits => [:active_model] do
    name { "test_program_#{counter}"}
    description { "test description" }
  end
end
