module SyncableMobile
  extend ActiveSupport::Concern

  included do
  end

  module ClassMethods
    def is_syncable_with_mobile?
      FormSection.find_mobile_forms.all.map {|f| f.parent_form}.uniq.include?(parent_form)
    end
  end

  #TODO - decide if this should be here or in a controller
  def mark_for_mobile
    if self.marked_for_mobile.present?
      self.marked_for_mobile = true
      self.save!
    end
  end

  def unmark_for_mobile
    if self.marked_for_mobile.present?
      self.marked_for_mobile = false
      self.save!
    end
  end
end
