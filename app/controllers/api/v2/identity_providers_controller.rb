module Api::V2
  class IdentityProvidersController < ApplicationApiController
    skip_before_action :authenticate_user!, only: [:index]

    def index
      @identity_providers = IdentityProvider.all
      @use_identity_provider = SystemSettings.first.use_identity_provider
    end
  end
end