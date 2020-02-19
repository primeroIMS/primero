FactoryBot.define do
  factory :user, traits: [:active_model] do
    user_name { "user_name_#{counter}" }
    full_name { 'full name' }
    password { 'passw0rd' }
    password_confirmation { 'passw0rd' }
    email { "email#{counter}@ddress.net" }
    association :agency, factory: :agency, strategy: :build
    location { 'SLE0103' }
    disabled { false }
    association :role, factory: :role, strategy: :build
    user_group_ids { [FactoryBot.create(:user_group).id] }
  end

  factory :user_group, traits: [:active_model] do
    name { "user_group_#{counter}" }
    description { "User Group #{counter}" }
  end
end
