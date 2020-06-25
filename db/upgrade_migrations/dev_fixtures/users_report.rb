require 'csv'

# Report on users with bad data
# Creates a csv file for..
# -  users with multiple roles
# -  users with no location
# -  users with blank or bogus user_group_ids
#
# To execute this script:
#    bundle exec rails r <path_to_script>/users_report.rb


user_multiple_roles = []
user_no_location = []
user_bad_user_group = []

user_group_ids = UserGroup.all.map(&:id)
roles = Role.all.all

User.all.each do |user|
  if user.role_ids.count > 1
    user_multiple_roles << {
      user_name: user.user_name,
      role_ids: roles.select{|r| user.role_ids.include?(r.id)}.map(&:name),
      agency: user.agency.name
    }
  end

  if user.location.blank?
    user_no_location << {
      user_name: user.user_name,
      role_ids: roles.select{|r| user.role_ids.include?(r.id)}.map(&:name),
      agency: user.agency.name,
      user_group_ids: user.user_group_ids.flatten
    }
  end

  if user.user_group_ids.any?{|ug| ug.blank? || user_group_ids.exclude?(ug)}
    user_bad_user_group << {
      user_name: user.user_name,
      role_ids: roles.select{|r| user.role_ids.include?(r.id)}.map(&:name),
      agency: user.agency.name,
      user_group_ids: user.user_group_ids.flatten
    }
  end
end

file_roles = "multiple_roles.csv"
CSV.open(file_roles, "w") do |csv|
  csv << ['User Name', 'Roles', 'Agency']
  user_multiple_roles.each do |user|
    csv << [user[:user_name], user[:role_ids], user[:agency]]
  end
end

file_location = "user_no_location.csv"
CSV.open(file_location, "w") do |csv|
  csv << ['User Name', 'Roles', 'Agency', 'user_group_ids']
  user_no_location.each do |user|
    csv << [user[:user_name], user[:role_ids], user[:agency], user[:user_group_ids]]
  end
end

file_user_groups = "user_bad_user_group.csv"
CSV.open(file_user_groups, "w") do |csv|
  csv << ['User Name', 'Roles', 'Agency', 'user_group_ids']
  user_bad_user_group.each do |user|
    csv << [user[:user_name], user[:role_ids], user[:agency], user[:user_group_ids]]
  end
end


