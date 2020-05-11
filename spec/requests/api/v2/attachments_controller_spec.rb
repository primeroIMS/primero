# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::AttachmentsController, type: :request do
  include ActiveJob::TestHelper
  before :each do
    allow_any_instance_of(PermittedFieldService).to(
      receive(:permitted_field_names).and_return(%w[photos])
    )
    @case = Child.create(data: { name: 'Test' })
  end

  let(:json) { JSON.parse(response.body) }
  let(:audit_params) { enqueued_jobs.select { |job| job.values.first == AuditLogJob }.first[:args].first }

  describe 'POST /api/v2/:record/:id/attachments' do
    it 'attaches a file to an existing record' do
      login_for_test
      params = {
        data: {
          field_name: 'photos', attachment_type: 'image',
          file_name: 'jorge.jpg', attachment: attachment_base64('jorge.jpg')
        }
      }
      post "/api/v2/cases/#{@case.id}/attachments", params: params

      expect(response).to have_http_status(200)
      expect(json['data']['file_name']).to eq('jorge.jpg')
      expect(json['data']['record']['id']).to eq(@case.id)

      expect(audit_params['action']).to eq('attach')
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
        post "/api/v2/cases/#{@case.id}/attachments", params: params

        expect(response).to have_http_status(403)
        expect(json['errors'][0]['status']).to eq(403)
        expect(json['errors'][0]['resource']).to eq("/api/v2/cases/#{@case.id}/attachments")
        expect(json['errors'][0]['message']).to eq('Forbidden')
      end
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

    it 'removes an attached record' do
      login_for_test
      delete "/api/v2/cases/#{@case.id}/attachments/#{attachment.id}"

      expect(response).to have_http_status(204)
      expect(@case.attachments.count).to eq(0)

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
  end

  after :each do
    clear_enqueued_jobs
    clean_data(Attachment, Child)
  end
end