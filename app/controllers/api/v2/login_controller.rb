module Api::V2
  class LoginController < ApplicationApiController
    skip_before_action :authenticate_user!, only: [:provider]
    skip_after_action :write_audit_log, only: [:provider]

    def provider
      #TODO: should we return an error if the provider doesn't exist?
      @identity_provider = IdentityProvider.find_by(provider_type: params[:provider])
      render layout: 'layouts/identity'
    end

  end
end