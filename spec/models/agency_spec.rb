require 'spec_helper'

describe Agency do

  before :each do
    Agency.all.each {|a| a.destroy}
  end

  it "should create a valid lookup" do
    Agency.new(:name => "unicef", :agency_code => "abc123").should be_valid
  end

  it "should not be valid if name is empty" do
    agency = Agency.new(:agency_code => "abc123")
    agency.should_not be_valid
    agency.errors[:name].should == ["must not be blank"]
  end

  it "should not be valid if agency code is empty" do
    agency = Agency.new(:name => "unicef")
    agency.should_not be_valid
    agency.errors[:agency_code].should == ["must not be blank"]
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

  #TODO i18n test cases
  it "should only allow unique agency names" do
    agency1 = Agency.new(:name => "irc", :agency_code => "1234")
    agency1.save
    agency2 = Agency.new(:name => "irc", :agency_code => "5678")
    agency2.save
    agency2.errors[:name].should == ["An Agency with that name already exists, please enter a different name"]
  end

  it "should return all the available agency names" do
    agency1 = Agency.new(:name => "agency1", :agency_code => "1111")
    agency2 = Agency.new(:name => "agency2", :agency_code => "2222")
    agency3 = Agency.new(:name => "agency3", :agency_code => "3333")
    agency1.save
    agency2.save
    agency3.save
    Agency.available_agency_names.should == [
      ["agency1", 'agency-agency1'],
      ["agency2", 'agency-agency2'],
      ["agency3", 'agency-agency3']
    ]
  end

  it "should return all available agency logos for the header" do
    Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))

    agency1 = Agency.new(:name => "agency1", :agency_code => "1111", :logo_enabled => true, 'upload_logo' => {'logo' => uploadable_photo_gif})
    agency1.save

    agency2 = Agency.new(:name => "agency2", :agency_code => "2222")
    agency2.save

    agency3 = Agency.new(:name => "agency3", :agency_code => "3333", :logo_enabled => true,  'upload_logo' => {'logo' => uploadable_photo_gif})
    agency3.save

    logos = Agency.retrieve_logo_ids
    logos.should == [
      {
        id: 'agency-agency1',
        filename: 'small'
      },
      {
        id: 'agency-agency3',
        filename: 'small'
      }
    ]
  end
end
