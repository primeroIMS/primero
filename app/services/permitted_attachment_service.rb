# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A service to determine if an attachment is permitted for a user
class PermittedAttachmentService
  PREVIEW_TYPES = [Attachment::IMAGE, Attachment::AUDIO].freeze

  attr_accessor :user, :write, :attachment, :permitted_form_fields_service

  class << self
    def permitted_to_read?(user, attachment, permitted_form_fields_service)
      instance = new(user, attachment, permitted_form_fields_service)
      instance.permitted? || instance.permitted_to_view? || instance.permitted_to_preview?
    end

    def permitted_to_write?(user, attachment, permitted_form_fields_service)
      instance = new(user, attachment, permitted_form_fields_service, true)
      instance.permitted?
    end
  end

  def initialize(user, attachment, permitted_form_fields_service, write = false)
    self.user = user
    self.attachment = attachment
    self.write = write
    self.permitted_form_fields_service = permitted_form_fields_service || PermittedFormFieldsService.instance
  end

  def permitted?
    permitted_field_names.include?(attachment.field_name) && permitted_to_access_record?
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

    previewable_type? && user.can?(:search_owned_by_others, attachment.record.class) && (
      user.can_preview?(attachment.record.class) || permitted_to_view_record_list_photo?
    )
  end

  def permitted_to_view_record_list_photo?
    attachment.photo? && user.can?(:view_photo, attachment.record.class)
  end

  def previewable_type?
    PREVIEW_TYPES.include?(attachment.attachment_type)
  end

  def permitted_field_names
    @permitted_field_names ||= permitted_form_fields_service.permitted_field_names(
      authorized_roles,
      PrimeroModelService.to_name(attachment.record_type),
      attachment.record&.module_id,
      write ? 'create' : 'read'
    )
  end

  def authorized_roles
    @authorized_roles ||= user.authorized_roles_for_record(attachment.record)
  end

  def permitted_to_access_record?
    @permitted_to_access_record ||= user.permitted_to_access_record?(attachment.record)
  end
end
