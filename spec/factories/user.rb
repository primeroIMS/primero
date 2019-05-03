FactoryBot.define do
  factory :user, :traits => [ :model ] do
    user_name { "user_name_#{counter}" }
    full_name { 'full name' }
    password { 'passw0rd' }
    password_confirmation { 'passw0rd' }
    email { 'email@ddress.net' }
    organization { 'agency-unicef' } #TODO: Refactor as association?
    location { 'SLE0103' }
    disabled { false }
    role_ids { ['random_role_id'] }
    module_ids { ['CP'] }
    user_group_ids { ["user-group-primero"] }
  end

  # TODO: This does not longer exist.
  # factory :change_password_form, :class => Forms::ChangePasswordForm do
  #   association :user
  #   old_password { "old_password" }
  #   new_password { "new_password" }
  #   new_password_confirmation { "confirm_new_password" }
  # end

  factory :user_group, :traits => [ :model ] do
    name { "user_group_#{counter}" }
    description { "User Group #{counter}" }
  end
end
