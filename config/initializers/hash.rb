class Hash
  def compact_deep
    map do |key, value|
      value = if value.nil?
                nil
              elsif value.is_a? Hash
                value.compact_deep
              else
                value
              end
      [key, value]
    end.to_h.compact
  end
end