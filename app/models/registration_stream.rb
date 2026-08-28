# frozen_string_literal: true

# Represents a registration stream within the system, encapsulating its role, user groups, and associated agency.
class RegistrationStream
  include ActiveModel::API

  attr_accessor :unique_id, :role, :user_groups, :agency, :record_type,
                :user, :module_id, :user_category

  def permitted_forms
    # NOTE: For now we are assuming that registration streams will only create cases
    Role.find_by(unique_id: role)&.permitted_forms('case', true, true)
  end

  def default_record_owner
    User.find_by(user_name: user)
  end
end
