# frozen_string_literal: true

module SearchFilters
  class NotValue < SearchFilter
    attr_accessor :filters

    def query_scope(sunspot)
      this = self
      sunspot.instance_eval do
        any_of do
          this.filters.each do |filter|
            without(filter.field_name, filter.value)
          end
        end
      end
    end

    def to_h
      filters_hash = filters&.map(&:to_h) || []
      {
        type: 'not',
        filters: filters_hash
      }
    end

    def to_s
      filters.map do |filter|
        key, value = filter.to_s.split('=')
        "not[#{key}]=#{value}"
      end
    end
  end
end
