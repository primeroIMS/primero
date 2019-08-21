json.data do
  json.array! @users do |user|
    json.partial! 'api/v2/users/user', user: user
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end
