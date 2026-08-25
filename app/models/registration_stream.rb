# frozen_string_literal: true

# Represents a registration stream within the system, encapsulating its role, user groups, and associated agency.
class RegistrationStream < ValueObject
  attr_accessor :unique_id, :role, :user_groups, :agency, :record_type, :primero_module

  def permitted_forms
    Role.find_by(unique_id: role)&.permitted_forms('case', true, true)
  end
end
