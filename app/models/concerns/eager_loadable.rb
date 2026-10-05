# frozen_string_literal: true

# A shared concern for all Records that can be eagerloaded
module EagerLoadable
  extend ActiveSupport::Concern

  included do
    class_attribute :additional_eager_loaded_classes, default: [], instance_accessor: false
  end

  # ClassMethods
  module ClassMethods
    def eager_load_associations(*relationships)
      self.additional_eager_loaded_classes += relationships.flatten
    end

    def eager_loaded_class
      associations_to_load = [:alerts, :active_flags, { attachments: { file_attachment: :blob },
                                                        signatures: { file_attachment: :blob },
                                                        current_photos: { file_attachment: :blob } }]

      includes(associations_to_load + additional_eager_loaded_classes)
    end
  end
end
