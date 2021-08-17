# frozen_string_literal: true

# SupervisorToCaseworkerRatio
#
# A simple ratio between the number of supervisors and the number of case
# workers in an agency.
class Kpi::SupervisorToCaseworkerRatio < Kpi::Search
  SUPERVISOR_ROLES = [
    'role-gbv-case-management-supervisor'
  ].freeze

  CASE_WORKER_ROLES = [
    'role-gbv-mobile-caseworker',
    'role-gbv-caseworker'
  ].freeze

  def supervisors
    Agency.joins(users: [:role])
          .where(
            unique_id: owned_by_agency_id,
            users: { roles: { unique_id: SUPERVISOR_ROLES } }
          ).count
  end

  def case_workers
    Agency.joins(users: [:role])
          .where(
            unique_id: owned_by_agency_id,
            users: { roles: { unique_id: CASE_WORKER_ROLES } }
          ).count
  end

  def ratio
    @ratio ||= (supervisors.to_f / case_workers).rationalize
  end

  def to_json(*_args)
    {
      data: {
        supervisors: ratio.numerator,
        case_workers: ratio.denominator
      }
    }
  end
end
