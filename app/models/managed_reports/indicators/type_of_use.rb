# frozen_string_literal: true

# An indicator that returns the type of use of violation type Recruitment
class ManagedReports::Indicators::TypeOfUse < ManagedReports::SqlReportIndicator
  class << self
    def id
      'type_of_use'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    def sql(current_user, params = {})
      %{
        select name, key, sum(value::integer)
        from (
        select
          key, value, violations.id,
          violations."data"->>'child_role' as name
        from violations violations
        inner join incidents incidents
          on incidents.id = violations.incident_id
          #{user_scope_query(current_user, 'incidents')&.prepend('and ')}
        cross join json_each_text((violations."data"->>'violation_tally')::JSON)
        where violations.data->>'violation_tally' is not null
        and violations."data"->>'child_role' is not null
        #{date_range_query(params['incident_date'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['date_of_first_report'], 'incidents')&.prepend('and ')}
        #{date_range_query(params['ctfmr_verified_date'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['ctfmr_verified'], 'violations')&.prepend('and ')}
        #{equal_value_query(params['type'], 'violations')&.prepend('and ')}
        ) keys_values
        group by key, name
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity

    def build(current_user = nil, args = {})
      super(current_user, args) do |result|
        result.group_by { |r| r['name'] }.map do |_key, values|
          values.each_with_object({}) do |curr, acc|
            acc[:id] = curr['name']
            acc[curr['key'].to_sym] = curr['sum']
          end
        end
      end
    end
  end
end
