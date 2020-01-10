json.data do
  json.array! @roles do |role|
    json.partial! 'api/v2/roles/role', role: role
  end
end