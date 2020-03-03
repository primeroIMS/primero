def create_or_update_user_group(user_group_hash)
  user_group = UserGroup.find_by(unique_id: user_group_hash[:unique_id])

  if user_group.nil?
    puts "Creating user group #{user_group_hash[:unique_id]}"
    UserGroup.create! user_group_hash
  else
    puts "Updating user group #{user_group_hash[:unique_id]}"
    user_group.update_attributes user_group_hash
  end

end


create_or_update_user_group(
  unique_id: "usergroup-primero-cp",
  name: "Primero CP",
  description: "Default Primero User Group for CP"
)

create_or_update_user_group(
  unique_id: "usergroup-primero-ftr",
  name: "Primero FTR",
  description: "Default Primero User Group for FTR"
)

create_or_update_user_group(
  unique_id: "usergroup-primero-gbv",
  name: "Primero GBV",
  description: "Default Primero User Group for GBV"
)

