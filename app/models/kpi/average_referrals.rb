module KPI
  class AverageReferrals < Search
    REFERRED = 'Referred'.freeze

    def action_plan_referral_statuses
      @action_plan_referral_statuses ||= SolrUtils.indexed_field_name(Child, :action_plan_referral_statuses)
    end

    def referred
      'Referred'
    end

    def search
      search = Child.search do
        with :created_at, from..to

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
