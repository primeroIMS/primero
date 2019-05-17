FactoryBot.define do
  factory :permission, :traits => [ :model ] do
    resource { Permission::CASE }
    actions { [
      Permission::READ,
      Permission::WRITE
    ] }
  end
end
