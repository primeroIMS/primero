module Noteable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :notes_section

    before_save :save_notes

    def save_notes
      if self.changes_to_save_for_record.try(:[], "notes_section")
        self.notes_section.each do |note|
          unless note['note_created_by'].present? && note['note_date'].present?
            note['note_date'] = DateTime.now
            note['note_created_by'] = self.last_updated_by
          end
        end
      end
    end
  end
end
