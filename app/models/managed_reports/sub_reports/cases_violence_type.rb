# frozen_string_literal: true

# Describes Cases based on violence type by gender/age subreport in Primero.
class ManagedReports::SubReports::CasesViolenceType < ManagedReports::SubReport
  def id
    'cases_violence_type'
  end

  def indicators
    [
      ManagedReports::Indicators::CaseViolenceTypeBySexAndAge
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::CaseViolenceTypeBySexAndAge.id => 'lookup-gender'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::CaseViolenceTypeBySexAndAge.id => 'AgeRange'
    }
  end
end
