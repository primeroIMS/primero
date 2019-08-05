module Historical
  extend ActiveSupport::Concern
  include Ownable
  include PrimeroModel

  included do
    before_save :update_last_updated_at
    before_save :update_history, :unless => :new?
    before_save :update_organization
    before_save :add_creation_history, :if => :new?

    property :created_organization
    property :created_agency_office
    property :created_by
    property :created_by_full_name
    property :created_at, DateTime
    property :last_updated_at, DateTime
    property :last_updated_by
    property :last_updated_by_full_name
    property :posted_at, DateTime

    validate :validate_created_at
    validate :validate_last_updated_at

    property :histories, [Class.new() do
      include Syncable::PrimeroEmbeddedModel

      property :datetime, DateTime
      property :user_name, String
      property :user_organization, String
      property :prev_revision, String
      property :action, Symbol, :init_method => 'to_sym'
      property :changes, Hash, :default => {}
    end], {:default => [], :init_method => ->(*args) { cast_histories(*args) }}

    def self.cast_histories(*args)
      hist = self.properties_by_name['histories'].type.new(*args)

      rebuild_values = ->(from_to, &block) do
        from_to.inject({}) do |acc, (k, v)|
          new_v = if v.present?
                    begin
                      block.call(v)
                    rescue
                      v
                    end
                  else
                    v
                  end
          acc.merge({k => new_v})
        end
      end

      cast_change = ->(prop_name, prop_type, prop_array, change) do
        if prop_type.include?(CouchRest::Model::Embeddable)
          if prop_array
            change.inject({}) do |acc, (unique_id, ch)|
              # Change could be nil if element was deleted
              casted = if ch.present?
                         cast_change.call(prop_name, prop_type, false, ch)
                       else
                         ch
                       end
              acc.merge({unique_id => casted})
            end
          else
            change.inject({}) do |acc, (k, ch)|
              sub_prop = prop_type.properties_by_name[k]
              # Account for changes that had their property name changed later
              casted_change = if sub_prop.present? && sub_prop.type.present?
                                cast_change.call(sub_prop.name, sub_prop.type, sub_prop.array, ch)
                              else
                                ch
                              end
              acc.merge({k => casted_change})
            end
          end
        elsif [Date, DateTime, Time].include?(prop_type)
          rebuild_values.call(change) {|v| prop_type.parse(v)}
        else
          change
        end
      end

      hist.changes = hist.changes.inject({}) do |acc, (k, v)|
        p = properties_by_name[k]
        new_change = if p.present? && p.type.present?
                       cast_change.call(p.name, p.type, p.array, v)
                     else
                       v
                     end

        acc.merge({k => new_change})
      end

      hist
    end

    design do
      view :by_created_by
    end
  end

  module ClassMethods
    def all_by_creator(created_by)
      self.by_created_by :key => created_by
    end
  end

  def validate_created_at
    unless self.created_at.nil? || self.created_at.is_a?(DateTime)
      errors.add(:created_at, '')
    end
  end

  def validate_last_updated_at
    unless self.last_updated_at.nil? || self.last_updated_at.is_a?(DateTime)
      errors.add(:last_updated_at, '')
    end
  end

  def _force_save
    false
  end

  def set_creation_fields_for(user)
    self.last_updated_by = user.try(:user_name)
    self.created_by = user.try(:user_name)
    self.created_by_full_name = user.try(:full_name)
    self.created_organization = user.try(:organization)
    self.created_agency_office = user.try(:agency_office)
    self.last_updated_at ||= self.created_at ||= DateTime.now
    self.posted_at = DateTime.now
  end

  def update_organization
    self.created_organization ||= created_by_user.try(:organization)
  end

  def created_by_user
    @created_by_user ||= (self.created_by.present? ? User.find_by_user_name(self.created_by) : nil)
  end

  def update_last_updated_at()
    self.last_updated_at = DateTime.now
  end

  def ordered_histories
    (self.histories || []).sort_by {|h| h.datetime || DateTime.new }.reverse
  end

  def latest_update_from_history
    hist = self.histories.first
    hist.try(:action) == :update ? hist : nil
  end

  def update_history
    # TODO: Figure out some useful way of specifying attachment changes
    # _force_save is a hack to make CouchRest Model save a model while
    # dirty tracking is disabled.
    ignored_root_properties = %w{
      _force_save
      last_updated_at
      last_updated_by
      histories
    }

    if self.changed?
      chs = self.changes.except(*ignored_root_properties)
      history_changes = changes_to_history(chs, self.properties_by_name).inject({}) do |acc, (k, v)|
        if ['from', 'to'].include?(k)
          acc.merge(k => v)
        else
          v.nil? ? acc : acc.merge(k => v)
        end
      end

      if history_changes.present?
        add_update_to_history(history_changes)
      end
    end
    true
  end

  def add_creation_history
    unless self.histories.find {|h| h.action == :create }
      without_dirty_tracking do
        self.histories.unshift({
          :user_name => created_by,
          :user_organization => organization_of(created_by),
          :prev_revision => nil,
          :datetime => created_at,
          :action => :create,
        })
      end
    end
    true
  end

  def add_update_to_history(changes)
    without_dirty_tracking do
      self.histories.unshift({
        :user_name => last_updated_by,
        :user_organization => organization_of(last_updated_by),
        :prev_revision => self.rev,
        :datetime => last_updated_at,
        :action => :update,
        :changes => changes,
      })
    end
  end

  def organization_of(user_name)
    User.find_by_user_name(user_name).try(:organization)
  end

  private

  def changes_to_history(changes, properties_by_name)
    (changes || {}).inject({}) do |acc, (prop_name, (prev, current))|
      prop = properties_by_name[prop_name]
      change_hash = if (prev.is_a?(Array) || current.is_a?(Array)) &&
                       prop.try(:type).try(:include?, CouchRest::Model::Embeddable)
        (prev_hash, current_hash) = [prev, current].map do |arr|
                                      (arr || []).inject({}) {|acc2, emb| acc2.merge({emb.unique_id => emb}) }
                                    end

        (prev_hash.keys | current_hash.keys).inject({}) do |acc, k|
          if prev_hash[k] != current_hash[k]
            new_props_by_name = Hash.new.tap do |h|
              h[k] = properties_by_name[prop.name]
            end
            if current_hash[k].nil?
              acc.merge({k => nil})
            else
              acc.merge(changes_to_history({k => [prev_hash[k], current_hash[k]]}, new_props_by_name))
            end
          else
            acc
          end
        end
      elsif prop.try(:type).try(:include?, CouchRest::Model::Embeddable)
        prop.type.properties_by_name.inject({}) do |acc2, (name, sub_prop)|
          sub_changes = [prev, current].map {|h| h.present? ? h.__send__(name) : nil}
          if sub_changes[0] != sub_changes[1]
            acc2.merge(changes_to_history({ name => sub_changes}, { name => sub_prop }))
          else
            acc2
          end
        end
      else
        (norm_prev, norm_current) = [prev, current].map {|v| normalize_history_value(v, prop_name) }

        if norm_prev != norm_current
          {
            'from' => norm_prev,
            'to' => norm_current,
          }
        end
      end
      if change_hash.present?
        acc.merge({prop_name => change_hash})
      else
        acc
      end
    end
  end

  def normalize_history_value(v, prop_name=nil)
    case v
    when String
      s = v.strip
      if s.blank?
        nil
      else
        s
      end
    when Hash
      if prop_name == '_attachments'
        v.inject({}) do |acc, (k, att)|
          if att.include?('content_type') && att.include?('data')
            # Try to recreate how CouchDB will represent this attachment upon the
            # next fetch. Hopefully this does not prove to be fragile.
            acc.merge(k => {
              'content_type' => att['content_type'],
              'stub' => true,
              'revpos' => rev[0..1].to_i + 1,
              'digest' => "md5-#{Digest::MD5.base64digest(att['data'])}",
              'length' => att['data'].length,
            })
          else
            acc
          end
        end
      else
        v
      end
    else
      v
    end
  end
end
