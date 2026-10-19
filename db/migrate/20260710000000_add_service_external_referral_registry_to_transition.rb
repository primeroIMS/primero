# frozen_string_literal: true

class AddServiceExternalReferralRegistryToTransition < ActiveRecord::Migration[8.1]
  def change
    add_column :transitions, :service_external_referral_registry, :boolean
  end
end
