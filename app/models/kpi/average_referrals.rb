# frozen_string_literal: true

# AverageReferrals
# A Kpi that counts the average number of referrals made for each case.
class Kpi::AverageReferrals < Kpi::Search
  REFERRED = 'referred'

  def action_plan_referral_statuses
    @action_plan_referral_statuses ||= SolrUtils.indexed_field_name(Child, :action_plan_referral_statuses)
  end

  def search
    Child.search do
      with :created_at, from..to
      with :owned_by_groups, owned_by_groups
      with :owned_by_agency_id, owned_by_agency_id

      adjust_solr_params do |params|
        params[:stats] = true
        params[:'stats.field'] = "{!func}termfreq(#{action_plan_referral_statuses}, #{REFERRED})"
      end
    end
  end

  def to_json(*_args)
    {
      data: {
        average_referrals: handle_solr_stats_value(search.stats_response.first.last['mean'])
      }
    }
  end

  def handle_solr_stats_value(value)
    if value == 'NaN' || value.nil?
      0.0
    else
      value
    end
  end
end
