# frozen_string_literal: true

# Concern for note creation on records
module Followable
  extend ActiveSupport::Concern

  FOLLOW_UPS_NOT_PLANNED = 'follow_ups_not_planned'
  FOLLOW_UPS_PLANNED = 'follow_ups_planned'
  FOLLOW_UPS_IMPLEMENTED = 'follow_ups_implemented'

  included do
    store_accessor :data, :followup_status

    before_save :save_followup_status

    def save_followup_status
      if followup_subform_section.blank?
        self.followup_status = FOLLOW_UPS_NOT_PLANNED
      elsif all_followup_implemented?
        self.followup_status = FOLLOW_UPS_IMPLEMENTED
      elsif any_follow_ups_planned?
        self.followup_status = FOLLOW_UPS_PLANNED
      end
    end

    private

    def all_followup_implemented?
      followup_subform_section.all? { |fs| fs['followup_date'].present? }
    end

    def any_follow_ups_planned?
      followup_subform_section.any? { |fs| fs['followup_needed_by_date'].present? }
    end
  end
end
