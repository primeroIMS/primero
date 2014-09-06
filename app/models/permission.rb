class Permission

  READ = {read: I18n.t('permission.read')}
  WRITE = {write: I18n.t('permission.write')}
  FLAG = {flag: I18n.t('permission.flag')}
  ASSIGN = {assign: I18n.t('permission.assign')}
  CASE = {:case => I18n.t('permission.case')}
  INCIDENT = {incident: I18n.t('permission.incident')}
  TRACING_REQUEST = {tracing_request: I18n.t('permission.tracing_request')}
  USER = {user: I18n.t('permission.user')}
  METADATA = {metadata: I18n.t('permission.metadata')}
  SYSTEM = {system: I18n.t('permission.system')}
  SELF = {self: I18n.t('permission.self')} # A redundant permission. This is implied.
  GROUP = {group: I18n.t('permission.group')}
  ALL = {all: I18n.t('permission.all')}


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

  def self.all_grouped
    {'actions' => actions, 'resources' => resources, 'management' => management}
  end

end
