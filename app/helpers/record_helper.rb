module RecordHelper
  include RapidFTR::Model
  include RapidFTR::Clock

  def set_creation_fields_for(user)
    self['created_by'] = user.try(:user_name)
    self['created_organisation'] = user.try(:organisation)
    self['created_at'] ||= RapidFTR::Clock.current_formatted_time
    self['posted_at'] = RapidFTR::Clock.current_formatted_time
  end

  def update_organisation
    self['created_organisation'] ||= created_by_user.try(:organisation)
  end

  def created_by_user
    User.find_by_user_name self['created_by'] unless self['created_by'].to_s.empty?
  end

  def set_updated_fields_for(user_name)
    self['last_updated_by'] = user_name
    self['last_updated_at'] = RapidFTR::Clock.current_formatted_time
  end

  def last_updated_by
    self['last_updated_by'] || self['created_by']
  end

  def last_updated_at
    self['last_updated_at'] || self['created_at']
  end

  def update_history
    if field_name_changes.any?
      changes = changes_for(field_name_changes)
      (add_to_history(changes) unless (!self['histories'].empty? && (self['histories'].last["changes"].to_s.include? changes.to_s)))
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

  def update_with_attachments(params, user)
    self['last_updated_by_full_name'] = user.full_name
    new_photo = params[:child].delete("photo")
    new_photo = (params[:child][:photo] || "") if new_photo.nil?
    new_audio = params[:child].delete("audio")
    delete_child_audio = params["delete_child_audio"].present?
    update_properties_with_user_name(user.user_name, new_photo, params["delete_child_photo"], new_audio, delete_child_audio, params[:child])
  end

  def update_properties_with_user_name(user_name, new_photo, photo_names, new_audio, delete_child_audio, properties)
    update_properties(properties, user_name)
    self.delete_photos(photo_names)
    self.update_photo_keys
    self.photo = new_photo
    self.delete_audio if delete_child_audio
    self.audio = new_audio
  end

  def field_definitions
    parent_form = self.class.parent_form
    @field_definitions ||= FormSection.all_visible_form_fields(parent_form)
  end

  def add_updated_fields_attr(props)
    self['updated_fields'] = determine_changing_fields(props)
  end

  def determine_changing_fields(props)
    self.to_hash.select do |key, value|
      props.include?(key) ? (props[key] != value) : false
    end
  end

  def update_properties(properties, user_name)
    add_updated_fields_attr(properties)
    properties['histories'] = remove_newly_created_media_history(properties['histories'])
    properties['record_state'] = "Valid record" if properties['record_state'].blank?
    should_update = self["last_updated_at"] && properties["last_updated_at"] ? (DateTime.parse(properties['last_updated_at']) > DateTime.parse(self['last_updated_at'])) : true
    if should_update
      attributes_to_update = {}
      properties.each_pair do |name, value|
        if name == "histories"
          merge_histories(properties['histories'])
        else
          attributes_to_update[name] = value unless value == nil
        end
        attributes_to_update["#{name}_at"] = RapidFTR::Clock.current_formatted_time if ([:flag, :reunited].include?(name.to_sym) && value.to_s == 'true')
      end
      self.set_updated_fields_for user_name
      self.attributes = attributes_to_update
    else
      merge_histories(properties['histories'])
    end
  end

  def merge_conflicts(properties)
    props_to_update = properties.clone
    if !self.updated_fields.nil?
      determine_changing_fields(properties).each do |key,value|
        if self.updated_fields[key] == props_to_update[key]
          props_to_update.delete key
        end
      end
    end

    props_to_update
  end

  protected

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

  def model_field_names
    field_definitions.map { |f| f.name }
  end

  def field_name_changes
    other_fields = [
        "flag", "flag_message",
        "reunited", "reunited_message",
        "investigated", "investigated_message",
        "duplicate", "duplicate_of"
    ]
    all_fields = model_field_names + other_fields
    all_fields.select { |field_name| changed_field?(field_name) }
  end

  def changes_for(field_names)
    field_names.inject({}) do |changes, field_name|
      changes.merge(field_name => {
          'from' => original_data[field_name],
          'to' => self[field_name]
      })
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

  def is_filled_in? field
    !(self[field.name].nil? || self[field.name] == field.default_value || self[field.name].to_s.empty?)
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

  def remove_newly_created_media_history(given_histories)
    (given_histories || []).delete_if do |history|
      (history["changes"]["current_photo_key"].present? and history["changes"]["current_photo_key"]["to"].present? and !history["changes"]["current_photo_key"]["to"].start_with?("photo-")) ||
          (history["changes"]["recorded_audio"].present? and history["changes"]["recorded_audio"]["to"].present? and !history["changes"]["recorded_audio"]["to"].start_with?("audio-"))
    end
    given_histories
  end

end
