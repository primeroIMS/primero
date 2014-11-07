Given(/^the following agencies exist in the system:$/) do |table|
  table.raw.flatten.each do |value|
    Agency.create!(:name => value)
  end
end
