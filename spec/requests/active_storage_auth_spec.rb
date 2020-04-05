# frozen_string_literal: true

require 'rails_helper'

describe ActiveStorageAuth do
  describe 'ActiveStorage direct upload' do
    let(:http_response) do
      checksum = Digest::MD5.base64digest('Hello')
      params = {
        blob: {
          filename: 'hello.txt', byte_size: 6,
          checksum: checksum, content_type: 'text/plain'
        }
      }
      post rails_direct_uploads_url, params: params
      response
    end

    it 'is forbiddden to unauthenticated users' do
      expect(http_response).to have_http_status(403)
    end

    it 'is forbidden to authenticated users. It is just plain forbidden.' do
      login_for_test

      expect(http_response).to have_http_status(403)
    end
  end

  describe 'ActiveStorage disk service update' do
    before(:each) do
      ActiveStorage::Current.host = 'http://example.com'
    end

    let(:http_response) do
      checksum = Digest::MD5.base64digest('Hello')
      blob = ActiveStorage::Blob.create_before_direct_upload!(
        filename: 'hello.txt', byte_size: 6,
        checksum: checksum, content_type: 'text/plain'
      )
      put blob.service_url_for_direct_upload,
          params: 'Hello', headers: { 'Content-Type' => 'text/plain' }
      response
    end

    it 'is forbidden to unauthenticated users' do
      expect(http_response).to have_http_status(403)
    end

    it 'is forbidden to authenticated users. Stuff is just forbidden.' do
      login_for_test

      expect(http_response).to have_http_status(403)
    end

    after(:each) do
      ActiveStorage::Current.reset
    end
  end

  describe 'Agency logo' do
    let(:agency) do
      agency = Agency.create!(
        unique_id: 'agency_1',
        agency_code: 'agency1',
        order: 1,
        logo_enabled: true,
        name: 'Agency 1'
      )
      logo_file = spec_resource_io('unicef.png')
      agency.logo_icon.attach(io: logo_file, filename: 'unicef.png')
      agency.save!
      agency
    end

    let(:agency_logo_url) do
      Rails.application.routes.url_helpers.rails_blob_path(agency.logo_icon, only_path: true)
    end

    it 'can be read via ActiveStorage by unauthenticated users' do
      get agency_logo_url
      follow_redirect!

      expect(response).to have_http_status(200)
      expect(response.content_type).to eq('image/png')
    end

    after(:each) do
      clean_data(Agency)
    end
  end

  describe 'Record attachments' do
    let(:role) do
      permissions = Permission.new(
        resource: Permission::CASE,
        actions: [
          Permission::READ, Permission::WRITE, Permission::CREATE
        ]
      )
      role = Role.new(permissions: [permissions])
      role.save(validate: false) && role
    end

    let(:user1) do
      user = User.new(user_name: 'user1', role: role)
      user.save(validate: false) && user
    end

    let(:user2) do
      user = User.new(user_name: 'user2', role: role)
      user.save(validate: false) && user
    end

    let(:case_with_photo) do
      child = Child.create(
        data: { name: 'Test', owned_by: 'user1' }
      )
      Attachment.new(
        record: child, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
      ).attach! && child
    end

    it 'cannot be read by unauthenticated users' do
      get case_with_photo.photo_url

      expect(response).to have_http_status(401)
    end

    it 'cannot be read by authenticated users that do not have access to the record of the attachment' do
      sign_in(user2)
      get case_with_photo.photo_url

      expect(response).to have_http_status(403)
    end

    it 'can only be read by authenticated users with access to the record of the attachment' do
      sign_in(user1)
      get case_with_photo.photo_url
      follow_redirect!

      expect(response).to have_http_status(200)
      expect(response.content_type).to eq('image/jpeg')
    end

    after(:each) do
      clean_data(Attachment, Child, User, Role)
    end
  end

  describe 'Export files' do
    let(:role) do
      permissions = Permission.new(
        resource: Permission::CASE,
        actions: [
          Permission::READ, Permission::WRITE,
          Permission::CREATE, Permission::EXPORT_CSV
        ]
      )
      role = Role.new(permissions: [permissions])
      role.save(validate: false) && role
    end

    let(:user1) do
      user = User.new(user_name: 'user1', role: role)
      user.save(validate: false) && user
    end

    let(:user2) do
      user = User.new(user_name: 'user2', role: role)
      user.save(validate: false) && user
    end

    let(:bulk_export) do
      export = BulkExport.create!(
        status: BulkExport::COMPLETE, record_type: 'case',
        format: 'csv', file_name: 'example.csv', owned_by: user1.user_name
      )
      export_file = spec_resource_io('example.csv.zip')
      export.export_file.attach(
        io: export_file,
        filename: 'example.csv.zip'
      )
      export.save! && export
    end

    let(:bulk_export_file_url) do
      Rails.application.routes.url_helpers.rails_blob_path(bulk_export.export_file, only_path: true)
    end

    it 'cannot be read by unauthenticated users' do
      get bulk_export_file_url

      expect(response).to have_http_status(401)
    end

    it 'cannot be read by authenticated users who did not generate this export' do
      sign_in(user2)
      get bulk_export_file_url

      expect(response).to have_http_status(403)
    end

    it 'can only be read by authenticated users who generated this export' do
      sign_in(user1)
      get bulk_export_file_url
      follow_redirect!

      expect(response).to have_http_status(200)
      expect(response.content_type).to eq('application/zip')
    end

    after(:each) do
      clean_data(BulkExport, User, Role)
    end
  end
end
