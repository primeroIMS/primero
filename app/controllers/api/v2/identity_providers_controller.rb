# frozen_string_literal: true

# List all enabled identity providers
class Api::V2::IdentityProvidersController < ApplicationApiController
  skip_before_action :authenticate_user!, only: [:index]
  skip_after_action :write_audit_log, only: [:index]

  def index
    @identity_providers = IdentityProvider.all
  end
end
