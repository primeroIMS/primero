# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A service to determine if an attachment is permitted for a user
class PermittedAttachmentService
  attr_accessor :user, :write, :attachment, :permitted_form_fields_service

  def initialize(user, attachment, permitted_form_fields_service, write = false)
    self.user = user
    self.attachment = attachment
    self.write = write
    self.permitted_form_fields_service = permitted_form_fields_service || PermittedFormFieldsService.instance
  end

  def permitted_to_access?
    permitted_to_access_record? && permitted_field_names.include?(attachment.field_name)
  end

  def permitted_to_view?
    permitted_to_access_record? && (
      permitted_to_view_potential_match? || permitted_to_view_record_list_photo?
    )
  end

  def permitted_to_view_potential_match?
    (attachment.attachment_type == Attachment::IMAGE && user.can?(:view_photo, PotentialMatch)) ||
      (attachment.attachment_type == Attachment::AUDIO && user.can?(:view_audio, PotentialMatch))
  end

  def permitted_to_preview?
    # TODO: To preview an attachment a user needs to have Permission::DISPLAY_VIEW_PAGE
    # the fields displayed in the preview are those where show_on_minify_form: true.
    # Should we check the if the attachment field is permitted and if the field is show_on_minify_form: true?

    user.can?(:search_owned_by_others, attachment.record.class) && (
      permitted_to_preview_attachment? || permitted_to_view_record_list_photo?
    )
  end

  def permitted_to_preview_attachment?
    user.can_preview?(attachment.record.class) &&
      [Attachment::IMAGE, Attachment::AUDIO].include?(attachment.attachment_type) &&
      permitted_field_names.include?(attachment.field_name)
  end

  def permitted_to_view_record_list_photo?
    attachment.attachment_type == Attachment::IMAGE && user.can?(:view_photo, attachment.record.class) &&
      permitted_to_access_photos?
  end

  def permitted_to_access_photos?
    permitted_field_names.include?(Attachable::PHOTOS_FIELD_NAME)
  end

  def permitted_field_names
    @permitted_field_names ||= permitted_form_fields_service.permitted_field_names(
      authorized_roles,
      Record.map_name(attachment.record_type),
      write
    )
  end

  def authorized_roles
    @authorized_roles ||= user.authorized_roles_for_record(attachment.record)
  end

  def permitted_to_access_record?
    @permitted_to_access_record ||= user.permitted_to_access_record?(attachment.record)
  end
end
