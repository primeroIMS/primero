# frozen_string_literal: true

# This expires the underlying service redirect urls. The URLs are public?!
# TODO: Depending on how the Azure Blob Service is set up, we may do a blanket
# forbid on all ActiveStorage URLSs and create new proxy controllers for blobs.

ActiveStorage::Service.url_expires_in = 60.seconds

# This is a civilized monkey patch to force user and record level authorization
# for the out-of-the-box Rails Active Storage controllers.
# We are not interested in re-writing active storage controllers: just locking them down
ActiveStorage::BlobsController.class_eval do
  include ActiveStorageAuth
  before_action :authenticate_access!
  before_action :authorize_blob!
end

ActiveStorage::RepresentationsController.class_eval do
  include ActiveStorageAuth
  before_action :authenticate_access!
  before_action :authorize_blob!
end

ActiveStorage::DiskController.class_eval do
  include ActiveStorageAuth
  before_action :forbid!, only: %i[update create destroy]
end

ActiveStorage::DirectUploadsController.class_eval do
  include ActiveStorageAuth
  before_action :forbid!
end
