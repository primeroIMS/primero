# frozen_string_literal: true

# Controller used to handle OpenId Connect redirect urls.
# The expected route is '/login/:id' where :id is actially the provider_type
class LoginController < ApplicationController
  PROVIDERS_TEMPLATES = {
    IdentityProvider::B2C => 'login/b2c'
  }.freeze

  rescue_from ActionView::MissingTemplate do
    render_404
  end

  def show
    provider_type = params[:id]

    @identity_provider = IdentityProvider.find_by(provider_type:)
    template = PROVIDERS_TEMPLATES[@identity_provider&.provider_type]

    return render_404 if template.nil?

    render layout: 'identity', template:
  end

  def render_404
    render file: 'public/404.html', status: 404, layout: false
  end
end
