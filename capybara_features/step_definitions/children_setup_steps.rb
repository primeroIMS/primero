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

Given /^the following (children|cases) exist in the system:$/ do |type, children_table|
  children_table.hashes.each do |child_hash|
    child_hash.reverse_merge!(
        'birthplace' => 'Cairo',
        'photo_path' => 'capybara_features/resources/jorge.jpg',
        'reporter' => 'zubair',
        'created_by' => 'Billy',
        'created_organisation' => 'UNICEF',
        'age_is' => 'Approximate',
        'flag_message' => 'Reason for flagging',
        'child_status' => 'open',
        'module_id' => PrimeroModule.find_by_name('CP').id,
    )
    user_name = child_hash['created_by']
    if User.find_by_user_name(user_name).nil?
      create_user(user_name)
    end
    if child_hash['duplicate'] == "true"
      child_hash.reverse_merge!('duplicate_of' => '123')
    else
      child_hash.delete('duplicate')
    end
    User.find_by_user_name(user_name).
        update_attributes({:organisation => child_hash['created_organisation']}) if child_hash['created_organisation']


    child_hash['flag_at'] = child_hash['flagged_at'] || DateTime.new(2001, 2, 3, 4, 5, 6)
    child_hash['reunited_at'] = child_hash['reunited_at'] || DateTime.new(2012, 2, 3, 4, 5, 6)
    flag, flag_message = child_hash.delete('flag') == 'true', child_hash.delete('flag_message')

    photo = uploadable_photo(child_hash.delete('photo_path')) if child_hash['photo_path'] != ''
    child = Child.new_with_user_name(User.find_by_user_name(user_name), child_hash)
    child.photo = photo
    child['histories'] ||= []
    child['histories'] << {'datetime' => child_hash['flag_at'], 'changes' => {'flag' => 'anything'}}
    child['histories'] << {'datetime' => child_hash['reunited_at'], 'changes' => {'reunited' => {'from' => nil, 'to' => "true"}, 'reunited_message' => {'from' => nil, 'to' => 'some message'}}}
    child['investigated'] = child_hash['investigated'] == 'true'
    child['child_status'] = "Open" if child_hash['child_status'].blank?

    child.create!
    # Need this because of how children_helper grabs flag_message from child history - cg
    if flag
      child.flags = [Flag.new(:message => flag_message, :flagged_by => user_name)]
      child.save!
    end
  end
end

Given /^I add to cases "(.*)" the following subform "(.*)":$/ do |name, subform_name_id, subform_table|
  child = Child.by_name(:key => name).first
  subform_table.hashes.each {|h| child[subform_name_id].push(h) }
  child.save!
end

Given /^someone has entered a child with the name "([^\"]*)"$/ do |child_name|
  fill_in('Name', :with => child_name)
  # Birthplace removed. Waiting on finalize form fields
  # fill_in('Birthplace', :with => 'Haiti')
  click_button('Save')
end

Given /^"([^\"]*)" is a duplicate of "([^\"]*)"$/ do |duplicate_name, parent_name|
  duplicate = Child.by_name(:key => duplicate_name).first
  parent = Child.by_name(:key => parent_name).first
  duplicate.mark_as_duplicate(parent['short_id'])
  duplicate.save
end

Then /^the form section "([^"]*)" should be (present|hidden)$/ do |form_section, visibility|
  if visibility == 'hidden'
    page.has_no_link?(form_section).should be_true
  else
    page.has_link?(form_section).should be_true
  end
end


