module Api::V2
  class IdentityProvidersController < ApplicationApiController

    def index
      @identity_providers = IdentityProvider.all;
    end

    def show
      @lookup = IdentityProvider.find(params[:id])
    end
  end
end