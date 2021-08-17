# frozen_string_literal: true

# Module for capturing all of the GBV Kpi related logic for the Child model
module Kpi::GBVChild
  extend ActiveSupport::Concern

  included do
    searchable do
      %i[completed_survivor_assessment safety_plan_required completed_safety_plan completed_action_plan
         completed_and_approved_action_plan duplicate].each { |f| boolean(f) }
      %i[services_provided action_plan_referral_statuses].each { |f| string(f, multiple: true) }
      %i[safety_goals_progress health_goals_progress psychosocial_goals_progress justice_goals_progress
         other_goals_progress].each { |f| float(f) }
      string :satisfaction_status
      integer :case_lifetime_days
    end
  end

  delegate :completed_survivor_assessment, :safety_plan_required, :completed_safety_plan,
           :completed_action_plan, :services_provided, :action_plan_referral_statuses, :safety_goals_progress,
           :health_goals_progress, :psychosocial_goals_progress, :justice_goals_progress, :other_goals_progress,
           :satisfaction_status, :completed_and_approved_action_plan, :case_lifetime_days, to: :kpis, allow_nil: true

  private

  def kpis
    @kpis ||= GBVKpiCalculationService.from_record(self)
  end
end
