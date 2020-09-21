module KPI
  class SupervisorToCaseworkerRatio < Search
    SUPERVISOR_ROLES = [
      'role-gbv-case-management-supervisor'
    ].freeze

    CASE_WORKER_ROLES = [
      'role-gbv-mobile-caseworker',
      'role-gbv-caseworker'
    ].freeze

    def ratio
      supervisors = User.joins(:role)
        .where(roles: { unique_id: SUPERVISOR_ROLES }).count
      case_workers = User.joins(:role)
        .where(roles: { unique_id: CASE_WORKER_ROLES }).count
      (supervisors / case_workers).rationalize
    end
  end
end
