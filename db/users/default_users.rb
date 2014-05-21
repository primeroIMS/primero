User.create!("user_name" => "primero",
              "password" => "qu01n23",
              "password_confirmation" => "qu01n23",
              "full_name" => "System Superuser",
              "email" => "primero@primero.com",
              "disabled" => "false",
              "organisation" => "N/A",
              "role_ids" => Role.by_name.all.map{|r| r.id}
)