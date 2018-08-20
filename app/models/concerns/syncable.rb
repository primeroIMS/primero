module Syncable
  extend ActiveSupport::Concern

  include Historical

  module PrimeroEmbeddedModel
    extend ActiveSupport::Concern

    include CouchRest::Model::Embeddable

    included do
      property :unique_id
    end

    def initialize *args
      super

      self.unique_id ||= UUIDTools::UUID.random_create.to_s
    end
  end

  included do
    design do
      view :conflicting_records,
              :map => "function(doc) {
                if (doc._conflicts) {
                  emit(null, [doc._rev].concat(doc._conflicts));
                }
              }"
    end
  end

  module ClassMethods
    def all_conflicting_records
      self.conflicting_records.all
    end

    def resolve_all_conflicting_records
      all_conflicting_records.each do |rec|
        Rails.logger.info {"Conflicts found in record #{rec.id}"}
        begin
          rec.resolve_conflicting_revisions
        rescue => e
          Rails.logger.error("Error resolving conflicts for #{modelClass} with id #{rec.id}\n#{e}\n#{e.backtrace}")
        end
      end
    end
  end

  def get_all_conflicting_revisions
    self_with_conflicts = self.database.get(self._id, {:conflicts => true})

    if self_with_conflicts.to_hash.include?('_conflicts')
      self_with_conflicts['_conflicts'].map do |rev|
        self.class.build_from_database(self.database.get(self._id, {:rev => rev}))
      end
    else
      []
    end
  end

  def resolve_conflicting_revisions
    conflicting_revs = get_all_conflicting_revisions()
    all_revs = (conflicting_revs + [self]).sort_by {|r| r.last_updated_at || DateTime.new }

    resolved_attrs = all_revs.each_cons(2)
                             .inject({}) do |acc, (older, newer)|
      base_revision = find_base_revision([older, newer])
      older_changes = older.get_intermediate_changes(base_revision)

      attrs = merge_with_existing_attrs(older.attributes_as_update_hash, older_changes,
                                    older.remove_stale_properties(newer.attributes_as_update_hash, base_revision))
      attachments = attrs.delete('_attachments')
      newer.directly_set_attributes(attrs)
      if attachments.present?
        newer.recreate_missing_attachments(older, attachments)
      end
      newer.attributes_as_update_hash
    end

    Rails.logger.debug {"Resolved attributes are #{resolved_attrs}"}

    # Take the oldest and apply all of the new attributes to it
    (active, discards) = [all_revs[-1], all_revs[0..-2]]

    without_dirty_tracking do
      self.changed_attributes['_force_save'] = true
      active.directly_set_attributes(resolved_attrs)
      active.histories = active.histories.sort_by {|el| el.datetime || DateTime.new }.reverse
    end

    Rails.logger.debug {"Saving Active Revision: #{rev} for #{id}"}
    active.database.save_doc(active)

    discards.each do |r|
      Rails.logger.debug {"Deleting revision #{r.rev} for #{r.id}"}
      r.database.delete_doc(r)
    end
  end

  # Unfortunately for some reason CouchDB doesn't like it if you just merge the
  # attachment hash for different revisions.  It will claim that the attachment
  # is missing for older revisions and throw a 412 error.  This will explicitly
  # recreate the attachment on the newer revision.
  # @param other_revision: the other revision that has any missing attachments
  # @param attachments: the set of attachments for this instance
  def recreate_missing_attachments(other_revision, attachments)
      new_attachments = attachments.reject {|k, _| self._attachments.include?(k) }
      new_attachments.inject(self._attachments) do |acc, (name, _)|
        att = other_revision.attachment(name)
        self.attach(att)
      end
  end

  # Remove attributes that have been updated since `revision` to avoid
  # overwriting newer changes
  def remove_stale_properties(properties, revision)
    inter_changes = get_intermediate_changes(revision)

    inter_changes.inject(properties.clone) do |props_to_update, changes|
      remove_proc = lambda do |props, (key, prop_change)|
        new_props = props.clone
        case new_props[key]
        when Hash
          new_props[key] = new_props[key].keys.inject(new_props[key]) do |acc, k|
            if prop_change.try(:fetch, k, nil).present?
              remove_proc.call(acc, [k, prop_change[k]])
            else
              acc
            end
          end
        when Array
          new_props[key] = prop_change.inject(new_props[key]) do |acc, (unique_id, ch)|
            i = acc.index {|el| el['unique_id'] == unique_id }
            i.nil? ? acc : remove_proc.call(acc, [i, ch])
          end
        else
          # We need unique_ids to distinguish between deleting and leaving
          # unaltered, so don't delete them
          if key != 'unique_id' && proposed_equals_history_value(new_props[key], prop_change['from'])
            new_props.delete key
          end
        end
        new_props
      end

      changes.inject(props_to_update, &remove_proc)
    end
  end

  def update_attributes_without_saving(hash)
    base_revision = hash.delete 'base_revision'
    base_changes = base_revision.present? ? get_intermediate_changes(base_revision) : []

    new_hash = if base_revision.present? && base_revision != self.rev
      remove_stale_properties(hash, base_revision)
    else
      hash
    end

    set_dirty_tracking(new_hash['histories'].blank?) do
      self.changed_attributes['_force_save'] = true
      super(merge_with_existing_attrs(self.attributes_as_update_hash, base_changes, new_hash.with_indifferent_access))
    end
  end
  alias :attributes= :update_attributes_without_saving

  # Converts self.attributes to a native ruby object, with all embedded objects
  # converted to hashes.
  def attributes_as_update_hash()
    convert_embedded_to_hash = ->(v) do
      case v
      when Array
        v.map(&convert_embedded_to_hash)
      when CouchRest::Model::Embeddable, Hash
        v.to_hash.inject({}) do |acc, (k,v)|
          if v.present?
            acc.merge({ k => convert_embedded_to_hash.call(v) })
          else
            acc
          end
        end
      else
        v
      end
    end

    h = self.attributes.to_hash.with_indifferent_access
    h['_attachments'] = self['_attachments']
    convert_embedded_to_hash.call(h)
  end

  # Get all the change objects since the given `revision`
  def get_intermediate_histories revision
    if self.histories.length > 1 && revision != self.rev
      histories = self.histories.reverse
                         .drop_while {|h| h.prev_revision != revision }
                         .reverse

      # Throw an exception until a legitimate reason for missing revisions is found
      if histories.length == 0
        raise Errors::RevisionNotFoundError.new("Unknown revision provided #{revision}")
      end

      histories
    else
      []
    end
  end

  def get_intermediate_changes revision
    get_intermediate_histories(revision).map {|h| h.changes }
  end

  protected

  def merge_histories(hs)
    hs.flatten
      .uniq {|h| h['unique_id'] }
      .sort_by {|h| h['datetime'] || DateTime.new }
      .reverse
  end

  # Take a set of properties and stick in all of the missing properties on the
  # current model (`existing`), including nested arrays and hashes, arbitrarily
  # deep.  This is necessary because we just do a top-level assignment to the
  # self.attributes object, so we have to fill in any nested hash or array
  # elemets so they don't get deleted.
  def merge_with_existing_attrs(existing, existing_changes, properties)
    if properties['histories'].present? && existing['histories'].present?
      properties['histories'] = merge_histories([properties, existing].map {|p| p.delete 'histories' })
    end

    changes_for_key = ->(changes_list, key) do
      changes_list.map {|ch| ch[key]}.reject {|ch| ch.nil? }
    end

    merger = ->(props, (k, existing_value, existing_changes_for_value)) do
      props = props.clone
      case props[k]
      when Array
        # Add all the new or existing elements
        props[k] = props[k].inject([]) do |acc, el|
          if el.include?('unique_id')
            nested_changes = changes_for_key.call(existing_changes_for_value, el['unique_id'])
            i = existing_value.index {|ev| ev['unique_id'] == el['unique_id'] }
            acc << if i.nil?
                     el
                   else
                     existing_value[i].inject({}) do |acc, (k, v)|
                       acc.merge(merger.call(el, [k, existing_value[i][k], changes_for_key.call(nested_changes, k)]))
                     end
                   end
          else
            acc << el
          end
        end

        # Now determine if we are deleting or keeping existing elements
        props[k] = existing_value.inject(props[k]) do |acc, el|
          if el.include?('unique_id')
            unless acc.index {|new| new['unique_id'] == el['unique_id'] }
              if nested_element_was_added_in_changes(el['unique_id'], existing_changes_for_value)
                acc << el
              end
            end
          else
            if array_value_was_added_in_changes(el, existing_changes_for_value) && !acc.include?(el)
              acc << el
            end
          end

          acc
        end

        props
      when Hash
        if existing_value.present?
          props[k] = existing_value.to_hash.inject(props[k]) do |acc, (sub_k,ev)|
            acc.merge(merger.call(acc, [sub_k, ev, changes_for_key.call(existing_changes_for_value, sub_k)]))
          end
        end
        props
      else
        props.reverse_merge({ k => existing_value })
      end
    end

    existing.map {|k,v| [k, v, changes_for_key.call(existing_changes, k)]}.inject(properties, &merger)
  end

  def nested_element_was_added_in_changes(unique_id, changes)
    changes.any? do |ch|
      # TODO: How to do this cleanly without all of this nesting?
      if ch.present?
        elem_ch = ch[unique_id]
        if elem_ch.present?
          unique_ch = elem_ch['unique_id']
          if unique_ch.present?
            unique_ch['from'].nil?
          end
        end
      end
    end
  end

  def array_value_was_added_in_changes(value, changes)
    changes.any? do |ch|
      !(ch['from'] || []).include?(value) && (ch['to'] || []).include?(value)
    end
  end

  def find_base_revision instances
    prev_revisions = instances.map {|i| i.histories.map {|h| h.prev_revision}.compact }
    # Ruby appears to maintain array order when doing set intersection,
    # otherwise this won't work
    prev_revisions.inject(:&)[0]
  end

  def proposed_equals_history_value(proposed_value, history_value)
    normed_history_value = normalize_history_value(history_value)
    normed_proposed_value = normalize_history_value(proposed_value)
    casted_proposed = if normed_proposed_value.present? && !normed_proposed_value.is_a?(normed_history_value.class)
                        case normed_history_value
                        when Date, DateTime, Time
                          normed_history_value.class.parse(normed_proposed_value)
                        when Integer
                          Integer(normed_proposed_value)
                        else
                          normed_proposed_value
                        end
                      else
                        normed_proposed_value
                      end

    casted_proposed == normed_history_value
  end
end

