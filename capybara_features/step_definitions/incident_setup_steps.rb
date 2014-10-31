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
      'incident_total_tally_boys' => '3',
      'incident_total_tally_girls' => '5',
      'incident_total_tally_unknown' => '2',
      'incident_total_tally_total' => '10',
      'module_id' => PrimeroModule.find_by_name('MRM').id
    )
    user_name = incident_hash['created_by']
    if User.find_by_user_name(user_name).nil?
      create_user(user_name)
    end

    User.find_by_user_name(user_name).
        update_attributes({:organization => incident_hash['created_organization']}) if incident_hash['created_organization']

    incident_hash['flag_at'] = incident_hash['flagged_at'] || DateTime.new(2001, 2, 3, 4, 5, 6)
    flag, flag_message = incident_hash.delete('flag') == 'true', incident_hash.delete('flag_message')

    #Create violations hash
    #MRM needs at least the violations subforms empty.
    violation_hash = create_violations_subforms(incident_hash)
    incident_hash.merge!('violations' => violation_hash) unless violation_hash.nil?

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
      'incident_total_tally_boys' => '3',
      'incident_total_tally_girls' => '5',
      'incident_total_tally_unknown' => '2',
      'incident_total_tally_total' => '10',
      'module_id' => PrimeroModule.find_by_name('MRM').id
    )

    #Create violations hash
    #MRM needs at least the violations subforms empty.
    violation_hash = create_violations_subforms(incident_hash)
    incident_hash.merge!('violations' => violation_hash) unless violation_hash.nil?

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

Given /^the following incidents were flagged:$/ do |table|
  created_at_day = 6
  flag_date_day = 6
  table.raw.flatten.each do |value|
    incident = Incident.by_unique_identifier(:key => value).all.first
    flags = []
    #Adding a valid flag
    flags << Flag.new(:created_at => eval("#{created_at_day}.days.ago"),
                      :date => eval("#{flag_date_day}.days.ago"),
                      :message => "Flagged #{incident.short_id}")
    #Adding invalid flag
    flags << Flag.new(:created_at => eval("#{created_at_day}.days.ago"),
                      :date => eval("#{flag_date_day}.days.ago"),
                      :message => "Flagged #{incident.short_id}",
                      :unflag_message => "Unflagged #{incident.short_id}",
                      :removed => true)
    #Adding a valid flag but older
    flags << Flag.new(:created_at => 3.weeks.ago,
                      :date => 3.weeks.ago,
                      :message => "Older Flagged #{incident.short_id}")
    incident.flags = flags
    incident.save!
    #The next incident will has a newer flag dates.
    created_at_day -= 1
    flag_date_day -= 1
  end
end

def create_violations_subforms(incident_hash)
  if incident_hash['module_id'] == PrimeroModule.find_by_name('MRM').id
    violation_hash = {}
    #Add a new violations subform here.
    violations_subforms = ["killing", "maiming", "recruitment", "sexual_violence", "abduction", "attack_on_schools", 
                           "attack_on_hospitals", "denial_humanitarian_access", "other_violation"]
    #The user provide a list of violations to at least has one record.
    violation_list = incident_hash["violations"].present? ? incident_hash["violations"].split(', ') : []
    violations_subforms.each do |subform_violation|
      index_hash = {}
      if violation_list.include?(subform_violation)
        index_hash["0"] = {"violation_tally_boys" => "1"}
      elsif violation_list.include?("#{subform_violation}:Verified")
        index_hash["0"] = {"violation_tally_boys" => "1", "verified" => "Verified"}
      end
      violation_hash["#{subform_violation}"] = index_hash
    end
    return violation_hash
  end
end
