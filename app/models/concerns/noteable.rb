# frozen_string_literal: true

# Concern for note creation on records
module Noteable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :notes_section

    before_save :save_notes
    before_save :scrub_pii
  end

  def save_notes
    return unless changes_to_save_for_record.try(:[], 'notes_section')

    notes_section.each do |note|
      unless note['note_created_by'].present? && note['note_date'].present?
        note['note_date'] = DateTime.now
        note['note_created_by'] = last_updated_by
      end
    end
  end

  def scrub_pii
    return unless Rails.application.config.x.pii_analysis_enabled
    return unless changes_to_save_for_record.try(:[], 'notes_section')

    pii_service = PiiService.new
    notes_section.each do |note|
      # TODO: This will perpetually scrub all notes an may get inefficient as more notes accumulate.
      # Look for changes in notes: compare hashed before and after values
      # in changes_to_save_for_record.try(:[], 'notes_section')
      # This will be a general problem for nested subforms
      note['note_text'] = pii_service.scrub(note['note_text'])
    end
  end

  private

  def changed_note_ids
    previous = changes_to_save_for_record.try(:[], 'notes_section')[0]
    current = changes_to_save_for_record.try(:[], 'notes_section')[1]
    current.map { |n| n['unique_id'] } - previous.map { |n| n['unique_id'] }
  end
end
