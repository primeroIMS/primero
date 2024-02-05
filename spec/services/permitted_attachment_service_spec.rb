# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe PermittedAttachmentService, search: true do
  let(:form_sections) do
    [
      FormSection.create!(
        unique_id: 'form1', name: 'Form 1', parent_form: 'case', form_group_id: 'form1', fields: [
          Field.new(name: Attachable::PHOTOS_FIELD_NAME, display_name: 'Photos')
        ]
      )
    ]
  end

  let(:permission) { Permission.new(resource: Permission::CASE, actions: [Permission::READ]) }

  let(:role_with_permission) do
    role = Role.new_with_properties(
      name: 'read_attachment', permissions: [permission], form_section_read_write: { form1: 'r' }
    )
    role.save!
    role
  end

  let(:role_without_form_permissions) do
    role = Role.new_with_properties(name: 'no_attachment', permissions: [permission])
    role.save!
    role
  end

  let(:user) do
    user = create(:user)
    user.role = role_with_permission
    user
  end

  let(:record_with_access) do
    child = Child.new_with_user(user, { name: 'Child 1', age: 5, sex: 'male' })
    child.save!
    child
  end

  let(:record_without_access) do
    Child.create!(data: { name: 'Child 2', age: 8, sex: 'female' })
  end

  let(:attachment_with_access) do
    attachment = Attachment.new(
      record: record_with_access, field_name: Attachable::PHOTOS_FIELD_NAME, attachment_type: Attachment::IMAGE,
      file_name: 'unicef.png', attachment: attachment_base64('unicef.png'), date: Date.new(2020, 2, 1)
    )
    attachment.attach!
    attachment
  end

  let(:document_attachment) do
    Attachment.new(
      record: record_without_access, field_name: Attachable::DOCUMENTS_FIELD_NAME, file_name: 'dummy.pdf',
      attachment_type: Attachment::DOCUMENT, attachment: attachment_base64('dummy.pdf')
    )
  end

  let(:audio_attachment) do
    Attachment.new(
      record: record_without_access, field_name: Attachable::AUDIOS_FIELD_NAME, attachment_type: Attachment::AUDIO,
      file_name: 'sample.mp3', attachment: attachment_base64('sample.mp3')
    )
  end

  let(:attachment_without_access) do
    attachment = Attachment.new(
      record: record_without_access, field_name: Attachable::PHOTOS_FIELD_NAME, attachment_type: Attachment::IMAGE,
      file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg'), date: Date.new(2020, 2, 1)
    )
    attachment.attach!
    attachment
  end

  before do
    clean_data(
      User, Role, PrimeroModule, PrimeroProgram,
      Child, Field, FormSection, Agency, UserGroup
    )
    form_sections
  end

  describe '#permitted_to_access?' do
    context 'when a user has access to the record' do
      it 'returns true if a user has access to the field_name' do
        permitted_attachment_service = PermittedAttachmentService.new(user, attachment_with_access, nil)
        expect(permitted_attachment_service.permitted_to_access?).to be(true)
      end

      it 'returns false if a user does not have access to the field_name' do
        user.role = role_without_form_permissions
        user.save!
        permitted_attachment_service = PermittedAttachmentService.new(user, attachment_with_access, nil)
        expect(permitted_attachment_service.permitted_to_access?).to be(false)
      end
    end

    context 'when a user does not have access to the record' do
      it 'returns false' do
        permitted_attachment_service = PermittedAttachmentService.new(user, attachment_without_access, nil)
        expect(permitted_attachment_service.permitted_to_access?).to be(false)
      end
    end
  end

  describe '#permitted_to_view?' do
    context 'when a user does not have access to the attachment field' do
      context 'and a user has access to a record' do
        it 'returns true if can view potential matches' do
          role_without_form_permissions.permissions = [
            Permission.new(resource: Permission::POTENTIAL_MATCH, actions: [Permission::VIEW_PHOTO])
          ]
          role_without_form_permissions.save!
          user.role = role_without_form_permissions
          user.save!
          permitted_attachment_service = PermittedAttachmentService.new(user, attachment_with_access, nil)

          expect(permitted_attachment_service.permitted_to_view?).to be(true)
        end

        it 'returns true if can view photos in the case list and have access to the photo field' do
          role_with_permission.permissions = [
            Permission.new(resource: Permission::CASE, actions: [Permission::VIEW_PHOTO])
          ]
          role_with_permission.save!
          user.role = role_with_permission
          user.save!
          permitted_attachment_service = PermittedAttachmentService.new(user, attachment_with_access, nil)

          expect(permitted_attachment_service.permitted_to_view?).to be(true)
        end

        it 'returns false if does not have appropiate permissions' do
          user.role = role_without_form_permissions
          user.save!
          permitted_attachment_service = PermittedAttachmentService.new(user, attachment_with_access, nil)

          expect(permitted_attachment_service.permitted_to_view?).to be(false)
        end
      end

      it 'returns false if a user does not have access to a record' do
        user.role = role_without_form_permissions
        user.save!
        permitted_attachment_service = PermittedAttachmentService.new(user, attachment_without_access, nil)

        expect(permitted_attachment_service.permitted_to_view?).to be(false)
      end
    end
  end

  describe '#permitted_to_view_potential_match?' do
    context 'when a user have access to photos in PotentialMatch' do
      it 'returns true if the attachment is an image' do
        role_without_form_permissions.permissions = [
          Permission.new(resource: Permission::POTENTIAL_MATCH, actions: [Permission::VIEW_PHOTO])
        ]
        role_without_form_permissions.save!
        user.role = role_without_form_permissions
        user.save!
        permitted_attachment_service = PermittedAttachmentService.new(user, attachment_without_access, nil)

        expect(permitted_attachment_service.permitted_to_view_potential_match?).to be(true)
      end

      it 'returns false if the attachment is not an image' do
        role_without_form_permissions.permissions = [
          Permission.new(resource: Permission::POTENTIAL_MATCH, actions: [Permission::VIEW_PHOTO])
        ]
        role_without_form_permissions.save!
        user.role = role_without_form_permissions
        user.save!
        permitted_attachment_service = PermittedAttachmentService.new(user, audio_attachment, nil)

        expect(permitted_attachment_service.permitted_to_view_potential_match?).to be(false)
      end
    end

    context 'when a user have access to audio in PotentialMatch' do
      it 'returns true if the attachment is an audio' do
        role_without_form_permissions.permissions = [
          Permission.new(resource: Permission::POTENTIAL_MATCH, actions: [Permission::VIEW_AUDIO])
        ]
        role_without_form_permissions.save!
        user.role = role_without_form_permissions
        user.save!
        permitted_attachment_service = PermittedAttachmentService.new(user, audio_attachment, nil)

        expect(permitted_attachment_service.permitted_to_view_potential_match?).to be(true)
      end

      it 'returns false if the attachment is not an audio' do
        role_without_form_permissions.permissions = [
          Permission.new(resource: Permission::POTENTIAL_MATCH, actions: [Permission::VIEW_AUDIO])
        ]
        role_without_form_permissions.save!
        user.role = role_without_form_permissions
        user.save!
        permitted_attachment_service = PermittedAttachmentService.new(user, attachment_without_access, nil)

        expect(permitted_attachment_service.permitted_to_view_potential_match?).to be(false)
      end
    end
  end

  describe '#permitted_to_preview?' do
    context 'when a user can access the attachment field' do
      it 'returns true if the attachment is an image' do
        role_with_permission.permissions = [
          Permission.new(
            resource: Permission::CASE, actions: [Permission::DISPLAY_VIEW_PAGE, Permission::SEARCH_OWNED_BY_OTHERS]
          )
        ]
        role_with_permission.save!
        user.role = role_with_permission
        user.save!
        permitted_attachment_service = PermittedAttachmentService.new(user, attachment_without_access, nil)

        expect(permitted_attachment_service.permitted_to_preview?).to be(true)
      end

      it 'returns false if the attachment is not an audio/image' do
        role_with_permission.permissions = [
          Permission.new(resource: Permission::CASE, actions: [Permission::DISPLAY_VIEW_PAGE])
        ]
        role_with_permission.save!
        user.role = role_with_permission
        user.save!
        permitted_attachment_service = PermittedAttachmentService.new(user, document_attachment, nil)

        expect(permitted_attachment_service.permitted_to_preview?).to be(false)
      end
    end
  end

  describe '#permitted_to_view_record_list_photo?' do
    it 'returns true if the attachment is an audio/image and can access the photos field' do
      role_with_permission.permissions = [
        Permission.new(resource: Permission::CASE, actions: [Permission::VIEW_PHOTO])
      ]
      role_with_permission.save!
      user.role = role_with_permission
      user.save!
      permitted_attachment_service = PermittedAttachmentService.new(user, attachment_without_access, nil)

      expect(permitted_attachment_service.permitted_to_view_record_list_photo?).to be(true)
    end
  end

  describe '#permitted_to_access_photos?' do
    it 'returns true if a user can access the photos field' do
      role_with_permission.permissions = [
        Permission.new(resource: Permission::CASE, actions: [Permission::VIEW_PHOTO])
      ]
      role_with_permission.save!
      user.role = role_with_permission
      user.save!
      permitted_attachment_service = PermittedAttachmentService.new(user, attachment_without_access, nil)

      expect(permitted_attachment_service.permitted_to_access_photos?).to be(true)
    end
  end

  after do
    clean_data(
      User, Role, PrimeroModule, PrimeroProgram,
      Child, Field, FormSection, Agency, UserGroup
    )
  end
end
