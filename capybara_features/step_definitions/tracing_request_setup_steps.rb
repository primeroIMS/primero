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

Given /^the following tracing request exist in the system:$/ do |tracing_request_table|
  tracing_request_table.hashes.each do |tracing_request_hash|
    tracing_request_hash['module_id'] ||= PrimeroModule.find_by_name('CP').id

    user_name = tracing_request_hash['created_by']
    if User.find_by_user_name(user_name).nil?
      create_user(user_name)
    end

    User.find_by_user_name(user_name).
        update_attributes({:organization => tracing_request_hash['created_organization']}) if tracing_request_hash['created_organization']

    tracing_request_hash['flag_at'] = tracing_request_hash['flagged_at'] || DateTime.new(2001, 2, 3, 4, 5, 6)
    flag, flag_message = tracing_request_hash.delete('flag') == 'true', tracing_request_hash.delete('flag_message')
    tracing_request = TracingRequest.new_with_user_name(User.find_by_user_name(user_name), tracing_request_hash)
    tracing_request['histories'] ||= []
    tracing_request['histories'] << {'datetime' => tracing_request['flag_at'], 'changes' => {'flag' => 'anything'}}
    tracing_request['inquiry_status'] = "Open" if tracing_request_hash['inquiry_status'].blank?

    tracing_request.create!
    # Need this because of how children_helper grabs flag_message from child history - cg
    if flag
      tracing_request.flags = [Flag.new(:message => flag_message, :flagged_by => user_name)]
      tracing_request.save!
    end
  end
end
