# frozen_string_literal: true

# Copyright (c) 2025 UNICEF. All rights reserved.

# Model for signatures
class Signature < Attachment
  store_accessor :metadata, :consent_provided, :signature_provided_on, :signature_provided_by,
                 :signature_created_by_user

  before_save :set_signature_metadata

  class << self
    def new_with_user(user, params)
      signature = new(params)
      signature.signature_created_by_user = user.user_name
      signature
    end
  end

  def set_signature_metadata
    self.signature_provided_on = Date.today
    self.consent_provided = true
  end

  def to_h_api
    hash = slice(:id, :field_name, :file_name, :signature_provided_on, :signature_provided_by,
                 :signature_created_by_user)
    hash[:attachment_url] = url
    hash[:content_type] = content_type
    hash
  end
end
