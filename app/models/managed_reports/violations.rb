# frozen_string_literal: true

# Describes ViolationReport in Primero.
class ManagedReports::Violations < ManagedReport
  attr_accessor :data
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

  def build_subreport(search_filters, subreport_id)
    binding.pry
    return {} if subreport_id.blank? || !subreports_list.include?(subreport_id)

    subreports = "ManagedReports::Violations::#{subreport_id.camelize}".constantize.new(search_filters)
    self.data = subreports.data(search_filters)
  end

  def subreports_list
    %w[killing]
  end
end
