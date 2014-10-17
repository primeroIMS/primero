def xpath_text_string value
  quote_split = value.split('"')
  if quote_split.length > 1
    # This is literally the best way to do this when you could have mixed
    # single and double quotes
    %Q[concat(#{quote_split.map {|s| "\"#{s}\"" }.join(", '\"', ")})]
  else
    %Q["#{value}"]
  end
end
