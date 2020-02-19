json.data do
  json.array! @identity_providers do |identity_provider|
    json.id identity_provider.id
    json.unique_id identity_provider.unique_id
    json.name identity_provider.name
    json.provider_type identity_provider.provider_type
    json.client_id identity_provider.client_id
    json.authorization_url identity_provider.authorization_url
    json.identity_scope identity_provider.identity_scope
    json.verification_url identity_provider.verification_url
    json.user_domain identity_provider.user_domain
  end
end
json.metadata do
  json.use_identity_provider @use_identity_provider
end
