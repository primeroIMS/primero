class Flag < ApplicationRecord
  include Indexable

  EVENT_FLAG = 'flag' ; EVENT_UNFLAG = 'unflag'

  belongs_to :record, polymorphic: true

  validates :message, presence: { message: 'errors.models.flags.message' }
  validates :date, presence: { message: 'errors.models.flags.date' }

  after_create :flag_history
  after_update :unflag_history

  searchable do
    date :flag_date, :stored => true do
      self.date.present? ? self.date : nil
    end
    time :flag_created_at, :stored => true do
      self.created_at.present? ? self.created_at : nil
    end
    string :flag_message, :stored => true do
      self.message
    end
    string :flag_unflag_message, :stored => true do
      self.unflag_message
    end
    string :flag_flagged_by, :stored => true do
      self.flagged_by
    end
    string :flag_flagged_by_module, :stored => true do
      record.module_id
    end
    boolean :flag_is_removed, :stored => true do
      self.removed ? true : false
    end
    boolean :flag_system_generated_followup, :stored => true do
      self.system_generated_followup
    end
    string :flag_record_id, :stored => true do
      self.record_id
    end
    string :flag_record_type, :stored => true do
      self.record_type.underscore.downcase
    end
    string :flag_record_short_id, :stored => true do
      record.short_id
    end
    string :flag_child_name, :stored => true do
      record.try(:name)
    end
    string :flag_hidden_name, :stored => true do
      record.try(:hidden_name)
    end
    string :flag_module_id, :stored => true do
      record.module_id
    end
    string :flag_incident_date_of_first_report, :stored => true do
      record.try(:date_of_first_report)
    end
    string :flag_record_owner, :stored => true do
      record.owned_by
    end
    string :flag_groups_owner, :stored => true, :multiple => true do
      record.owned_by_groups
    end
    string :flag_associated_groups, :stored => true, :multiple => true do
      record.associated_user_groups
    end
    string :flag_agency_id_owner, :stored => true, :multiple => true do
      record.owned_by_agency_id
    end
    string :flag_associated_agencies, :stored => true, :multiple => true do
      record.associated_user_agencies
    end
  end

  def flag_history
    update_flag_history(EVENT_FLAG, self.flagged_by)
  end

  def unflag_history
    if self.saved_change_to_attribute('removed')[1]
      changes = self.saved_changes.map{|k,v| [k,v[1]]}.to_h
      update_flag_history(EVENT_UNFLAG, self.unflagged_by)
    end
  end

  private

  def update_flag_history(event, user_name)
    RecordHistory.create(
        record_id: self.record_id,
        record_type: self.record_type,
        user_name: user_name,
        datetime: DateTime.now,
        action: event,
        record_changes: {flags: {from: nil, to: self}}
    )
  end

end
