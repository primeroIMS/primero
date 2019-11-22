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
        field_name: field_name,
        value: value
      }
    end

    def to_s
      "#{field_name}=#{value}"
    end

  end
end