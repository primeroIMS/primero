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
      @ratio ||= begin
         supervisors = User.joins(:role)
           .where(roles: { unique_id: SUPERVISOR_ROLES }).count
         case_workers = User.joins(:role)
           .where(roles: { unique_id: CASE_WORKER_ROLES }).count
         (supervisors / case_workers).rationalize
       end
    end

    def to_json
      {
        data: {
          supervisors: ratio.numerator,
          case_workers: ratio.denominator
        }
      }
    end
  end
end
