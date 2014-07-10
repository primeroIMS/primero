User.create!("user_name" => "primero",
              "password" => "qu01n23",
              "password_confirmation" => "qu01n23",
              "full_name" => "System Superuser",
              "email" => "primero@primero.com",
              "disabled" => "false",
              "organisation" => "N/A",
              "role_ids" => Role.by_name.all.map{|r| r.id}
)

User.create!("user_name" => "primero_incident",
              "password" => "qu01n23",
              "password_confirmation" => "qu01n23",
              "full_name" => "Incident Worker",
              "email" => "primero_incident@primero.com",
              "disabled" => "false",
              "organisation" => "N/A",
              "role_ids" => [Role.by_name(:key => "Worker: Incidents").first.id]
)

User.create!("user_name" => "primero_case",
              "password" => "qu01n23",
              "password_confirmation" => "qu01n23",
              "full_name" => "Case Worker",
              "email" => "primero_case@primero.com",
              "disabled" => "false",
              "organisation" => "N/A",
              "role_ids" => [Role.by_name(:key => "Worker: Cases").first.id]
)