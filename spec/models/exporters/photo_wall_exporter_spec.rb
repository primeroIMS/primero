# frozen_string_literal: true

require 'rails_helper'

module Exporters
  describe PhotoWallExporter do
    before :each do
      clean_data(Child, PrimeroModule, Role, User)
      primero_module = PrimeroModule.new(name: 'CP')
      primero_module.save(validate: false)
      permissions = Permission.new(
        resource: Permission::CASE, actions: [Permission::READ]
      )
      role = Role.new(
        is_manager: false, modules: [primero_module],
        permissions: [permissions]
      )
      role.save(validate: false)
      @user = User.new(user_name: 'user1', role: role)
      @user.save(validate: false)
      @child_a = Child.new_with_user(@user, name: 'Test_1')
      @child_a.save!
      @child_b = Child.new_with_user(@user, name: 'Test_2')
      @child_b.save!
      @child_c = Child.new_with_user(@user, name: 'Test_3')
      @child_c.save!
      @records = [@child_a, @child_b, @child_c]
      Attachment.new(
        record: @child_a, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg'), date: Date.new(2020, 1, 1)
      ).attach!
      Attachment.new(
        record: @child_b, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'unicef.png', attachment: attachment_base64('unicef.png'), date: Date.new(2020, 2, 1)
      ).attach!
    end

    it 'Getting the images of the children for the exporter' do
      storage_disk_service = ActiveStorage::Service::DiskService.new(root: Rails.root.to_s + '/storage/')
      pdf_spy = spy('Prawn::Document')
      expect(pdf_spy).to receive(:image).with(
        storage_disk_service.send(:path_for, @child_a.photo.file.blob.key), any_args
      )
      expect(pdf_spy).to receive(:image).with(
        storage_disk_service.send(:path_for, @child_b.photo.file.blob.key), any_args
      )
      expect(pdf_spy).to receive(:image).with("#{Rails.root}/app/assets/images/no_photo_clip.jpg", any_args)
      data = PhotoWallExporter.new(nil, pdf_spy).export(@records, @user)
      expect(data.present?).to be true
    end
  end
end
