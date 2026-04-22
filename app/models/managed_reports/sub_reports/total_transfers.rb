# frozen_string_literal: true

# Describes Transfers for user groups
class ManagedReports::SubReports::TotalTransfers < ManagedReports::SubReport
  def id
    'total_transfers'
  end

  def indicators
    [
      ManagedReports::Indicators::TotalTransfersByUserGroups
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::TotalTransfersByUserGroups.id => 'UserGroupPermitted'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::TotalTransfersByUserGroups.id => 'UserGroupPermitted'
    }
  end
end
