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
    agency = Agency.new('upload_logo' => {'logo' => uploadable_audio_mp3})
    agency.should_not be_valid
    agency.errors[:logo].should == ["Please upload a valid logo file (jpg, gif, or png)"]
  end

  it "should allow valid logo uploads" do
    agency = Agency.new(:name => "irc", :agency_code => "12345", 'upload_logo' => {'logo' => uploadable_photo_gif})
    agency.should be_valid
  end

  it "should remove old logos before updating logos" do
    Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))
    agency = Agency.new(:name => "irc", :agency_code => "12345", 'upload_logo' => {'logo' => uploadable_photo_gif})
    agency.save
    agency["logo_key"].should eq("small")
    agency['_attachments']['small']['data'].should_not be_blank
    agency['_attachments']['small']['content_type'].should eq("image/gif")

    Clock.stub(:now).and_return(Time.parse("Jan 20 2010 14:05:32"))
    agency.update_attributes('upload_logo' => {'logo' => uploadable_photo})
    agency.save
    agency["logo_key"].should eq("jorge")
    agency['_attachments']['small'].should be_nil
    agency['_attachments']['jorge']['data'].should_not be_blank
    agency['_attachments']['jorge']['content_type'].should eq("image/jpg")
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
    Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))

    agency1 = Agency.new(:name => "agency1", :agency_code => "1111", :logo_enabled => true, 'upload_logo' => {'logo' => uploadable_photo_gif})
    agency1.save

    agency2 = Agency.new(:name => "agency2", :agency_code => "2222")
    agency2.save

    agency3 = Agency.new(:name => "agency3", :agency_code => "3333", :logo_enabled => true,  'upload_logo' => {'logo' => uploadable_photo_gif})
    agency3.save

    expect(Agency.retrieve_logo_ids).to eq([{:id=>"agency-1111", :filename=>"small"}, {:id=>"agency-3333", :filename=>"small"}])
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
