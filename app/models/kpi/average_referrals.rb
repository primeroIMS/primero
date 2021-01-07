# frozen_string_literal: true
#
module KPI
  class AverageReferrals < Search
    REFERRED = 'Referred'

    def action_plan_referral_statuses
      @action_plan_referral_statuses ||= SolrUtils.indexed_field_name(Child, :action_plan_referral_statuses)
    end

    def search
      search = Child.search do
        with :created_at, from..to
        with :owned_by_groups, owned_by_groups
        with :owned_by_agency_id, owned_by_agency_id

        adjust_solr_params do |params|
          params[:stats] = true
          params[:'stats.field'] = "{!func}termfreq(#{action_plan_referral_statuses}, #{REFERRED})"
        end
      end
    end

    def to_json
      { data: { average_referrals: search.stats_response.first.last['mean'] } }
    end
  end
end
