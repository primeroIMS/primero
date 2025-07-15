# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# An indicator that returns the survivors by number of services provided
class ManagedReports::Indicators::SurvivorsNumberOfServicesProvidedOther < ManagedReports::SqlReportIndicator
  OTHER_REFERRALS = "'internal_referral', 'external_referral', 'referred'"
  OTHER_REFERRALS_PATH = '(@ == "internal_referral" || @ == "external_referral" || @ == "referred")'
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
      grouped_by_date = grouped_date_query(params['grouped_by'], date_param)
      %{
        WITH filtered_incidents AS (
          SELECT
            *
          FROM incidents
          WHERE data @? '$[*] ? (@.consent_reporting == "true")'
          #{date_range_query(date_param)&.prepend('AND ')}
          #{equal_value_query(params['module_id'])&.prepend('AND ')}
          #{user_scope_query(current_user)&.prepend('AND ')}
        )
        SELECT
          *
        FROM (
          SELECT
            'service_safehouse_referral' AS id,
            #{grouped_by_date&.dup&.concat(' AS group_id,')}
            COUNT(*) AS total
          FROM filtered_incidents
          WHERE data @? '$.service_safehouse_referral ? (#{OTHER_REFERRALS_PATH})'
          #{grouped_by_date&.dup&.prepend('GROUP BY ')}
          UNION
          SELECT
            'service_medical_referral' AS id,
            #{grouped_by_date&.dup&.concat(' AS group_id,')}
            COUNT(health_medical_referral_subform_section.*) AS total
          FROM filtered_incidents
          CROSS JOIN LATERAL (
            SELECT 1 FROM JSONB_ARRAY_ELEMENTS(data->'health_medical_referral_subform_section') AS subform_section
            WHERE subform_section->'service_medical_referral' ?| ARRAY[#{OTHER_REFERRALS}]
          ) AS health_medical_referral_subform_section
          WHERE data @? '$.health_medical_referral_subform_section[*].service_medical_referral  ? (
            #{OTHER_REFERRALS_PATH}
          )'
          #{grouped_by_date&.dup&.prepend('GROUP BY ')}
          UNION
          SELECT
            'service_psycho_referral' AS id,
            #{grouped_by_date&.dup&.concat(' AS group_id,')}
            COUNT(psychosocial_counseling_services_subform_section.*) AS total
          FROM filtered_incidents
          CROSS JOIN LATERAL (
            SELECT 1 FROM JSONB_ARRAY_ELEMENTS(
              data->'psychosocial_counseling_services_subform_section'
            ) AS subform_section
            WHERE subform_section->'service_psycho_referral' ?| ARRAY[#{OTHER_REFERRALS}]
          ) AS psychosocial_counseling_services_subform_section
          WHERE data @? '$.psychosocial_counseling_services_subform_section[*].service_psycho_referral ? (
            #{OTHER_REFERRALS_PATH}
          )'
          #{grouped_by_date&.dup&.prepend('GROUP BY ')}
          UNION
          SELECT
            'service_legal_referral' AS id,
            #{grouped_by_date&.dup&.concat(' AS group_id,')}
            COUNT(legal_assistance_services_subform_section.*) AS total
          FROM filtered_incidents
          CROSS JOIN LATERAL (
            SELECT 1 FROM JSONB_ARRAY_ELEMENTS(data->'legal_assistance_services_subform_section') as subform_section
            WHERE subform_section->'service_legal_referral' ?| ARRAY[#{OTHER_REFERRALS}]
          ) AS legal_assistance_services_subform_section
          WHERE data @? '$.legal_assistance_services_subform_section[*].service_legal_referral ? (
            #{OTHER_REFERRALS_PATH}
          )'
          #{grouped_by_date&.dup&.prepend('GROUP BY ')}
          UNION
          SELECT
            'service_police_referral' as id,
            #{grouped_by_date&.dup&.concat(' AS group_id,')}
            COUNT(police_or_other_type_of_security_services_subform_section.*) AS total
          FROM filtered_incidents
          CROSS JOIN LATERAL (
            SELECT 1 FROM JSONB_ARRAY_ELEMENTS(
              data->'police_or_other_type_of_security_services_subform_section'
            ) AS subform_section
            WHERE subform_section->'service_police_referral' ?| ARRAY[#{OTHER_REFERRALS}]
          ) AS police_or_other_type_of_security_services_subform_section
          WHERE data @? '$.police_or_other_type_of_security_services_subform_section[*].service_police_referral ? (
            #{OTHER_REFERRALS_PATH}
          )'
          #{grouped_by_date&.dup&.prepend('GROUP BY ')}
          UNION
          SELECT
            'service_livelihoods_referral' AS id,
            #{grouped_by_date&.dup&.concat(' AS group_id,')}
            COUNT(livelihoods_services_subform_section.*) AS total
          FROM filtered_incidents
          CROSS JOIN LATERAL (
            SELECT 1 FROM JSONB_ARRAY_ELEMENTS(data->'livelihoods_services_subform_section') AS subform_section
            WHERE subform_section->'service_livelihoods_referral' ?| ARRAY[#{OTHER_REFERRALS}]
          ) AS livelihoods_services_subform_section
          WHERE data @? '$.livelihoods_services_subform_section[*].service_livelihoods_referral ? (
            #{OTHER_REFERRALS_PATH}
          )'
          #{grouped_by_date&.dup&.prepend('GROUP BY ')}
          UNION
          SELECT
            'service_protection_referral' AS id,
            #{grouped_by_date&.dup&.concat(' AS group_id,')}
            COUNT(child_protection_services_subform_section.*) AS total
          FROM filtered_incidents
          CROSS JOIN LATERAL (
            SELECT 1 FROM JSONB_ARRAY_ELEMENTS(data->'child_protection_services_subform_section') AS subform_section
            WHERE subform_section->'service_protection_referral' ?| ARRAY[#{OTHER_REFERRALS}]
          ) AS child_protection_services_subform_section
          WHERE data @? '$.child_protection_services_subform_section[*].service_protection_referral ? (
            #{OTHER_REFERRALS_PATH}
          )'
          #{grouped_by_date&.dup&.prepend('GROUP BY ')}
        ) AS services
        ORDER BY id
      }
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/PerceivedComplexity
  end
end
