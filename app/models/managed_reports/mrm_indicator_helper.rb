# frozen_string_literal: true

# Helper methods for mrm indicators
module ManagedReports::MRMIndicatorHelper
  extend ActiveSupport::Concern
  # ClassMethods
  module ClassMethods
    def filter_date(params)
      params['incident_date'] || params['date_of_first_report'] || params['ctfmr_verified_date']
    end

    def table_name_for_query(params)
      return 'violations' if params['ctfmr_verified_date'].present?

      'incidents'
    end

    def build_results(results)
      results.group_by { |r| r['group_id'] }.map do |key, values|
        {
          group_id: key,
          data: build_data_values(values)
        }
      end
    end

    def build_data_values(values)
      values.each_with_object([]) do |curr, acc|
        current_group = acc.find { |group| group[:id] == curr['name'] }
        next current_group[curr['key'].to_sym] = curr['sum'] if current_group.present?

        acc << { id: curr['name'], curr['key'].to_sym => curr['sum'] }
      end
    end
  end
end
