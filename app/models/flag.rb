class Flag < ActiveRecord::Base
  include Sunspot::Rails::Searchable

  belongs_to :record, polymorphic: true

  validates :message, presence: { message: 'errors.models.flags.message' }
  validates :date, presence: { message: 'errors.models.flags.date' }

  searchable auto_index: self.auto_index? do
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
      record.name
    end
    string :flag_hidden_name, :stored => true do
      record.hidden_name
    end
    string :flag_module_id, :stored => true do
      record.module_id
    end
    string :flag_incident_date_of_first_report, :stored => true do
      record.date_of_first_report
    end
    string :flag_record_owner, :stored => true do
      record.owned_by
    end
  end

  def self.auto_index?
    Rails.env != 'production'
  end

end
