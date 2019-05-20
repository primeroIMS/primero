module SearchFilters
  class Value < SearchFilter
    attr_accessor :field_name, :value

    def query_scope(sunspot)
      this = self
      sunspot.instance_eval do
        with(this.field_name, this.value)
      end
    end

    def to_h
      {
          type: 'value',
          field_name: self.field_name,
          value: self.value
      }
    end

  end
end