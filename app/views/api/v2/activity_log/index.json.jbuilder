# frozen_string_literal: true

json.data do
  json.array! @activity_logs do |activity_log|
    json.partial! 'api/v2/activity_log/activity_log', activity_log: activity_log
  end
end

json.metadata do
  json.total @total
end
