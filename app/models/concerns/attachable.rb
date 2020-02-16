# frozen_string_literal: true

# Implements class methods for declaring attachments of type image, audio, and document
# on ActiveRecord models
module Attachable
  extend ActiveSupport::Concern

  MAX_ATTACHMENTS = 100

  included do
    has_many :attachments
    validates :attachments, length: { maximum: MAX_ATTACHMENTS }
  end
end
