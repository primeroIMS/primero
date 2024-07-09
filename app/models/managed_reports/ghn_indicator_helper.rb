# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Helper methods for ghn indicators
module ManagedReports::GhnIndicatorHelper
  extend ActiveSupport::Concern

  # ClassMethods
  module ClassMethods
    def date_filter
      'ctfmr_verified_date'
    end

    def date_filter_param(filter)
      filter.field_name = date_filter if filter.present?
      filter
    end

    def groups
      %w[boys girls unknown total].to_h { |group| [group, []] }
    end

    def build_groups(results, _params = {})
      groups.merge(results.group_by { |group| group['name'] }).map do |group|
        { group_id: group[0], data: build_data_values(group[1]) }
      end
    end

    def value_to_data_element(value)
      element = { id: value['group_id'], value['key'].to_sym => value['sum'] }
      return element unless value.key?('total')

      element.merge(total: value['total'])
    end
  end
end
