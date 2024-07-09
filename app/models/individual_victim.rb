# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for MRM IndividualVictim
class IndividualVictim < ApplicationRecord
  include ViolationAssociable

  store_accessor(
    :data,
    :individual_age, :individual_sex, :victim_deprived_liberty_security_reasons,
    :reasons_deprivation_liberty, :facilty_victims_held, :torture_punishment_while_deprivated_liberty
  )

  has_and_belongs_to_many :violations
end
