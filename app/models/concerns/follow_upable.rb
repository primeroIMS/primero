# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for note creation on records
module FollowUpable
  extend ActiveSupport::Concern

  FOLLOW_UPS_NOT_PLANNED = 'follow_ups_not_planned'
  FOLLOW_UPS_PLANNED = 'follow_ups_planned'
  FOLLOW_UPS_IMPLEMENTED = 'follow_ups_implemented'

  included do
    store_accessor :data, :followup_status

    before_save :save_followup_status

    def save_followup_status
      self.followup_status = if all_followup_implemented?
                               FOLLOW_UPS_IMPLEMENTED
                             elsif any_follow_ups_planned?
                               FOLLOW_UPS_PLANNED
                             else
                               FOLLOW_UPS_NOT_PLANNED
                             end
    end

    private

    def all_followup_implemented?
      followup_subform_section&.all? { |fs| fs['followup_date'].present? }
    end

    def any_follow_ups_planned?
      followup_subform_section&.any? { |fs| fs['followup_needed_by_date'].present? }
    end
  end
end
