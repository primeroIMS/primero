module Conflicts
  def save_as_conflicting_revision(instance, attrs)
    dup = instance.clone
    dup.last_updated_at = DateTime.now + 5.seconds
    dup.attributes = attrs

    if instance.histories[0].prev_revision
      dup['_rev'] = instance.histories[0].prev_revision
    else
      raise 'You must provide an instance with at least one update history'
    end

    dup.database.bulk_save([dup], {use_uuids: true, all_or_nothing: true})
  end
end
