module Api::V2
  class IdentityProvidersController < ApplicationApiController
    skip_before_action :authenticate_user!, only: [:index]
    skip_after_action :write_audit_log, only: [:index]

    def index
      @identity_providers = IdentityProvider.all
      @use_identity_provider = SystemSettings.first.use_identity_provider
    end
  end
end