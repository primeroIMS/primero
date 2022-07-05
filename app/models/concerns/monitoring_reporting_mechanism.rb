# frozen_string_literal: true

# MRM-related model
module MonitoringReportingMechanism
  extend ActiveSupport::Concern

  included do
    searchable do
      string :individual_violations, multiple: true do
        individual_victims_violation_types
      end
      integer :individual_age, multiple: true do
        individual_victims_age
      end
      string :individual_sex, multiple: true do
        individual_victims_sex
      end
      string :victim_deprived_liberty_security_reasons, multiple: true do
        individual_victims_deprived_liberty_security_reasons
      end
      string :reasons_deprivation_liberty, multiple: true do
        individual_victims_reasons_deprivation_liberty
      end
      string :victim_facilty_victims_held, multiple: true do
        individual_victims_facilty_victims_held
      end

      string :torture_punishment_while_deprivated_liberty, multiple: true do
        individual_victims_torture_punishment_while_deprivated_liberty
      end
    end
  end

  def individual_victims_violation_types
    violations.joins(:individual_victims).pluck(Arel.sql("violations.data->>'type'")).uniq.compact
  end

  def individual_victims_age
    individual_victims.pluck(Arel.sql("individual_victims.data->>'individual_age'")).uniq.compact
  end

  def individual_victims_sex
    individual_victims.pluck(Arel.sql("individual_victims.data->>'individual_sex'")).uniq.compact
  end

  def individual_victims_deprived_liberty_security_reasons
    individual_victims.pluck(
      Arel.sql("individual_victims.data->>'victim_deprived_liberty_security_reasons'")
    ).uniq.compact
  end

  def individual_victims_reasons_deprivation_liberty
    individual_victims.pluck(Arel.sql("individual_victims.data->>'reasons_deprivation_liberty'")).uniq.compact
  end

  def individual_victims_facilty_victims_held
    individual_victims.pluck(Arel.sql("individual_victims.data->>'facilty_victims_held'")).uniq.compact
  end

  def individual_victims_torture_punishment_while_deprivated_liberty
    individual_victims.pluck(
      Arel.sql("individual_victims.data->>'torture_punishment_while_deprivated_liberty'")
    ).uniq.compact
  end
end
