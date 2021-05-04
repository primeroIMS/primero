# frozen_string_literal: true

# A shared concern for all Records that can be eagerloaded
module EagerLoadable
  extend ActiveSupport::Concern

  # ClassMethods
  module ClassMethods
    def eager_loaded_class
      # @clazz.eager_load(:alerts, :attachments, :flags)
      includes(
        :alerts, :active_flags, attachments: { file_attachment: :blob }, current_photos: { file_attachment: :blob }
      )
    end
  end
end
