FactoryBot.define do
  factory :role, traits: [:active_model] do
    name { "test_role_#{counter}" }
    description { 'test description' }
    permissions { Permission.all_available }
    modules { [FactoryBot.create(:primero_module)] }
  end
end
