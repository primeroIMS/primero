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
        field_name: field_name,
        value: values
      }
    end

    def to_s
      "#{field_name}=#{values&.join(',')}"
    end

  end
end