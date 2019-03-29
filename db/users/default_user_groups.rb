def create_or_update_user_group(user_group_hash)
  user_group_unique_id = "#{UserGroup.name}-#{user_group_hash[:name]}".parameterize.dasherize
  user_group = UserGroup.find_by(id: user_group_hash[:id])

  user_group_hash[:unique_id] = user_group_unique_id

  if user_group.nil?
    puts "Creating user group #{user_group_unique_id}"
    UserGroup.create! user_group_hash
  else
    puts "Updating user group #{user_group_unique_id}"
    user_group.update_attributes user_group_hash
  end

end


create_or_update_user_group(
  id: 1,
  name: "Primero CP",
  description: "Default Primero User Group for CP"
)

create_or_update_user_group(
  id: 2,
  name: "Primero FTR",
  description: "Default Primero User Group for FTR"
)

create_or_update_user_group(
  id: 3,
  name: "Primero GBV",
  description: "Default Primero User Group for GBV"
)

