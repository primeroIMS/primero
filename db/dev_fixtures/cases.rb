{
  "ff928802-455b-4735-9e5c-4ed9acace001" => ->(c) do
    c.module_id = 'primeromodule-cp'
    c.name = 'David Thomas'
    c.family_details_section = [
      {:relation_name => 'Jacob', :relation => 'Father'},
      {:relation_name => 'Martha', :relation => 'Mother'},
    ]
    c.date_of_birth = Date.new(2005, 01, 01)
    c.sex = 'Male'
  end,

  "ef928802-455b-4735-9e5c-4ed9acace002" => ->(c) do
    c.name = 'Jonah Jacobson'
    c.module_id = 'primeromodule-cp'
    c.sex = 'Male'
    c.religion = ['Religion1']
    c.ethnicity = ['Kenyan']
  end,

  "df928802-455b-4735-9e5c-4ed9acace003" => ->(c) do
    c.module_id = 'primeromodule-gbv'
    c.name = 'Mary Davidson'
    c.sex = 'Female'
  end,

}.each do |k, v|
  default_owner = User.find_by_user_name("primero")
  c = Child.find_by_unique_identifier(k) || Child.new_with_user_name(default_owner, {:unique_identifier => k})
  v.call(c)
  puts "Child #{c.new? ? 'created' : 'updated'}: #{c.unique_identifier}"
  c.save!
end
