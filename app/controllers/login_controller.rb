class LoginController < ApplicationController

  def index
    begin
      @identity_provider = IdentityProvider.find_by(provider_type: params[:provider])
      render layout: 'identity', template: "login/#{params[:provider]}"
    rescue ActionView::MissingTemplate => e
      render file: 'public/404.html', status: 404, layout: false
    end
  end
end