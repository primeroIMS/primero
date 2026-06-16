# frozen_string_literal: true

# Describes Cases based on workflow status by gender/age subreport in Primero.
class ManagedReports::SubReports::ProtectionConcerns < ManagedReports::SubReport
  def id
    'protection_concerns'
  end

  def indicators
    [
      ManagedReports::Indicators::ProtectionConcerns
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::ProtectionConcerns.id => 'lookup-gender'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::ProtectionConcerns.id => 'AgeRange'
    }
  end
end
