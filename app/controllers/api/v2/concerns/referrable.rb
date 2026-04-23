# frozen_string_literal: true

# A module to handle referrable records
module Api::V2::Concerns::Referrable
  extend ActiveSupport::Concern

  def authorized_roles
    return @authorized_roles if @authorized_roles.present?

    referral_roles = current_user.authorized_referral_roles(@record) unless @record&.owner?(current_user)
    @display_permitted_forms = referral_roles.present?
    @authorized_roles = referral_roles.presence || [current_user.role]
  end
end
