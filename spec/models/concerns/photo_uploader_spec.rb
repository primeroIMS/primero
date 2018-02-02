require 'rails_helper'

class TestRecord < CouchRest::Model::Base
  use_database :test_record
  include PhotoUploader
  include Record
end

COUCHDB_SERVER.database('test_record').recreate! rescue nil

# TODO: There are many more tests that are duplicated across TracingRequest and
# Child that could be moved here
describe PhotoUploader do
  before :each do
    TestRecord.any_instance.stub(:field_definitions).and_return([])
    Clock.stub(:now).and_return(Time.parse("Jan 20 2010 12:04:24"))
    User.stub(:find_by_user_name).and_return(double(:organization => 'stc'))
    @rec = TestRecord.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
    Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:24"))
  end

  it "should log new photo key on adding a photo" do
    @rec.photo = uploadable_photo_jeff
    @rec.save
    changes = @rec.histories.first.changes
    changes['photo_keys']['to'].last.should == "jeff"
  end

  it "should log multiple photos being added" do
    @rec.photos = [uploadable_photo_jeff, uploadable_photo_jorge_300x300]
    @rec.save
    ch = @rec.histories.first.changes['photo_keys']
    (ch['to'] - ch['from']).should have(2).photo_keys
    (ch['from'] - ch['to']).should == []
  end

  it "should log a photo being deleted" do
    @rec.photos = [uploadable_photo_jeff, uploadable_photo_jorge]
    @rec.save
    @rec.delete_photos([@rec.photos.first.name])
    @rec.save
    ch = @rec.histories.first.changes['photo_keys']
    (ch['from'] - ch['to']).should have(1).photo_key
    (ch['to'] - ch['from']).should == []
  end

  it "should select a new primary photo if the current one is deleted" do
    @rec.photos = [uploadable_photo_jeff]
    @rec.save
    original_primary_photo_key = @rec.photos[0].name
    jeff_photo_key = @rec.photos[1].name
    @rec.primary_photo.name.should == original_primary_photo_key
    @rec.delete_photos([original_primary_photo_key])
    @rec.save
    @rec.primary_photo.name.should == jeff_photo_key
  end

  it "should take the current photo key during rec creation and update it appropriately with the correct format" do
    @rec = TestRecord.create('photo' => {"0" => uploadable_photo, "1" => uploadable_photo_jeff}, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
    @rec.save
    @rec.primary_photo.name.should == @rec.photos.first.name
    @rec.primary_photo.name.should == "jorge"
  end


  it "should not log anything if no photo changes have been made" do
    @rec["last_known_location"] = "Moscow"
    @rec.save
    changes = @rec.histories.first.changes
    changes['photo_keys'].should be_nil
  end

  it "should delete items like _328 and _160x160 in attachments" do
    rec = TestRecord.new
    rec.photo = uploadable_photo
    rec.save

    photo_key = rec.photos[0].name
    uploadable_photo_328 = FileAttachment.new(photo_key+"_328", "image/jpg", "data")
    uploadable_photo_160x160 = FileAttachment.new(photo_key+"_160x160", "image/jpg", "data")
    rec.attach(uploadable_photo_328)
    rec.attach(uploadable_photo_160x160)
    rec.save
    rec[:_attachments].keys.size.should == 3

    rec.delete_photos [rec.primary_photo.name]
    rec.save
    rec[:_attachments].keys.size.should == 0
  end
end
