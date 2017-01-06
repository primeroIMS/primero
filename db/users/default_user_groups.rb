def create_or_update_user_group(user_group_hash)
  user_group_id = UserGroup.id_from_name(user_group_hash[:name])
  user_group = UserGroup.get(user_group_id)

  if user_group.nil?
    puts "Creating user group #{user_group_id}"
    UserGroup.create! user_group_hash
  else
    puts "Updating user group #{user_group_id}"
    user_group.update_attributes user_group_hash
  end

end


create_or_update_user_group(
  name: "Primero CP",
  description: "Default Primero User Group for CP"
)

create_or_update_user_group(
    name: "Primero FTR",
    description: "Default Primero User Group for FTR"
)

create_or_update_user_group(
  name: "Primero GBV",
  description: "Default Primero User Group for GBV"
)

