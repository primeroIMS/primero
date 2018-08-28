def duplicate_user(user_hash, locale_string)
  puts("duplicate user with user_name " + user_hash["user_name"] + " and locale_string " + locale_string)

  user_hash = user_hash.clone
  ["salt", "crypted_password", "created_at", "updated_at"].each do |attribute|
    user_hash[attribute] = nil
  end

  default_password = "primer0!"
  user_hash["password"] = user_hash["password_confirmation"] = default_password
  user_hash["user_name"] = user_hash["user_name"] + "_" + locale_string
  user_hash["full_name"] = user_hash["full_name"] + " " + locale_string.upcase
  user_hash["locale"] = locale_string

  User.create! user_hash

end

def duplicate_users
  User.all.each do |user|
    ['ar', 'fr'].each do |locale_string|
      duplicate_user(user.attributes, locale_string)
    end
  end
end

duplicate_users
