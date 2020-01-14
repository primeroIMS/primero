class LoginController < ApplicationController

  def index
    #TODO: should we return an error if the provider doesn't exist?
    @identity_provider = IdentityProvider.find_by(provider_type: params[:provider])
    render layout: 'identity'
  end

end