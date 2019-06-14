require 'rails_helper'

describe Agency do

  before :each do
    Agency.all.each {|a| a.destroy}
  end

  describe 'validations' do
    context 'when name is empty' do
      it 'is not valid' do
        agency1 = Agency.new(agency_code: "1234")

        expect(agency1).not_to be_valid
        expect(agency1.errors[:name]).to eq(['errors.models.agency.name_present'])
      end
    end

    context 'when agency code is empty' do
      it 'is not valid' do
        agency1 = Agency.new(name: "blah")

        expect(agency1).not_to be_valid
        expect(agency1.errors[:agency_code]).to eq(['errors.models.agency.code_present'])
      end
    end

    context 'when name and agency code are present' do
      it 'is valid' do
        agency1 = Agency.new(name: "unicef", agency_code: "abc123")
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

  it "should not allow invalid logo uploads" do
    agency = Agency.new(name: 'Agency I', agency_code: 'agency_i')
    agency.logo_small.attach(FilesTestHelper.uploadable_audio_mp3)
    agency.should_not be_valid
    expect(agency.errors[:logo_small].first).to eq('file should be one of image/png')
  end

  it "should allow valid logo uploads" do
    agency = Agency.new(name: "irc", agency_code: "12345", logo_small: FilesTestHelper.logo, logo_large: FilesTestHelper.logo)
    agency.should be_valid
  end

  it "should remove old logos before updating logos" do
    agency = Agency.new(name: "irc", agency_code: "12345", logo_small: FilesTestHelper.logo_old)
    agency.save
    expect(agency.logo_small.attached?).to be_truthy
    expect(agency.logo_small.attachment.filename.to_s).to eq('unicef-old.png')

    agency.update_attributes(logo_small: FilesTestHelper.logo)
    agency.save
    expect(agency.logo_small.attached?).to be_truthy
    expect(agency.logo_small.attachment.filename.to_s).to eq('unicef.png')
    expect(agency.logo_small.attachment.content_type).to eq('image/png')
  end

  it "should return all the available agency names" do
    agency1 = Agency.new(:name => "agency1", :agency_code => "1111")
    agency2 = Agency.new(:name => "agency2", :agency_code => "2222")
    agency3 = Agency.new(:name => "agency3", :agency_code => "3333")
    agency1.save
    agency2.save
    agency3.save

    all_names = Agency.all_names
    expect(all_names.map{|a| a['display_text']}).to eq(['agency1', 'agency2', 'agency3'])
  end

  it "should return all available agency logos for the header" do
    agency1 = Agency.new(name: "agency1", agency_code: "1111", logo_enabled: true, logo_small: FilesTestHelper.logo)
    agency1.save

    agency2 = Agency.new(name: "agency2", agency_code: "2222")
    agency2.save

    agency3 = Agency.new(name: "agency3", agency_code: "3333", logo_enabled: true, logo_small: FilesTestHelper.logo)
    agency3.save
    expect(Agency.retrieve_logo_ids.count).to eq 2
    expect(Agency.retrieve_logo_ids.map &:filename).to eq(['unicef.png', 'unicef.png'])
  end

  describe 'internationalization' do
    before do
      @agency3 = Agency.create(name_en: 'My English Agency', name_fr: 'My French Agency', name_es: 'My Spanish Agency',
                               name_ar: 'My Arabic Agency', description_en: 'English Description', description_fr: 'French Description',
                               description_es: 'Spanish Description', description_ar: 'Arabic Description', agency_code: 'xyz000')
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
        I18n.locale = "fr"
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
        I18n.locale = "es"
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
        I18n.locale = "ar"
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
end
