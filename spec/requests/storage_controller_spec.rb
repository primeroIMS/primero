# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe 'StorageController', type: :request do

  before :each do
    clean_data(Child, Attachment)
  end

  describe 'GET /storage/:id' do
    let(:attachment) do
      Attachment.create!(
        record: create(:child),
        field_name: 'photo',
        attachment_type: Attachment::IMAGE,
        file_name: 'test_image.png',
        content_type: 'image/png',
        attachment: Base64.encode64(File.read(Rails.root.join('spec/resources/jorge.jpg')))
      ).tap(&:attach!)
      end

    let(:file_content) { File.read(Rails.root.join('spec/resources/jorge.jpg')) }

    context 'when user is authenticated' do
      before do
        login_for_test 
        allow_any_instance_of(ActiveStorage::Blob).to receive(:download).and_return(file_content)
      end

      it 'returns the attached file' do
        get "/storage/#{attachment.file.id}"

        expect(response).to have_http_status(:success)
        expect(response.body).to eq(attachment.file.download)
      end

      it 'sets the correct content type' do
        get storage_file_path(attachment.file.id)

        expect(response.content_type).to eq(attachment.file.content_type)
      end

      it 'sets inline disposition' do
        get storage_file_path(attachment.file.id)

        expect(response.headers['Content-Disposition']).to include('inline')
      end

      it 'sets the correct filename' do
        get storage_file_path(attachment.file.id)

        expect(response.headers['Content-Disposition']).to include('test_image.png')
      end
    end

    context 'when user is unauthenticated' do
      it 'returns a 401 Unauthorized status' do
        get "/storage/#{attachment.file.id}"
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when blob does not exist' do
      before { login_for_test }

      it 'raises ActiveRecord::RecordNotFound' do
        get storage_file_path('invalid-id')
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end