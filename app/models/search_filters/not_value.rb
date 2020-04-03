# frozen_string_literal: true

module SearchFilters
  class NotValue < SearchFilter
    attr_accessor :field_name, :value

    def query_scope(sunspot)
      this = self
      sunspot.instance_eval do
        without(this.field_name, this.value)
      end
    end

    def to_h
      {
        type: 'not_value',
        field_name: field_name,
        value: value
      }
    end

    def to_s
      "not[#{field_name}]=#{value}"
    end
  end
end
