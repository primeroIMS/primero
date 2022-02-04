# frozen_string_literal: true

# An indicator that returns the total of incidents grouped by the perpetrator_age_group
class ManagedReports::Indicators::PerpetratorAgeGroup < ManagedReports::SqlReportIndicator
  class << self
    def id
      'perpetrator_age_group'
    end

    # rubocop:disable Metrics/MethodLength
    def sql(params = [])
      %{
        select
          age_group_id,
          count(*) as total
        from (
          select
            jsonb_array_elements_text(data #> '{perpetrator_age_group}') as age_group_id,
            id as record_id
          from incidents
          where data ->>'perpetrator_age_group' is not null
          #{filter_query(params)}
          group by record_id, age_group_id
        ) as age_group_by_record
        group by age_group_id
      }
    end
    # rubocop:enable Metrics/MethodLength

    def build(args = {})
      super(args) do |results|
        results.map { |result| { 'id' => result['age_group_id'], 'total' => result['total'] } }
      end
    end
  end
end
