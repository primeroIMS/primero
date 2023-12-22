# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A module to handle referrable records
module Api::V2::Concerns::Referrable
  extend ActiveSupport::Concern

  def authorized_roles
    return @authorized_roles if @authorized_roles.present?

    referral_roles = current_user.authorized_referral_roles(@record) unless @record&.owner?(current_user)
    # TODO: This is a side effect and probably needs to be somewhere else.
    @display_permitted_forms = referral_roles.present?
    @authorized_roles = referral_roles.presence || [current_user.role]
  end
end
