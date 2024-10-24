json.data do
  json.partial! 'api/v2/messages/message', message: @message
end
