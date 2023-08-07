# frozen_string_literal: true

# An indicator that returns the total of transfers by user groups
class ManagedReports::Indicators::TotalTransfersByUserGroups < ManagedReports::SqlReportIndicator
  include ManagedReports::WeekIndicatorHelper

  class << self
    def id
      'total_transfers_by_user_groups'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
          with transfers as (
            select
              unnest(record_owned_by_groups) as name,
              transitions_to.key,
              #{grouped_date_query(params['grouped_by'], filter_date(params), 'cases')&.concat(' as group_id,')}
              count(*) as sum
            from transitions
            inner join (
              select
                transitions.id,
                unnest(transitioned_to_user_groups) as key
              from transitions
              where type = 'Transfer'
              and remote = false
            ) as transitions_to
            on transitions_to.id = transitions.id
            inner join cases on transitions.record_id = cases.id::varchar and transitions.record_type = 'Child'
            where type = 'Transfer'
            and remote = false
            #{in_value_query(params['referral_transfer_status'], 'transitions', nil, 'status')&.prepend('and ')}
            #{equal_value_query_multiple(params['owned_by_groups'], 'cases')&.prepend('and ')}
            #{equal_value_query_multiple(params['created_by_groups'], 'cases')&.prepend('and ')}
            #{equal_value_query_multiple(params['owned_by_agency_id'], 'cases')&.prepend('and ')}
            #{equal_value_query_multiple(params['created_organization'], 'cases')&.prepend('and ')}
            #{equal_value_query_multiple(params['status'], 'cases')&.prepend('and ')}
            #{date_range_query(date_param, 'cases')&.prepend('and ')}
            #{equal_value_query(params['module_id'], 'cases')&.prepend('and ')}
            #{user_scope_query(current_user, 'cases')&.prepend('and ')}
            group by name, key
              #{grouped_date_query(params['grouped_by'], date_param, 'cases')&.prepend(', ')}
            order by name, key
          )
          select name, key, sum #{params['grouped_by'].present? ? ', group_id' : ''}
          from transfers
          union all
          select
            name,
            'total' as key,
            cast(sum(sum) as integer) as sum
            #{params['grouped_by'].present? ? ', group_id' : ''}
          from transfers
          group by name #{params['grouped_by'].present? ? ', group_id' : ''}
          union all
          select
           'total' as name,
            key,
            cast(sum(sum) as integer) as sum
            #{params['grouped_by'].present? ? ', group_id' : ''}
          from transfers
          group by key #{params['grouped_by'].present? ? ', group_id' : ''}
          union all
          select
           'total' as name,
           'total' as key,
           cast(sum(sum) as integer) as sum
           #{params['grouped_by'].present? ? ', group_id' : ''}
          from transfers
          #{params['grouped_by'].present? ? 'group by group_id' : ''}
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
