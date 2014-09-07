class Permission


  READ = 'read'
  WRITE = 'write'
  FLAG = 'flag'
  ASSIGN = 'assign'
  CASE = 'case'
  INCIDENT = 'incident'
  TRACING_REQUEST = 'tracing_request'
  USER = 'user'
  METADATA = 'metadata'
  SYSTEM = 'system'
  SELF = 'self' # A redundant permission. This is implied.
  GROUP = 'group'
  ALL = 'all'

  def self.description(permission)
    I18n.t("permission.#{permission}")
  end

  def self.actions
    [READ, WRITE, FLAG, ASSIGN]
  end

  def self.resources
    [CASE, INCIDENT, TRACING_REQUEST, USER, METADATA, SYSTEM]
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
