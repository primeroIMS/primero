# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::AttachmentsController, type: :request do
  before :each do
    @case = Child.create(data: { name: 'Test' })
  end

  let(:json) { JSON.parse(response.body) }

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
    end
  end

  after :each do
    clean_data(Attachment, Child)
  end
end