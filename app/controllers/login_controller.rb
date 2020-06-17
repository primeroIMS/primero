# frozen_string_literal: true

# Controller used to handle OpenId Connect redirect urls.
# The expected route is 'v2/login/:id' where :id is actially the provider_type
class LoginController < ApplicationController
  rescue_from ActionView::MissingTemplate do
    render_404
  end

  def show
    provider_type = params[:id]
    @identity_provider = IdentityProvider.find_by(provider_type: provider_type)
    return render_404 unless @identity_provider.present?

    render layout: 'identity', template: "login/#{provider_type}"
  end

  def render_404
    render file: 'public/404.html', status: 404, layout: false
  end
end
