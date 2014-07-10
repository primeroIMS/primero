def create_user(user_name)
  User.create!("user_name" => user_name,
               "password" => "rapidftr",
               "password_confirmation" => "rapidftr",
               "full_name" => user_name,
               "organisation" => "UNICEF",
               "disabled" => "false",
               "email" => "rapidftr@rapidftr.com",
               "role_ids" => ["ADMIN"])
end

Given /^the following incidents exist in the system:$/ do |incident_table|
  incident_table.hashes.each do |incident_hash|
    incident_hash.reverse_merge!(
      'estimated_indicator' => 'Yes',
      'UN_eyewitness' => 'Yes',
      'incident_total_boys' => '3',
      'incident_total_girls' => '5',
      'incident_total_unknown' => '2',
    )
    user_name = incident_hash['created_by']
    if User.find_by_user_name(user_name).nil?
      create_user(user_name)
    end

    User.find_by_user_name(user_name).
        update_attributes({:organisation => incident_hash['created_organisation']}) if incident_hash['created_organisation']

    incident = Incident.new_with_user_name(User.find_by_user_name(user_name), incident_hash)

    incident.create!
  end
end