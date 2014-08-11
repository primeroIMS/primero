class Hash  
  def compact
    delete_if{|k, v| v.blank? || (v.is_a?(Hash) && v.compact.blank?)}
  end
end