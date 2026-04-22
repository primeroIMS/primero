# frozen_string_literal: true

# CompletedSupervisorApprovedCaseActionPlans Search
#
# For cases created within a given range of months, looks at how many
# cases have their action plan completed. Completion is defined in
# app/models/concerns/gbv_key_performance_indicators.rb.
class Kpi::CompletedSupervisorApprovedCaseActionPlans < Kpi::Search
  def completed_and_approved_action_plan
    @completed_and_approved_action_plan ||= SolrUtils.indexed_field_name(Child, :completed_and_approved_action_plan)
  end

  def search
    Child.search do
      with :status, Record::STATUS_OPEN
      with :created_at, from..to
      with :owned_by_groups, owned_by_groups
      with :owned_by_agency_id, owned_by_agency_id

      adjust_solr_params do |params|
        params[:facet] = true
        params[:'facet.query'] = "{! key=completed_and_approved } #{completed_and_approved_action_plan}:true"
      end
    end
  end

  def to_json(*_args)
    {
      data: {
        completed_and_approved: nan_safe_divide(
          search.facet_response['facet_queries']['completed_and_approved'],
          search.total
        )
      }
    }
  end
end
