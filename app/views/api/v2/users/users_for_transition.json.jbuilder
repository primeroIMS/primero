json.data do
  json.array! @users do |user|
    json.id user.id
    json.user_name user.user_name
    json.code user.code
    json.position user.position
  end
end