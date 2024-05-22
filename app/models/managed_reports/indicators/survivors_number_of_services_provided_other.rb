# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the survivors by number of services provided
class ManagedReports::Indicators::SurvivorsNumberOfServicesProvidedOther < ManagedReports::SqlReportIndicator
  OTHER_REFERRALS = "'internal_referral', 'external_referral', 'referred'"
  class << self
    def id
      'number_of_services_provided_other'
    end

    # rubocop:disable Metrics/MethodLength
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/PerceivedComplexity
    def sql(current_user, params = {})
      date_param = filter_date(params)
      %{
        select
          *
        from (
          select
            'service_safehouse_referral' as id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
            count(*) as total
          from
            incidents
          where data ->> 'service_safehouse_referral' in (#{OTHER_REFERRALS})
          #{date_range_query(date_param)&.prepend('and ')}
          #{equal_value_query(params['module_id'])&.prepend('and ')}
          #{user_scope_query(current_user)&.prepend('and ')}
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
          union
          select
            'service_medical_referral' as id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
            count(health_medical_referral_subform_section.*) as total
          from
            incidents,
            jsonb_to_recordset(
              data #> '{health_medical_referral_subform_section}'
            ) as health_medical_referral_subform_section (
              unique_id text,
              service_medical_referral text
            )
          where service_medical_referral in (#{OTHER_REFERRALS})
          #{date_range_query(date_param)&.prepend('and ')}
          #{equal_value_query(params['module_id'])&.prepend('and ')}
          #{user_scope_query(current_user)&.prepend('and ')}
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
          union
          select
            'service_psycho_referral' as id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
            count(psychosocial_counseling_services_subform_section.*) as total
          from
            incidents,
            jsonb_to_recordset(
              data #> '{psychosocial_counseling_services_subform_section}'
            ) as psychosocial_counseling_services_subform_section (
              unique_id text,
              service_psycho_referral text
            )
          where service_psycho_referral in (#{OTHER_REFERRALS})
          #{date_range_query(date_param)&.prepend('and ')}
          #{equal_value_query(params['module_id'])&.prepend('and ')}
          #{user_scope_query(current_user)&.prepend('and ')}
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
          union
          select
            'service_legal_referral' as id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
            count(legal_assistance_services_subform_section.*) as total
          from
            incidents,
            jsonb_to_recordset(
              data #> '{legal_assistance_services_subform_section}'
            ) as legal_assistance_services_subform_section (
              unique_id text,
              service_legal_referral text
            )
          where service_legal_referral in (#{OTHER_REFERRALS})
          #{date_range_query(date_param)&.prepend('and ')}
          #{equal_value_query(params['module_id'])&.prepend('and ')}
          #{user_scope_query(current_user)&.prepend('and ')}
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
          union
          select
          'service_police_referral' as id,
          #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
          count(police_or_other_type_of_security_services_subform_section.*) as total
          from
            incidents,
            jsonb_to_recordset(
              data #> '{police_or_other_type_of_security_services_subform_section}'
            ) as police_or_other_type_of_security_services_subform_section (
              unique_id text,
              service_police_referral text
            )
          where service_police_referral in (#{OTHER_REFERRALS})
          #{date_range_query(date_param)&.prepend('and ')}
          #{equal_value_query(params['module_id'])&.prepend('and ')}
          #{user_scope_query(current_user)&.prepend('and ')}
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
          union
          select
            'service_livelihoods_referral' as id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
            count(livelihoods_services_subform_section.*) as total
          from
            incidents,
            jsonb_to_recordset(
              data #> '{livelihoods_services_subform_section}'
            ) as livelihoods_services_subform_section (
              unique_id text,
              service_livelihoods_referral text
            )
          where service_livelihoods_referral in (#{OTHER_REFERRALS})
          #{date_range_query(date_param)&.prepend('and ')}
          #{equal_value_query(params['module_id'])&.prepend('and ')}
          #{user_scope_query(current_user)&.prepend('and ')}
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
          union
          select
            'service_protection_referral' as id,
            #{grouped_date_query(params['grouped_by'], date_param)&.concat(' as group_id,')}
            count(child_protection_services_subform_section.*) as total
          from
            incidents,
            jsonb_to_recordset(
              data #> '{child_protection_services_subform_section}'
            ) as child_protection_services_subform_section (
              unique_id text,
              service_protection_referral text
            )
          where service_protection_referral in (#{OTHER_REFERRALS})
          #{date_range_query(date_param)&.prepend('and ')}
          #{equal_value_query(params['module_id'])&.prepend('and ')}
          #{user_scope_query(current_user)&.prepend('and ')}
          #{grouped_date_query(params['grouped_by'], date_param)&.prepend('group by ')}
        ) as referrals
        order by id
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
