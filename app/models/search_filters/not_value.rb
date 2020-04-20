# frozen_string_literal: true

module SearchFilters
  # A SearchFilters class for the Not operator
  class NotValue < SearchFilter
    attr_accessor :field_name, :values

    def query_scope(sunspot)
      this = self
      sunspot.instance_eval do
        without(this.field_name, this.values)
      end
    end

    def to_h
      {
        type: 'not',
        field_name: field_name,
        value: values
      }
    end

    def to_s
      "not[#{field_name}]=#{values&.join(',')}"
    end
  end
end
