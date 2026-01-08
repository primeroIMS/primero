# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::AttachmentsController, type: :request do
  include ActiveJob::TestHelper
  before :each do
    @case = Child.create(data: { name: 'Test', owned_by: 'faketest' })
    @field = Field.create!(
      name: 'consent_signature',
      display_name: 'Consent Signature',
      type: Field::SIGNATURE_FIELD
    )
    @field2 = Field.create!(
      name: 'photos',
      display_name: 'Photo Field',
      type: Field::PHOTO_UPLOAD_BOX
    )
  end

  let(:json) { JSON.parse(response.body) }
  let(:audit_params) { enqueued_jobs.find { |job| job[:job] == AuditLogJob }[:args].first }
  let(:records_with_photo) do
    PhoneticSearchService.search(
      Child, filters: [SearchFilters::BooleanValue.new(field_name: 'has_photo', value: true)]
    ).records
  end

  describe 'GET /api/v2/:record/:record_id/attachments/:id' do
    let(:attachment) do
      attachment = Attachment.new(
        record: @case, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
      )
      attachment.attach!
      attachment
    end

    let(:file_content) { File.read(Rails.root.join('spec/resources/jorge.jpg')) }

    # before do
    #   allow_any_instance_of(ActiveStorage::Blob).to receive(:download).and_return(file_content)
    # end

    context 'when user is authenticated' do
      before :each do
        login_for_test({ permitted_field_names: [@field2.name] }) 
      end

      it 'returns the attached file' do
        get "/api/v2/cases/#{@case.id}/attachments/#{attachment.id}"

        expect(response).to have_http_status(:success)
        expect(response.body).to eq(attachment.file.download)
      end

      it 'sets the correct content type' do
        get "/api/v2/cases/#{@case.id}/attachments/#{attachment.id}"

        expect(response.content_type).to eq(attachment.file.content_type)
      end

      it 'sets inline disposition' do
        get "/api/v2/cases/#{@case.id}/attachments/#{attachment.id}"

        expect(response.headers['Content-Disposition']).to include('inline')
      end

      it 'sets the correct filename' do
        get "/api/v2/cases/#{@case.id}/attachments/#{attachment.id}"

        expect(response.headers['Content-Disposition']).to include('jorge.jpg')
      end
    end

    context 'when user is unauthenticated' do
      it 'returns a 401 Unauthorized status' do
        get "/api/v2/cases/#{@case.id}/attachments/#{attachment.file.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when user is unauthorized to access the record' do
      before do
        allow_any_instance_of(PermittedFieldService).to(
          receive(:permitted_field_names).and_return([])
        )
        login_for_test
      end

      it 'returns a 403 Forbidden status' do
        get "/api/v2/cases/#{@case.id}/attachments/#{attachment.id}"
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'when blob does not exist' do
      before { login_for_test }

      it 'raises ActiveRecord::RecordNotFound' do
        get "/api/v2/cases/#{@case.id}/attachments/invalid-id"
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'POST /api/v2/:record/:id/attachments', search: true do
    context 'when attachment_type is signature' do
      it 'initializes a Signature model' do
        login_for_test({ permitted_field_names: [@field.name] })

        params = {
          data: {
            field_name: 'consent_signature',
            attachment_type: Field::SIGNATURE_FIELD,
            file_name: 'signature.png',
            attachment: attachment_base64('sample.png'),
            signature_provided_by: 'John Doe'
          }
        }

        expect(Signature).to receive(:new_with_user).and_call_original

        post "/api/v2/cases/#{@case.id}/attachments", params: params
        puts response.body
        expect(response).to have_http_status(200)
      end
    end

    context 'when attachment_type is not signature' do
      it 'initializes an Attachment model' do
        login_for_test({ permitted_field_names: [Attachable::PHOTOS_FIELD_NAME] })

        params = {
          data: {
            field_name: 'photos',
            attachment_type: Attachment::IMAGE,
            file_name: 'photo.jpg',
            attachment: attachment_base64('jorge.jpg')
          }
        }

        expect(Attachment).to receive(:new).and_call_original
        expect(Signature).not_to receive(:new_with_user)

        post "/api/v2/cases/#{@case.id}/attachments", params: params

        expect(response).to have_http_status(200)
      end
    end

    it 'attaches a file to an existing record and sets has_photo to true' do
      login_for_test({ permitted_field_names: [Attachable::PHOTOS_FIELD_NAME] })

      params = {
        data: {
          field_name: Attachable::PHOTOS_FIELD_NAME, attachment_type: 'image',
          file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
        }
      }
      post("/api/v2/cases/#{@case.id}/attachments", params:)
      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq('jorge.jpg')
      expect(json['data']['record']['id']).to eq(@case.id)
      expect(records_with_photo.size).to eq(1)
      expect(records_with_photo.first.id).to eq(@case.id)
      @case.reload
      expect(@case.has_photo).to eq(true)
      expect(audit_params['action']).to eq('attach')
    end

    context 'when a user does not have access to a record' do
      context 'and has the VIEW_PHOTO permission' do
        it 'it refuses to attach a file to an existing record' do
          login_for_test(
            {
              user_name: 'otheruser',
              group_permission: Permission::SELF,
              permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::VIEW_PHOTO])],
              permitted_field_names: [Attachable::PHOTOS_FIELD_NAME]
            }
          )

          params = {
            data: {
              field_name: Attachable::PHOTOS_FIELD_NAME, attachment_type: 'image',
              file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
            }
          }
          post("/api/v2/cases/#{@case.id}/attachments", params:)
          expect(response).to have_http_status(403)
        end
      end
    end

    context '`photos` is a forbidden field' do
      before :each do
        allow_any_instance_of(PermittedFieldService).to(
          receive(:permitted_field_names).and_return([])
        )
      end

      it 'refuses to attach a file' do
        login_for_test
        params = {
          data: {
            field_name: 'photos', attachment_type: 'image',
            file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
          }
        }
        post("/api/v2/cases/#{@case.id}/attachments", params:)

        expect(response).to have_http_status(403)
        expect(json['errors'][0]['status']).to eq(403)
        expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/attachments")
        expect(json['errors'][0]['message']).to eq('Forbidden')
      end
    end
  end

  describe 'PATCH /api/v2/:record/:id/attachments', search: true do
    let(:attachment) do
      Attachment.new(
        record: @case, field_name: Attachable::DOCUMENTS_FIELD_NAME, attachment_type: Attachment::DOCUMENT,
        file_name: 'dummy.pdf', attachment: attachment_base64('dummy.pdf'), description: 'Document Description',
        is_current: true, date: '2020-02-15', comments: 'Some comments'
      )
    end

    before { attachment.attach! }

    it 'updates the metadata fields for a document' do
      login_for_test({ permitted_field_names: [Attachable::DOCUMENTS_FIELD_NAME] })

      params = {
        data: { description: 'New Description', is_current: false, date: '2020-02-16', comments: 'Other comments' }
      }

      patch("/api/v2/cases/#{@case.id}/attachments/#{attachment.id}", params:)

      expect(response).to have_http_status(200)
      expect(json['data']['description']).to eq('New Description')
      expect(json['data']['is_current']).to eq(false)
      expect(json['data']['date']).to eq('2020-02-16')
      expect(json['data']['comments']).to eq('Other comments')
    end

    it 'refuses to update the attached document' do
      login_for_test({ permitted_field_names: [Attachable::DOCUMENTS_FIELD_NAME] })

      params = {
        data: { attachment: attachment_base64('hxl_location_sample.csv') }
      }

      patch("/api/v2/cases/#{@case.id}/attachments/#{attachment.id}", params:)

      expect(response).to have_http_status(422)
      expect(json['errors'][0]['status']).to eq(422)
      expect(json['errors'][0]['detail']).to eq(%w[attachment])
      expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/attachments/#{attachment.id}")
      expect(json['errors'][0]['message']).to eq('Invalid Attachment JSON')
    end
  end

  describe 'DELETE /api/v2/:record/:id/attachment/:attachment-id' do
    let(:attachment) do
      attachment = Attachment.new(
        record: @case, field_name: 'photos', attachment_type: Attachment::IMAGE,
        file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
      )
      attachment.attach!
      attachment
    end

    before { attachment }

    it 'removes an attached record and updates the has_photo field' do
      login_for_test({ permitted_field_names: [Attachable::PHOTOS_FIELD_NAME] })

      delete "/api/v2/cases/#{@case.id}/attachments/#{attachment.id}"

      expect(response).to have_http_status(204)
      expect(@case.attachments.count).to eq(0)
      @case.reload
      expect(@case.has_photo).to eq(false)
      expect(audit_params['action']).to eq('detach')
    end

    context '`photos` is a forbidden field' do
      before :each do
        allow_any_instance_of(PermittedFieldService).to(
          receive(:permitted_field_names).and_return([])
        )
      end

      it 'removes an attached record' do
        login_for_test
        delete "/api/v2/cases/#{@case.id}/attachments/#{attachment.id}"

        expect(response).to have_http_status(403)
        expect(json['errors'][0]['status']).to eq(403)
        expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/attachments/#{attachment.id}")
        expect(json['errors'][0]['message']).to eq('Forbidden')
        expect(@case.attachments.count).to eq(1)
      end
    end

    context 'when a user does not have access to a record' do
      context 'and has the VIEW_PHOTO permission' do
        it 'it refuses to remove an attached record' do
          login_for_test(
            {
              user_name: 'otheruser',
              group_permission: Permission::SELF,
              permissions: [Permission.new(resource: Permission::CASE, actions: [Permission::VIEW_PHOTO])],
              permitted_field_names: [Attachable::PHOTOS_FIELD_NAME]
            }
          )
          delete "/api/v2/cases/#{@case.id}/attachments/#{attachment.id}"

          expect(response).to have_http_status(403)
        end
      end
    end
  end

  after :each do
    clear_enqueued_jobs
    clean_data(Attachment, Child, Field, FormSection)
  end
end
