def create_user(user_name)
  User.create!("user_name" => user_name,
               "password" => "rapidftr",
               "password_confirmation" => "rapidftr",
               "full_name" => user_name,
               "organization" => "UNICEF",
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
      'module_id' => PrimeroModule.find_by_name('MRM').id,
    )
    user_name = incident_hash['created_by']
    if User.find_by_user_name(user_name).nil?
      create_user(user_name)
    end

    User.find_by_user_name(user_name).
        update_attributes({:organization => incident_hash['created_organization']}) if incident_hash['created_organization']

    incident_hash['flag_at'] = incident_hash['flagged_at'] || DateTime.new(2001, 2, 3, 4, 5, 6)
    flag, flag_message = incident_hash.delete('flag') == 'true', incident_hash.delete('flag_message')
    incident = Incident.new_with_user_name(User.find_by_user_name(user_name), incident_hash)
    incident['histories'] ||= []
    incident['histories'] << {'datetime' => incident['flag_at'], 'changes' => {'flag' => 'anything'}}

    incident.create!
    # Need this because of how children_helper grabs flag_message from child history - cg
    if flag
      incident.flags = [Flag.new(:message => flag_message, :flagged_by => user_name)]
      incident.save!
    end
  end
end

Given /^the following incidents with violations exist in the system:$/ do |incident_table|
  incident_table.hashes.each do |incident_hash|
    incident_hash.reverse_merge!(
      'estimated_indicator' => 'Yes',
      'UN_eyewitness' => 'Yes',
      'incident_total_boys' => '3',
      'incident_total_girls' => '5',
      'incident_total_unknown' => '2',
    )

    #Create violations hash
    #NOTE: for now, this will add at most 1 of each type of violation
    violation_list = incident_hash["violations"].split(', ')
    if violation_list.present?
      violation_hash = {}
      violation_list.each do |violation|
        field_hash = {}
        field_hash["voilation_#{violation}_boys"] = "1"
        index_hash = {}
        index_hash["0"] = field_hash
        violation_hash["#{violation}"] = index_hash
      end

      incident_hash.merge!('violations' => violation_hash) if violation_hash.present?
    end

    user_name = incident_hash['created_by']
    if User.find_by_user_name(user_name).nil?
      create_user(user_name)
    end

    User.find_by_user_name(user_name).
        update_attributes({:organization => incident_hash['created_organization']}) if incident_hash['created_organization']

    incident = Incident.new_with_user_name(User.find_by_user_name(user_name), incident_hash)

    incident.create!
  end
end
