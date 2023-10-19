# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.data do
  json.array! @identity_providers do |identity_provider|
    json.id identity_provider.id
    json.unique_id identity_provider.unique_id
    json.name identity_provider.name
    json.provider_type identity_provider.provider_type
    json.client_id identity_provider.client_id
    json.force_standard_oidc identity_provider.force_standard_oidc
    json.authorization_url identity_provider.authorization_url
    json.identity_scope identity_provider.identity_scope
    json.verification_url identity_provider.verification_url
    json.user_domain identity_provider.user_domain
    json.domain_hint identity_provider.domain_hint
    json.redirect_uri identity_provider.redirect_uri
  end
end
json.metadata do
  json.use_identity_provider Rails.configuration.x.idp.use_identity_provider
end
