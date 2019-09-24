json.data do
  json.array! @users do |user|
    json.id user.id
    json.user_name user.user_name
    json.full_name user.full_name
    json.position user.position
  end
end