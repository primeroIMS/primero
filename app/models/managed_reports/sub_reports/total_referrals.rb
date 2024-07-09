# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

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
