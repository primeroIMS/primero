module Record
  extend ActiveSupport::Concern

  included do
    before_save :update_history, :unless => :new?
    before_save :update_organisation
    before_save :add_creation_history, :if => :new?
  end

  def update_history
    if self.changed?
      require 'pry'; binding.pry
      changes = changes_to_history(self.changes, self.properties_by_name)
      (add_to_history(changes) unless (!self['histories'].empty? && (self['histories'].last["changes"].to_s.include? changes.to_s)))
      self.previously_owned_by = original_data['owned_by']
    end
  end

  def ordered_histories
    (self["histories"] || []).sort { |that, this| DateTime.parse(this["datetime"]) <=> DateTime.parse(that["datetime"]) }
  end

  def add_creation_history
    self['histories'].unshift({
                                  'user_name' => created_by,
                                  'user_organisation' => organisation_of(created_by),
                                  'datetime' => created_at,
                                  'changes' => {"#{self.class.name.underscore.downcase}" => {:created => created_at}}
                              })
  end

  def add_to_history(changes)
    last_updated_user_name = last_updated_by
    self['histories'].unshift({
                                  'user_name' => last_updated_user_name,
                                  'user_organisation' => organisation_of(last_updated_user_name),
                                  'datetime' => last_updated_at,
                                  'changes' => changes})
  end

  def organisation_of(user_name)
    User.find_by_user_name(user_name).try(:organisation)
  end

  def field_name_changes
    other_fields = [
        "flags",
        "reunited", "reunited_message",
        "investigated", "investigated_message",
        "duplicate", "duplicate_of", "owned_by"
    ]
    all_fields = model_field_names + other_fields
    all_fields.select { |field_name| changed_field?(field_name) }
  end

  def changes_to_history(changes, properties_by_name)
    changes.inject({}) do |acc, (prop_name, (prev, current))|
      change_hash = if properties_by_name.include?(prop_name)
        prop = properties_by_name[prop_name]
        if prop.array
          (prev_hash, current_hash) = [prev, current].map do |arr|
                                        arr.inject({}) {|acc2, emb| acc2.merge({emb.unique_id => emb}) }
                                      end

          (prev_hash.keys & current_hash.keys).map do |k|
            if prev_hash[k] != current_hash[k]
              {
                'from' => prev_hash[k].to_hash,
                'to' => current_hash[k].to_hash,
              }
            end
          end.compact
        elsif prop.type.include? CouchRest::Model::Embeddable
          # TODO: Make more generic
          prop.type.properties_by_name.inject({}) do |acc2, sub_prop|
            changes_to_history([prev, current].map {|h| h.__send__(sub_prop.name)}, sub_prop.type.properties_by_name)
          end
        end
      else
        change_hash = {
            'from' => prev,
            'to' => current,
          }
      end
      acc.merge({prop_name => change_hash})
    end
  end

  def changed_field?(field_name)
    return false if self[field_name].blank? && original_data[field_name].blank?
    return true if original_data[field_name].blank?
    if self[field_name].respond_to? :strip and original_data[field_name].respond_to? :strip
      self[field_name].strip != original_data[field_name].strip
    else
      self[field_name] != original_data[field_name]
    end
  end

  def original_data
    (@original_data ||= self.class.get(self.id) rescue nil) || self
  end

  private

  def merge_histories(given_histories)
    current_histories = self['histories']
    to_be_merged = []
    (given_histories || []).each do |history|
      matched = current_histories.find do |c_history|
        c_history["user_name"] == history["user_name"] && c_history["datetime"] == history["datetime"] && c_history["changes"].keys == history["changes"].keys
      end
      to_be_merged.push(history) unless matched
    end
    self["histories"] = current_histories.push(to_be_merged).flatten!
  end

end
