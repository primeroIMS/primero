# frozen_string_literal: true

# This is a civilized monkey patch to force user and record level authorization
# for the out-of-the-box Rails Active Storage Blobs controller.
# We are not interested in re-writing active storage controllers: just locking them down
ActiveStorage::BlobsController.class_eval do

  before_action :authenticate_user!
  before_action :authorize_blob!

  rescue_from CanCan::AccessDenied do
    render plain: 'Forbidden', status: 403
  end

  # TODO: So far this has been tested for BulkExports.
  # The logic is probably good for record attachments,
  # but will likely need to be extended for Agencies (logos)
  def authorize_blob!
    record = @blob&.attachments&.first&.record
    authorize!(:read, record)
  end
end