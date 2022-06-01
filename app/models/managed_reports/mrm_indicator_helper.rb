# frozen_string_literal: true

# Helper methods for mrm indicators
module ManagedReports::MRMIndicatorHelper
  extend ActiveSupport::Concern
  # ClassMethods
  module ClassMethods
    def table_name_for_query(params)
      return 'violations' if params['ctfmr_verified_date'].present?

      'incidents'
    end

    def group_id_alias(params_grouped_by)
      return unless params_grouped_by.present?

      'group_id'
    end

    def build_results(results, params = {})
      return build_data_values(results.to_a) unless results.to_a.any? { |result| result['group_id'].present? }

      build_groups(results, params)
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
