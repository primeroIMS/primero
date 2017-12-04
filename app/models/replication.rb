
class Replication < ApplicationRecord
  MODELS_TO_SYNC = [ Child, Incident, TracingRequest ]

  include PrimeroModel

  use_database :replication_config

  property :remote_app_uri, PrimeroURI, {:init_method => :parse, :allow_blank => false}
  property :couch_target_uri, PrimeroURI, {:init_method => :parse , :allow_blank => false}
  property :push, TrueClass, :default => true
  property :pull, TrueClass, :default => true
  property :is_continuous, TrueClass, :default => false
  property :remote_databases, Hash, :default => {}

  property :description
  property :username
  property :password

  design do
    view :all,
            :map => "function(doc) {
                if (doc['couchrest-type'] == 'Replication') {
                    emit(doc['_id'],1);
                }
            }"
  end


  validates_presence_of :remote_app_uri
  validates_presence_of :description
  validates_presence_of :username
  validates_presence_of :password
  validate :fetch_remote_couch_config
  validate :validate_remote_app_uri

  after_save    :start_replication
  before_destroy :stop_replication

  def inspect
    "<Replication (#{description}): _id: #{_id}, remote_app_uri: #{remote_app_uri}>"
  end

  def self.replicator
    @replicator ||= COUCHDB_SERVER.database('_replicator')
  end

  def self.all_replicator_docs
    self.replicator.documents["rows"]
              .map { |doc| replicator.get doc["id"] unless doc["id"].include? "_design" }
              .compact
  end

  def replicator_docs
    @_cached_configs ||= self.class.all_replicator_docs.select { |rep| rep["primero_ref_id"] == self.id }
  end

  def start_replication
    stop_replication

    build_configs.each do |config|
      self.class.replicator.save_doc config
    end

    true
  end

  def stop_replication
    replicator_docs.each do |config|
      self.class.replicator.delete_doc config
    end
    invalidate_cached_configs
    true
  end

  def timestamp
    replicator_docs.collect { |config| Time.zone.parse config["_replication_state_time"] rescue nil }.compact.max
  end

  def statuses
    replicator_docs.collect { |config| config["_replication_state"] || 'triggered' }
  end

  def active?
    statuses.include?("triggered")
  end

  def success?
    statuses.uniq == [ "completed" ]
  end

  def status
    active? ? "triggered" : success? ? "completed" : "error"
  end

  def full_couch_target_uri(path = "")
    uri = self.couch_target_uri.clone
    uri.host = remote_app_uri.host if uri.host == 'localhost'
    uri.path = "/#{path}"
    uri.user = username if username
    uri.password = password if password
    uri
  end

  def build_configs
    self.class.models_to_sync.map do |model|
      [:push, :pull].map do |direction|
        if __send__(direction)
          __send__("#{direction}_config", model)
        else
          nil
        end
      end
    end.flatten.compact
  end

  def self.models_to_sync
    MODELS_TO_SYNC
  end

  def self.couch_config
    settings = CouchSettings.instance
    uri = settings.ssl_enabled_for_couch? ? settings.with_ssl{ settings.uri } : settings.uri
    uri.user = nil
    uri.password = nil
    uri.path = '/'

    {
      :target => uri.to_s,
      :databases => models_to_sync.inject({}) { |result, model|
        result[model.to_s] = model.database.name
        result
      }
    }
  end

  def self.normalize_uri(uri)
    uri = "http://#{uri}" unless uri.include? '://'
    uri = "#{uri}/"       unless uri.ends_with? '/'
    uri
  end

  def self.any_replications_active?
    Replication.all.reject {|r| r.is_continuous }.any? {|r| r.active? }
  end

  # According to http://guide.couchdb.org/editions/1/en/replication.html,
  # continuous replications are not persisted across database restarts
  def self.reenable_continuous_replications
    Replication.all.select {|r| r.is_continuous}.each do |rep|
      unless rep.replicator_docs.any? {|d| d['continuous'] }
        Rails.logger.info("No continuous replications found for replication #{rep.inspect}; reenabling")
        rep.start_replication
      end
    end
  end

  protected

  attr_accessor :_cached_configs

  def validate_remote_app_uri
    begin
      raise unless ['http', 'https'].include?(remote_app_uri.scheme)
      true
    rescue
      errors.add(:remote_app_uri, I18n.t("errors.models.replication.remote_app_uri"))
    end
  end

  def fetch_remote_couch_config
    begin
      uri = remote_app_uri.clone
      uri.path = Rails.application.routes.url_helpers.configuration_replications_path
      post_params = {:user_name => self.username, :password => self.password}

      response = post_uri uri, post_params

      if response.code_type == Net::HTTPUnauthorized
        errors.add(:credentials, I18n.t("errors.models.replication.remote_unauthorized"))
        false
      else
        config = JSON.parse response.body

        self.couch_target_uri = config['target']
        self.remote_databases = config['databases']

        true
      end
    rescue => e
      errors.add(:fetch_remote_config, I18n.t("errors.models.replication.remote_error"))
      false
    end
  end

  def invalidate_cached_configs
    @_cached_configs = nil
  end

  def post_uri(uri, post_params = {})
    if uri.scheme == "http"
      Net::HTTP.post_form uri, post_params
    else
      http = Net::HTTP.new(uri.host, (uri.port || 443))
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Post.new(uri.request_uri)
      request.set_form_data(post_params)
      http.start { |req| req.request(request) }
    end
  end

  def push_config(model)
    target = full_couch_target_uri(self.remote_databases[model.to_s])
    make_config(model.database.name, target.to_s)
  end

  def pull_config(model)
    target = full_couch_target_uri(self.remote_databases[model.to_s])
    make_config(target.to_s, model.database.name)
  end

  def make_config(source, target)
    { :source => source, :target => target, :primero_ref_id => self["_id"], :primero_env => Rails.env, :continuous => self.is_continuous }
  end

end
