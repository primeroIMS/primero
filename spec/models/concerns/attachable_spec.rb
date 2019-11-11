require 'rails_helper'

describe Attachable do
  before :each do
    Child.delete_all
    AttachmentImage.delete_all
  end

  let(:child) { create(:child) }

  describe 'photos' do
    describe 'attachment' do
      before do
       child.photos.build(FilesTestHelper.png)
      end

      context 'when attach images with build' do

        it 'should have a image as attach ' do
          expect(child.photos.first.image).to be_attached
        end

        it 'should save' do
          expect(child.save).to be_truthy
        end

      end

      context 'when attach images with attach' do

        it 'should attach a photo' do
          child.attach(FilesTestHelper.png_as_a_parameter)
          expect(child.photos.first.image).to be_attached
        end
      end
    end

    context 'validation' do

      it 'should be invalid if the file is too large' do
        child.attach(FilesTestHelper.large_photo_as_a_parameter)
        expect(child).not_to be_valid
      end

      it 'should be invalid if the file is not a images' do
        child.attach(FilesTestHelper.invalid_photo)
        expect(child).not_to be_valid
        expect(child.errors['photos.image']).to eq(['file should be one of image/jpg, image/jpeg, image/png'])
      end

      it 'should be invalid if the size of documents if greather than the permited' do
        child.attach(FilesTestHelper.max_documents_as_a_paramenter)
        expect(child).not_to be_valid
        expect(child.errors['other_documents']).to eq(['is too long (maximum is 100 characters)'])
      end

    end
    context 'relations' do

      it 'should be present all the relations with attachable' do
        expect(child).to respond_to('photos')
        expect(child).to respond_to('other_documents')
        expect(child).to respond_to('recorded_audio')
        expect(child.class).to respond_to('attachment_images_fields')
        expect(child.class).to respond_to('attachment_documents_fields')
        expect(child.class).to respond_to('attachment_audio_fields')
      end
    end
  end
  describe 'when update' do

    it 'should attach a photo' do
      child.attach(FilesTestHelper.png_as_a_parameter)
      child.save
      new_photo = FilesTestHelper.jpg_as_a_parameter_to_update(child.photos.first.id)
      child.attach(new_photo)
      child.save
      expect(child.photos.first.image.filename.to_s).to eq(FilesTestHelper.jpg.first['image'].original_filename)
    end
  end
end