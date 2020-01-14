class LoginController < ApplicationController

  rescue_from ActionView::MissingTemplate do |e|
    render_404
  end

  def index
    @identity_provider = IdentityProvider.find_by(provider_type: params[:provider])
    
    if @identity_provider.present?
      render layout: 'identity', template: "login/#{params[:provider]}"
    else
      render_404
    end
  end

  def render_404
    render file: 'public/404.html', status: 404, layout: false
  end
end