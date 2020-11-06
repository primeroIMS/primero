# frozen_string_literal: true

require 'rails_helper'

describe Agency do
  before :each do
    clean_data(Agency)
  end

  describe 'validations' do
    context 'when name is empty' do
      it 'is not valid' do
        agency1 = Agency.new(agency_code: '1234')

        expect(agency1).not_to be_valid
        expect(agency1.errors[:name]).to eq(['errors.models.agency.name_present'])
      end
    end

    context 'when agency code is empty' do
      it 'is not valid' do
        agency1 = Agency.new(name: 'blah')

        expect(agency1).not_to be_valid
        expect(agency1.errors[:agency_code]).to eq(['errors.models.agency.code_present'])
      end
    end

    context 'when name and agency code are present' do
      it 'is valid' do
        agency1 = Agency.new(name: 'unicef', agency_code: 'abc123')
        expect(agency1).to be_valid
      end
    end
  end

  describe 'agency id' do
    context 'when not passed in' do
      context 'when passed in' do
        before do
          @agency2 = Agency.new(name: 'My Test Agency', agency_code: 'def456')
        end

        context 'before save' do
          it 'id is empty' do
            expect(@agency2.id).to be_nil
          end

          it 'is valid' do
            expect(@agency2).to be_valid
          end
        end

        context 'after save' do
          before do
            @agency2.save
          end

          it 'is valid' do
            expect(@agency2).to be_valid
          end
        end
      end
    end
  end

  describe 'logos' do
    it 'should not allow invalid logo uploads' do
      agency = Agency.new(name: 'Agency I', agency_code: 'agency_i')
      agency.logo_icon.attach(FilesTestHelper.uploadable_audio_mp3)
      agency.should_not be_valid
      expect(agency.errors[:logo_icon].first).to eq('file should be one of image/png')
    end

    it 'should allow valid logo uploads' do
      agency = Agency.new(
        name: 'irc', agency_code: '12345', logo_icon: FilesTestHelper.logo, logo_full: FilesTestHelper.logo
      )
      agency.should be_valid
    end

    it 'should remove old logos before updating logos' do
      agency = Agency.new(name: 'irc', agency_code: '12345', logo_icon: FilesTestHelper.logo_old)
      agency.save
      expect(agency.logo_icon.attached?).to be_truthy
      expect(agency.logo_icon.attachment.filename.to_s).to eq('unicef-old.png')

      agency.update_attributes(logo_icon: FilesTestHelper.logo)
      agency.save
      expect(agency.logo_icon.attached?).to be_truthy
      expect(agency.logo_icon.attachment.filename.to_s).to eq('unicef.png')
      expect(agency.logo_icon.attachment.content_type).to eq('image/png')
    end

    it 'will not clear out an existing logo when updating unrelated attributes' do
      agency = Agency.new(name: 'irc', agency_code: '12345', logo_icon: FilesTestHelper.logo_old)
      agency.save
      expect(agency.logo_icon.attached?).to be_truthy

      agency.update_properties(name: { en: 'IRC' })
      expect(agency.logo_icon.attached?).to be_truthy
    end
  end

  describe 'internationalization' do
    before do
      @agency3 = Agency.create(
        name_en: 'My English Agency', name_fr: 'My French Agency', name_es: 'My Spanish Agency',
        name_ar: 'My Arabic Agency', description_en: 'English Description', description_fr: 'French Description',
        description_es: 'Spanish Description', description_ar: 'Arabic Description', agency_code: 'xyz000'
      )
    end

    context 'and locale is English' do
      it 'is valid' do
        expect(@agency3).to be_valid
      end

      it 'returns English name' do
        expect(@agency3.name).to eq('My English Agency')
      end

      it 'returns English description' do
        expect(@agency3.description).to eq('English Description')
      end
    end

    context 'and locale is French' do
      before :each do
        I18n.locale = :fr
      end
      it 'is valid' do
        expect(@agency3).to be_valid
      end

      it 'returns French name' do
        expect(@agency3.name).to eq('My French Agency')
      end

      it 'returns French description' do
        expect(@agency3.description).to eq('French Description')
      end
    end

    context 'and locale is Spanish' do
      before :each do
        I18n.locale = :es
      end
      it 'is valid' do
        expect(@agency3).to be_valid
      end

      it 'returns Spanish name' do
        expect(@agency3.name).to eq('My Spanish Agency')
      end

      it 'returns Spanish description' do
        expect(@agency3.description).to eq('Spanish Description')
      end
    end

    context 'and locale is Arabic' do
      before :each do
        I18n.locale = :ar
      end
      it 'is valid' do
        expect(@agency3).to be_valid
      end

      it 'returns Arabic name' do
        expect(@agency3.name).to eq('My Arabic Agency')
      end

      it 'returns Arabic description' do
        expect(@agency3.description).to eq('Arabic Description')
      end
    end
  end

  describe 'ConfigurationRecord' do
    let(:agency) do
      Agency.create(
        name: 'irc', agency_code: '12345', logo_icon: FilesTestHelper.logo, logo_full: FilesTestHelper.logo_old
      )
    end

    before(:each) do
      clean_data(Agency)
      agency
    end

    describe '#configuration_hash' do
      it 'returns the configuration hash' do
        configuration_hash = agency.configuration_hash
        expect(configuration_hash['id']).to be_nil
        expect(configuration_hash['name_i18n']['en']).to eq(agency.name)
        expect(configuration_hash['logo_full_base64'].length.positive?).to be_truthy
        expect(configuration_hash['logo_full_file_name']).to eq('unicef-old.png')
        expect(configuration_hash['logo_icon_base64'].length.positive?).to be_truthy
        expect(configuration_hash['logo_icon_file_name']).to eq('unicef.png')
      end
    end

    describe '.create_or_update!' do
      let(:configuration_hash) do
        {
          'name_i18n' => { 'en' => 'irc' },
          'agency_code' => '12345',
          'logo_icon_base64' => FilesTestHelper.logo_base64,
          'logo_icon_file_name' => 'unicef.png',
          'logo_full_base64' => FilesTestHelper.logo_old_base64,
          'logo_full_file_name' => 'unicef-old.png'
        }
      end

      it 'creates a new agency from a configuration hash' do
        configuration_hash2 = configuration_hash.clone
        configuration_hash2['agency_code'] = '123456'
        new_agency = Agency.create_or_update!(configuration_hash2)
        expect(new_agency.configuration_hash).to include(configuration_hash2)
        expect(new_agency.id).not_to eq(agency.id)
        expect(new_agency.logo_full.attached?).to be_truthy
        expect(new_agency.logo_icon.attached?).to be_truthy
      end

      it 'updates an existing agency from a configuration hash' do
        configuration_hash2 = configuration_hash.clone
        configuration_hash2['name_i18n']['en'] = 'IRC2*'

        agency2 = Agency.create_or_update!(configuration_hash2)
        expect(agency2.id).to eq(agency.id)
        expect(agency2.name('en')).to eq('IRC2*')
      end
    end
  end

  describe '.get_field_using_unique_id' do
    let(:agency) do
      Agency.create(
        name: 'test', agency_code: '12345', unique_id: 'test_unique_id'
      )
    end
    before(:each) do
      clean_data(Agency)
      agency
    end

    it 'returns the value specifed' do
      expect(Agency.get_field_using_unique_id('test_unique_id', :agency_code)).to eq(agency.agency_code)
    end
  end
end
