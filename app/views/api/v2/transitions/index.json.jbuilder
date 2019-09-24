json.data do
  json.array! @transitions do |transition|
    json.partial! 'api/v2/transitions/transition', transition: transition
  end
end