module Syncable
  extend ActiveSupport::Concern

  include Historical

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
    base_revision = find_base_revision(all_revs)

    resolved_attrs = all_revs.each_cons(2)
                             .inject({}) do |acc, (older, newer)|
      attrs = merge_with_existing_attrs(older.attributes_as_update_hash,
                                    older.remove_stale_properties(newer.attributes_as_update_hash, base_revision))
      newer.directly_set_attributes(attrs)
      newer.attributes_as_update_hash
    end

    Rails.logger.debug {"Resolved attributes are #{resolved_attrs}"}

    # Take the oldest and apply all of the new attributes to it
    (active, discards) = [all_revs[0], all_revs[1..-1]]

    active.directly_set_attributes(resolved_attrs)

    discards.each do |r|
      Rails.logger.debug {"Deleting revision #{r.rev} for #{r.id}"}
      r.destroy
    end

    Rails.logger.debug {"Saving Active Revision: #{rev} for #{id}"}
    active.save!
  end

  # Remove attributes that have been updated since `revision` to avoid
  # overwriting newer changes
  def remove_stale_properties(properties, revision)
    inter_changes = get_intermediate_histories(revision).map {|h| h.changes}

    inter_changes.inject(properties.clone) do |props_to_update, changes|
      remove_proc = lambda do |props, (key, prop_change)|
        new_props = props.clone
        case new_props[key]
        when Hash
          new_props[key] = new_props[key].keys.inject(new_props[key]) do |acc, k|
            if prop_change[k].present?
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
          if new_props[key] == prop_change['from'] && key != 'unique_id'
            new_props.delete key
          end
        end
        new_props
      end

      changes.inject(props_to_update, &remove_proc)
    end
  end

  def update_attributes_without_saving(hash)
    revision = hash.delete 'revision'

    new_hash = if revision.present? && revision != self.rev
      remove_stale_properties(hash, revision)
    else
      hash
    end

    super(merge_with_existing_attrs(self.attributes_as_update_hash, new_hash))
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

    h = self.attributes.to_hash
    h.delete 'histories'
    convert_embedded_to_hash.call(h)
  end

  protected

  # Get all the change objects since the given `revision`
  def get_intermediate_histories revision
    histories = self.histories.reverse
                       .drop_while {|h| h.prev_revision != revision }
                       .reverse

    # Throw an exception until a legitimate reason for missing revisions is found
    if histories.length == 0
      raise Errors::RevisionNotFoundError.new("Unknown revision provided #{revision}")
    end

    histories
  end

  # Take a set of properties and stick in all of the missing properties on the
  # current model (`existing`), including nested arrays and hashes, arbitrarily
  # deep.  This is necessary because we just do a top-level assignment to the
  # self.attributes object, so we have to fill in any nested hash or array
  # elemets so they don't get deleted.  Nested elements are only deleted when
  # set explicitly to nil.
  def merge_with_existing_attrs(existing, properties)
    # Avoid merging histories, we'll handle that separately
    properties.delete 'histories'

    merger = ->(props, (k,existing_value)) do
      props = props.clone
      case props[k]
      when Array
        props[k] = props[k].inject([]) do |acc, el|
          if el.include?('unique_id')
            i = existing_value.index {|ev| ev['unique_id'] == el['unique_id'] }
            acc << (i.nil? ? el : existing_value[i].to_hash.merge(el))
          else
            acc << el
          end
        end
        props
      when Hash
        if existing_value.present?
          props[k] = existing_value.to_hash.inject(props[k]) do |acc, (sub_k,ev)|
            acc.merge(merger.call(acc, [sub_k, ev]))
          end
        end
        props
      else
        props
      end
    end

    existing.inject(properties, &merger)
  end

  def find_base_revision instances
    prev_revisions = instances.map {|i| i.histories.map {|h| h.prev_revision}.compact }
    # Ruby appears to maintain array order when doing set intersection,
    # otherwise this won't work
    prev_revisions.inject(:&)[0]
  end
end

