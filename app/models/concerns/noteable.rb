# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Concern for note creation on records
module Noteable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :notes_section

    before_save :save_notes

    def save_notes
      return unless changes_to_save_for_record.try(:[], 'notes_section')

      notes_section.each do |note|
        unless note['note_created_by'].present? && note['note_date'].present?
          note['note_date'] = DateTime.now
          note['note_created_by'] = last_updated_by
        end
      end
    end
  end
end
