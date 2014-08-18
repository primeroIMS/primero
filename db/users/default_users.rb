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
       "role_ids" => user_hash["role_ids"]
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
  "role_ids" => Role.by_name.all.map{|r| r.id}
)

create_or_update_user(
  "user_name" => "primero_incident",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "Incident Worker",
  "email" => "primero_incident@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [Role.by_name(:key => "Worker: Incidents").first.id]
)

create_or_update_user(
  "user_name" => "primero_case",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "Case Worker",
  "email" => "primero_case@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [Role.by_name(:key => "Worker: Cases").first.id]
)

create_or_update_user(
  "user_name" => "primero_tracing_request",
  "password" => "qu01n23",
  "password_confirmation" => "qu01n23",
  "full_name" => "Tracing Request Worker",
  "email" => "primero_tracing_request@primero.com",
  "disabled" => "false",
  "organisation" => "N/A",
  "role_ids" => [Role.by_name(:key => "Worker: Tracing Requests").first.id]
)