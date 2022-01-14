# frozen_string_literal: true

# Describes ViolationReport in Primero.
class ManagedReports::ViolationsReport < ManagedReport
  def id
    'violations_report'
  end

  def properties
    {
      id: id,
      name: 'violation_report.name',
      description: 'violation_report.description',
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
