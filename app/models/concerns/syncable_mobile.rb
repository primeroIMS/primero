module SyncableMobile
  extend ActiveSupport::Concern

  included do
  end

  module ClassMethods
    def is_syncable_with_mobile?
      FormSection.find_mobile_forms.all.map {|f| f.parent_form}.uniq.include?(parent_form)
    end
  end
end
