module KPI
  # CompletedSupervisorApprovedCaseActionPlans Search
  #
  # For cases created within a given range of months, looks at how many
  # cases have their action plan completed. Completion is defined in
  # app/models/concerns/gbv_key_performance_indicators.rb.
  class CompletedSupervisorApprovedCaseActionPlans < KPI::Search
    def completed_action_plan
      @completed_action_plan ||= SolrUtils.indexed_field_name(Child, :completed_action_plan)
    end

    def case_plan_approved
      @case_plan_approved ||= SolrUtils.indexed_field_name(Child, :case_plan_approved)
    end

    def search
      Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        # This seems like an obtuse way to use an in a facet query
        adjust_solr_params do |params|
          params[:facet] = true
          params[:'facet.query'] =
            "{! key=completed_and_approved } #{completed_action_plan}:true AND #{case_plan_approved}:true"
        end
      end
    end
  end
end
