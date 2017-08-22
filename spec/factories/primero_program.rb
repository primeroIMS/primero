FactoryGirl.define do
  factory :primero_program, :traits => [:model] do
    name { "test_program_#{counter}"}
    description "test description"
  end
end