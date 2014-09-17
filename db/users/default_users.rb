def create_or_update_user(user_hash)
  user_id = User.user_id_from_name user_hash["user_name"]
  user = User.get user_id

  if user.nil?
    puts "Creating user #{user_id}"
    User.create! user_hash
  else
    puts "Updating user #{user_id}"
    user_attributes = {
       "user_name" => user_hash["user_name"],
       "full_name" => user_hash["full_name"],
       "role_ids" => user_hash["role_ids"],
       "module_ids" => user_hash["module_ids"],
       "reporting_hierarchy" => user_hash["reporting_hierarchy"],
    }
    user.update_attributes user_attributes
  end

end


create_or_update_user(
  "user_name" => "primero",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "System Superuser",
  "email" => "primero@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [
    Role.by_name(key: "Superuser").first.id
  ],
  "module_ids" => PrimeroModule.by_name.all.map{|m| m.id},
  "is_manager" => "true"
)

create_or_update_user(
  "user_name" => "primero_cp",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "CP Worker",
  "email" => "primero_cp@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [
    Role.by_name(key: "CP Case Worker").first.id
  ],
  "module_ids" => [PrimeroModule.by_name(key: "CP").first.id],
  "reporting_hierarchy" => ["primero"]
)

create_or_update_user(
  "user_name" => "primero_mgr_cp",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "CP Manager",
  "email" => "primero_mgr_cp@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [
    Role.by_name(key: "CP Manager").first.id
  ],
  "module_ids" => [PrimeroModule.by_name(key: "CP").first.id],
  "reporting_hierarchy" => ["primero"],
  "is_manager" => "true"
)

create_or_update_user(
  "user_name" => "primero_gbv",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "GBV Worker",
  "email" => "primero_gbv@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [
    Role.by_name(key: "GBV Social Worker").first.id
  ],
  "module_ids" => [PrimeroModule.by_name(key: "GBV").first.id],
  "reporting_hierarchy" => ["primero"]
)

create_or_update_user(
  "user_name" => "primero_mgr_gbv",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "GBV Manager",
  "email" => "primero_mgr_gbv@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [
    Role.by_name(key: "GBV Manager").first.id
  ],
  "module_ids" => [PrimeroModule.by_name(key: "GBV").first.id],
  "reporting_hierarchy" => ["primero"],
  "is_manager" => "true"
)

create_or_update_user(
  "user_name" => "primero_mrm",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "MRM Worker",
  "email" => "primero_mrm@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [
    Role.by_name(key: "MRM Worker").first.id
  ],
  "module_ids" => [PrimeroModule.by_name(key: "MRM").first.id],
  "reporting_hierarchy" => ["primero"]
)

create_or_update_user(
  "user_name" => "primero_mgr_mrm",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "MRM Manager",
  "email" => "primero_mgr_mrm@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [
    Role.by_name(key: "MRM Manager").first.id
  ],
  "module_ids" => [PrimeroModule.by_name(key: "MRM").first.id],
  "reporting_hierarchy" => ["primero"],
  "is_manager" => "true"
)
