# frozen_string_literal: true

module Kpi
  SearchValue = Struct.new(:from, :to, :owned_by_groups, :owned_by_agency_id)

  # Search
  #
  # An abstract class for search objects to subclass.
  class Search < SearchValue
    def self.find(id)
      Object.const_get("Kpi::#{id.camelize}")
    end

    def self.search_model(model = nil)
      @search_model ||= model
    end

    def search_model
      self.class.search_model
    end

    def to_json(*_args)
      raise NotImplementedError
    end

    private

    # This handles cases where 0% of something exists as in normal
    # ruby floating point math that is 0 / total which is Float::NaN
    # where we are looking for 0.
    def nan_safe_divide(numerator, denominator)
      return 0 if numerator.zero?

      numerator / denominator.to_f
    end
  end
end
