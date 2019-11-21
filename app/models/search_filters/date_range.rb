module SearchFilters
  class DateRange < SearchFilter
    attr_accessor :field_name, :from, :to

    def query_scope(sunspot)
      this = self
      sunspot.instance_eval do
        if this.to.blank?
          with(this.field_name).greater_than_or_equal_to(this.from)
        else
          with(this.field_name).between(this.from..this.to)
        end
      end
    end

    def to_h
      {
        type: 'date_range',
        field_name: field_name,
        value: {
          from: from,
          to: to
        }
      }
    end

    def to_s
      "#{field_name}=#{from&.iso8601}..#{to&.iso8601}"
    end

  end
end