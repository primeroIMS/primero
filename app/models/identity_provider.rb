class IdentityProvider < ApplicationRecord
  store_accessor :configuration,
    :client_id, :authorization_url, :identity_scope, :verification_url
end