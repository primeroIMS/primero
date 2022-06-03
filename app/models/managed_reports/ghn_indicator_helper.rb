# frozen_string_literal: true

# Helper methods for ghn indicators
module ManagedReports::GhnIndicatorHelper
  extend ActiveSupport::Concern

  include ManagedReports::MRMIndicatorHelper

  # ClassMethods
  module ClassMethods
    def date_filter
      'incident_date'
    end

    def date_filter_param(filter)
      filter.field_name = date_filter
      filter
    end

    def groups
      %w[boys girls unknown total].map { |group| [group, []] }.to_h
    end

    def build_groups(results, _params = {})
      groups.merge(results.group_by { |group| group['name'] }).map do |group|
        {
          group_id: group[0],
          data: build_data_values(group[1])
        }
      end
    end

    def build_data_values(values)
      values.each_with_object([]) do |curr, acc|
        current_group = acc.find { |group| group[:id] == curr['name'] }
        next current_group[curr['key'].to_sym] = curr['sum'] if current_group.present?

        acc << { id: curr['group_id'], curr['key'].to_sym => curr['sum'] }
      end
    end
  end
end
