module SearchFilters
  class SearchFilter < ValueObject
    def to_json
      to_h.to_json
    end
  end
end