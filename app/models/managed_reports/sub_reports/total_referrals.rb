# frozen_string_literal: true

# Describes Referrals for user groups
class ManagedReports::SubReports::TotalReferrals < ManagedReports::SubReport
  def id
    'total_referrals'
  end

  def indicators
    [
      ManagedReports::Indicators::TotalReferralsByUserGroups
    ]
  end

  def lookups
    {
      ManagedReports::Indicators::TotalReferralsByUserGroups.id => 'UserGroupPermitted'
    }
  end

  def indicators_subcolumns
    {
      ManagedReports::Indicators::TotalReferralsByUserGroups.id => 'UserGroupPermitted'
    }
  end
end
