module SearchFilters
  class ValueList < SearchFilter
    attr_accessor :field_name, :values

    def query_scope(sunspot)
      this = self
      sunspot.instance_eval do
        if this.values.first.is_a?(Hash)
          any_of do
            this.values.each do |v|
              with(this.field_name, v['from']...v['to'])
            end
          end
        else
          with(this.field_name).any_of(this.values)
        end
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