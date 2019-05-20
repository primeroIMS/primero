module SearchFilters
  class ValueList < SearchFilter
    attr_accessor :field_name, :values

    def query_scope(sunspot)
      this = self
      sunspot.instance_eval do
        with(this.field_name).any_of(this.values)
      end
    end

    def to_h
      {
          type: 'values',
          field_name: self.field_name,
          value: self.values
      }
    end

  end
end