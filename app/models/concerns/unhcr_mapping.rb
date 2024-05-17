# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for UNHCR Mapping
module UNHCRMapping
  extend ActiveSupport::Concern

  included do
    # TODO: Leaving unhcr_export_opt_out until we fix or discard the UNHCR export.
    store_accessor :data,
                   :unhcr_needs_codes, :unhcr_export_opt_out, :unhcr_export_opt_in

    before_save :map_protection_concerns_to_unhcr_codes

    searchable do
      boolean :unhcr_export_opt_in
    end
  end

  def map_protection_concerns_to_unhcr_codes
    return unless is_a?(Child)

    @system_settings ||= SystemSettings.current
    unhcr_mapping = @system_settings.unhcr_needs_codes_mapping if @system_settings.present?
    return if unhcr_mapping.blank?

    self.unhcr_needs_codes = map_codes(unhcr_mapping)
  end

  def map_codes(unhcr_mapping)
    return unless unhcr_mapping.autocalculate == true && protection_concerns.present?

    protection_concerns.map { |concern| unhcr_mapping&.mapping.try(:[], concern) }.compact.uniq
  end
end
