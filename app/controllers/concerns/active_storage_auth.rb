# frozen_string_literal: true

# This concern is monkey patched into the public facing Rails
# ActiveStorage controllers, to prevent the most egregious unauthorized access.
module ActiveStorageAuth
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user!

    rescue_from CanCan::AccessDenied do
      render plain: 'Forbidden', status: 403
    end
  end

  # TODO: So far this has been tested for BulkExports.
  # The logic is probably good for record attachments,
  # but will likely need to be extended for Agencies (logos)
  def authorize_blob!
    record = @blob&.attachments&.first&.record
    authorize!(:read, record)
  end
end