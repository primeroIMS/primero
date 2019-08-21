json.data do
  json.array! @tasks do |task|
    json.partial! 'api/v2/tasks/task', task: task
  end
end

json.metadata do
  json.total @total
  json.per @per
  json.page @page
end