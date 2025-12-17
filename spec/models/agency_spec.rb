# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Agency do
  before :each do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency)
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
      agency.logo_icon.attach(uploadable_audio_mp3)
      agency.should_not be_valid
      expect(agency.errors[:logo_icon].first).to eq('errors.models.agency.logo_format')
    end

    it 'should allow valid logo uploads' do
      agency = Agency.new(
        name: 'irc', agency_code: '12345', logo_icon: logo, logo_full: logo
      )
      agency.should be_valid
    end

    it 'should remove old logos before updating logos' do
      agency = Agency.new(name: 'irc', agency_code: '12345', logo_icon: logo_old)
      agency.save
      expect(agency.logo_icon.attached?).to be_truthy
      expect(agency.logo_icon.attachment.filename.to_s).to eq('unicef-old.png')

      agency.update(logo_icon: logo)
      agency.save
      expect(agency.logo_icon.attached?).to be_truthy
      expect(agency.logo_icon.attachment.filename.to_s).to eq('unicef.png')
      expect(agency.logo_icon.attachment.content_type).to eq('image/png')
    end

    it 'will not clear out an existing logo when updating unrelated attributes' do
      agency = Agency.new(name: 'irc', agency_code: '12345', logo_icon: logo_old)
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
        name: 'irc', agency_code: '12345', logo_icon: logo, logo_full: logo_old
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
          'logo_icon_base64' => logo_base64,
          'logo_icon_file_name' => 'unicef.png',
          'logo_full_base64' => logo_old_base64,
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
        configuration_hash2['unique_id'] = agency.unique_id

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

  describe '.with_pdf_logo_option' do
    let(:agency1) do
      Agency.create(
        name: 'test', agency_code: '12345', unique_id: 'test_unique_id', pdf_logo_option: true, disabled: false
      )
    end
    let(:agency2) do
      Agency.create(
        name: 'test2', agency_code: '98765', unique_id: 'test_unique_id2', pdf_logo_option: false, disabled: false
      )
    end
    before(:each) do
      clean_data(Agency)
      agency1
      agency2
    end

    it 'returns the agency with pdf_logo_option true specifed' do
      expect(Agency.with_pdf_logo_option).to eq([agency1])
    end
  end

  describe 'terms_of_use' do
    it 'should not allow invalid format' do
      agency = Agency.new(name: 'Agency I', agency_code: 'agency_i')
      agency.terms_of_use.attach(logo)
      agency.should_not be_valid
      expect(agency.errors[:terms_of_use].first).to eq('errors.models.agency.terms_of_use_format')
    end

    it 'should allow valid format' do
      agency = Agency.new(
        name: 'irc', agency_code: '12345', terms_of_use: pdf_file
      )
      agency.should be_valid
    end

    it 'will not clear out an existing terms_of_use when updating unrelated attributes' do
      agency = Agency.new(name: 'irc', agency_code: '12345', terms_of_use: pdf_file)
      agency.save
      expect(agency.terms_of_use.attached?).to be_truthy

      agency.update_properties(name: { en: 'IRC' })
      expect(agency.terms_of_use.attached?).to be_truthy
    end

    describe '#attach_terms_of_use' do
      let(:agency) { Agency.new(name: 'Test Agency', agency_code: 'test123') }
      let(:user) do
        create(:user, user_name: 'test_user', agency:, full_name: 'Test User 1', email: 'test_user@primero.dev')
      end
      let(:terms_params) do
        {
          terms_of_use_file_name: 'terms.pdf',
          terms_of_use_base64: Base64.encode64('fake pdf content')
        }
      end

      context 'when terms_of_use file and base64 are present' do
        it 'attaches the file and stamps terms of use' do
          allow(Rails.configuration).to receive(:enforce_terms_of_use).and_return(true)

          expect(agency).to receive(:attach_file).with(
            'terms.pdf',
            Base64.encode64('fake pdf content'),
            agency.terms_of_use
          )
          expect(agency).to receive(:stamp_terms_of_use!).with(user).and_call_original

          agency.attach_terms_of_use(terms_params, user)

          expect(agency.terms_of_use_signed).to be_truthy
        end
      end

      context 'when terms_of_use file name is missing' do
        it 'does not attach file or stamp terms' do
          params = terms_params.merge(terms_of_use_file_name: nil)

          expect(agency).not_to receive(:attach_file)
          expect(agency).not_to receive(:stamp_terms_of_use!)

          agency.attach_terms_of_use(params, user)
        end
      end

      context 'when terms_of_use base64 is missing' do
        it 'does not attach file or stamp terms' do
          params = terms_params.merge(terms_of_use_base64: nil)

          expect(agency).not_to receive(:attach_file)
          expect(agency).not_to receive(:stamp_terms_of_use!)

          agency.attach_terms_of_use(params, user)
        end
      end

      context 'when user_name is nil' do
        it 'attaches file but does not stamp terms' do
          expect(agency).to receive(:attach_file)
          expect(agency).not_to receive(:stamp_terms_of_use!)

          agency.attach_terms_of_use(terms_params, nil)
        end
      end
    end

    describe '#stamp_terms_of_use!' do
      let(:agency) { Agency.new(name: 'Test Agency', agency_code: 'test123') }
      let(:user) do
        create(:user, user_name: 'test_user2', agency:, full_name: 'Test User 2', email: 'test_user2@primero.dev')
      end

      context 'when PRIMERO_ENFORCE_TERMS_OF_USE is enabled' do
        before do
          allow(Rails.configuration).to receive(:enforce_terms_of_use).and_return(true)
        end

        it 'sets terms_of_use_signed to true' do
          travel_to Time.zone.parse('2023-01-01 12:00:00') do
            agency.stamp_terms_of_use!(user)

            expect(agency.terms_of_use_signed).to be true
            expect(agency.terms_of_use_uploaded_at).to eq(DateTime.parse('2023-01-01 12:00:00'))
            expect(agency.terms_of_use_uploaded_by).to eq(user.user_name)
          end
        end
      end

      context 'when PRIMERO_ENFORCE_TERMS_OF_USE is disabled' do
        before do
          allow(Rails.configuration).to receive(:enforce_terms_of_use).and_return(false)
        end

        it 'does not set terms_of_use fields' do
          agency.stamp_terms_of_use!(user)

          expect(agency.terms_of_use_signed).to be false
          expect(agency.terms_of_use_uploaded_at).to be_nil
          expect(agency.terms_of_use_uploaded_by).to be_nil
        end
      end

      context 'when PRIMERO_ENFORCE_TERMS_OF_USE is not set' do
        before do
          allow(Rails.configuration).to receive(:enforce_terms_of_use).and_return(nil)
        end

        it 'does not set terms_of_use fields' do
          agency.stamp_terms_of_use!(user)

          expect(agency.terms_of_use_signed).to be false
          expect(agency.terms_of_use_uploaded_at).to be_nil
          expect(agency.terms_of_use_uploaded_by).to be_nil
        end
      end
    end

    describe '#terms_of_use_signed_if_enforced validation' do
      let(:agency) { Agency.new(name: 'Test Agency', agency_code: 'test123') }

      context 'when PRIMERO_ENFORCE_TERMS_OF_USE is enabled' do
        before do
          allow(Rails.configuration).to receive(:enforce_terms_of_use).and_return(true)
        end

        context 'and terms_of_use_signed is false' do
          before { agency.terms_of_use_signed = false }

          it 'adds validation error' do
            agency.valid?
            expect(agency.errors[:base]).to include(I18n.t('errors.models.agency.must_sign_terms_of_use'))
          end
        end

        context 'and terms_of_use_signed is true' do
          before { agency.terms_of_use_signed = true }

          it 'does not add validation error' do
            agency.valid?
            expect(agency.errors[:base]).not_to include(I18n.t('errors.models.agency.must_sign_terms_of_use'))
          end
        end

        context 'and terms_of_use_signed is nil' do
          before { agency.terms_of_use_signed = nil }

          it 'adds validation error' do
            agency.valid?
            expect(agency.errors[:base]).to include(I18n.t('errors.models.agency.must_sign_terms_of_use'))
          end
        end
      end

      context 'when PRIMERO_ENFORCE_TERMS_OF_USE is disabled' do
        before do
          allow(Rails.configuration).to receive(:enforce_terms_of_use).and_return(false)
          agency.terms_of_use_signed = false
        end

        it 'does not add validation error' do
          agency.valid?
          expect(agency.errors[:base]).not_to include(I18n.t('errors.models.agency.must_sign_terms_of_use'))
        end
      end
    end
  end
end
