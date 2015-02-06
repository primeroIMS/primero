class Permission
  READ = 'read'
  WRITE = 'write'
  FLAG = 'flag'
  IMPORT = 'import'
  ASSIGN = 'assign'
  REPORT_CREATE = 'report_create' #ok, painted us into a corner here
  TRANSFER = 'transfer'
  REFERRAL = 'referral'
  CASE = 'case'
  INCIDENT = 'incident'
  TRACING_REQUEST = 'tracing_request'
  USER = 'user'
  METADATA = 'metadata'
  SYSTEM = 'system'
  REPORT = 'report'
  SELF = 'self' # A redundant permission. This is implied.
  GROUP = 'group'
  ALL = 'all'
  CONSENT_OVERRIDE = 'consent_override'


  def self.description(permission)
    I18n.t("permission.#{permission}")
  end

  def self.actions
    [READ, WRITE, FLAG, IMPORT, ASSIGN, REPORT_CREATE, TRANSFER, REFERRAL, CONSENT_OVERRIDE]
  end

  def self.resources
    [CASE, INCIDENT, TRACING_REQUEST, USER, METADATA, SYSTEM, REPORT]
  end

  def self.management
    [SELF, GROUP, ALL]
  end

  def self.all
    actions + resources + management
  end

  class << self
    alias_method :all_permissions, :all
  end

  def self.all_grouped
    {'actions' => actions, 'resources' => resources, 'management' => management}
  end



end
