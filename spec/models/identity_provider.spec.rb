require 'rails_helper'

describe IdentityProvider do

  before do
    IdentityProvider.delete_all

    @identity_providers_primero = IdentityProvider.create!(
      id: 1,
      name: "primero",
      unique_id: "primeroims",
      provider_type: "b2c",
      configuration: {
        client_id: "123",
        authorization_url: "url",
        identity_scope: ["123"],
        verification_url: "verifyurl"
      }
    )

    @identity_providers_unicef = IdentityProvider.create!(
      id: 2,
      name: "unicef",
      unique_id: "unicef",
      provider_type: "b2c",
      configuration: {
        client_id: "123",
        authorization_url: "url",
        identity_scope: ["123"],
        verification_url: "verifyurl"
      }
    )
  end

  describe '#identity_providers' do
    it 'maps configuration to top level' do
      expect(@identity_providers_unicef.client_id).to eq("123")
      expect(@identity_providers_unicef.authorization_url).to eq("url")
      expect(@identity_providers_unicef.identity_scope).to eq(["123"])
      expect(@identity_providers_unicef.verification_url).to eq("verifyurl")
    end
  end
end
