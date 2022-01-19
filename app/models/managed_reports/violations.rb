# frozen_string_literal: true

# Describes ViolationReport in Primero.
class ManagedReports::Violations < ManagedReport
  def id
    'violations'
  end

  def properties
    {
      id: id,
      name: 'managed_reports.violations.name',
      description: 'managed_reports.violations.description',
      module_id: PrimeroModule::MRM
    }
  end

  def build_report
    {}
  end

  def subreports
    Violation::TYPES
  end
end
