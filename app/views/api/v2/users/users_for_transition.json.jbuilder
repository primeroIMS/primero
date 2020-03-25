json.data do
  json.array! @users do |user|
    json.id user.id
    json.user_name user.user_name
    json.code user.code
    json.position user.position
    json.location user.reporting_location&.location_code
    json.agency user.organization&.unique_id
    json.disabled user.disabled
  end
end
