require 'rails_helper'
require 'sunspot'

describe Child do

  describe "quicksearch", search: true do
    it "has a searchable case id, survivor number" do
      expect(Child.quicksearch_fields).to include('case_id_display', 'survivor_code_no')
    end

    it "can find a child by survivor code" do
      child = Child.create!(data: {name: 'Lonnie', survivor_code_no: 'ABC123XYZ'})
      child.index!
      search_result = Child.list_records({}, {:created_at => :desc}, {}, [], 'ABC123XYZ').results
      expect(search_result).to have(1).child
      expect(search_result.first.survivor_code_no).to eq('ABC123XYZ')
    end
  end

  describe "update_properties" do

    it "should replace old properties with updated ones" do
      child = Child.new(data: {"name" => "Dave", "age" => 28, "last_known_location" => "London"})
      new_properties = {"name" => "Dave", "age" => 35}
      child.update_properties(new_properties, "some_user")
      child.age.should == 35
      child.name.should == "Dave"
      child.data['last_known_location'].should == "London"
    end

    it "should not replace old properties when when missing from update" do
      child = Child.new(data: {"origin" => "Croydon", "last_known_location" => "London"})
      new_properties = {"last_known_location" => "Manchester"}
      child.update_properties(new_properties, "some_user")
      child.data['last_known_location'].should == "Manchester"
      child.data['origin'].should == "Croydon"
    end

    it "should populate last_updated_by field with the user_name who is updating" do
      child = Child.new
      child.update_properties({}, "jdoe")
      child.last_updated_by.should == 'jdoe'
    end

    xit "should not update attachments when the photo value is nil" do
      child = Child.new
      child.update_with_attachements({}, "mr jones")
      child.photos.should be_empty
    end

    xit "should update attachment when there is audio update" do
      Clock.stub(:now).and_return(Time.parse("Jan 17 2010 14:05:32"))
      child = Child.new
      child.update_properties_with_user_name "jdoe", nil, nil, uploadable_audio, false, {}
      child['_attachments']['sample']['data'].should_not be_blank
    end

    xit "should respond nil for photo when there is no photo associated with the child" do
      child = Child.new
      child.photo.should == nil
    end

    xit "should update photo keys" do
      child = Child.new
      child.should_receive(:update_photo_keys)
      child.update_properties_with_user_name "jdoe", nil, nil, nil, false, {}
      child.photos.should be_empty
    end

  end

  describe "validation" do

    xit "should disallow file formats that are not photo formats" do
      child = Child.new
      child.photo = uploadable_photo_gif
      child.should_not be_valid
      child.photo = uploadable_photo_bmp
      child.should_not be_valid
    end

    xit "should disallow uploading executable files for documents" do
      child = Child.new
      child.upload_other_document = [{'document' => uploadable_executable_file}]
      child.should_not be_valid
    end

    xit "should disallow uploading executable files for bia_documents" do
      child = Child.new
      child.upload_bia_document = [{'document' => uploadable_executable_file}]
      child.should_not be_valid
    end

    xit "should disallow uploading executable files for bid_documents" do
      child = Child.new
      child.upload_bid_document = [{'document' => uploadable_executable_file}]
      child.should_not be_valid
    end

    xit "should disallow uploading more than 100 documents" do
      documents = []
      101.times { documents.push({'document' => uploadable_photo_gif}) }
      child = Child.new
      child.upload_other_document = documents
      child.upload_bia_document = documents
      child.upload_bid_document = documents
      child.should_not be_valid
    end

    xit "should disallow uploading a document larger than 2 megabytes" do
      child = Child.new
      child.upload_other_document = [{'document' => uploadable_large_photo}]
      child.should_not be_valid
    end

    it "should allow blank age" do
      child = Child.new(data: {:age => "", :another_field => "blah"})
      child.should be_valid
      child = Child.new(data: {foo: "bar"})
      child.should be_valid
    end

    xit "should disallow image file formats that are not png or jpg" do
      child = Child.new
      child.photo = uploadable_photo
      child.should be_valid
      child.photo = uploadable_text_file
      child.should_not be_valid
    end

    xit "should disallow a photo larger than 10 megabytes" do
      photo = uploadable_large_photo
      child = Child.new
      child.photo = photo
      child.should_not be_valid
    end

  end


  describe 'save' do

    it "should save with generated case_id and registration_date" do
      child = child_with_created_by('jdoe', 'last_known_location' => 'London', 'age' => '6')
      child.save!
      child.case_id.should_not be_nil
      child.registration_date.should_not be_nil
    end

    it "should allow edit registration_date" do
      child = child_with_created_by('jdoe', 'last_known_location' => 'London', 'age' => '6', 'registration_date' => Date.parse('19/Jul/2014'))
      child.save!
      child.case_id.should_not be_nil
      child.registration_date.should eq Date.parse('19/Jul/2014')
    end

    xit "should not save file formats that are not photo formats" do
      child = Child.new
      child.photo = uploadable_photo_gif
      child.save.should == false
      child.photo = uploadable_photo_bmp
      child.save.should == false
    end

    xit "should save file based on content type" do
      child = Child.new('created_by' => "me", 'created_organization' => "stc")
      photo = uploadable_jpg_photo_without_file_extension
      child[:photo] = photo
      child.save.present?.should == true
    end

    xit "should not save with file formats that are not supported audio formats" do
      child = Child.new('created_by' => "me", 'created_organization' => "stc")
      child.audio = uploadable_photo_gif
      child.save.should == false
      child.audio = uploadable_audio_amr
      child.save.present?.should == true
      child.audio = uploadable_audio_mp3
      child.save.present?.should == true
      child.audio = uploadable_audio_wav
      child.save.should == false
      child.audio = uploadable_audio_ogg
      child.save.should == false
    end

    it "should save blank age" do
      #TODO - i18n could change depending on how we want name / display to look
      User.stub(:find_by_user_name).and_return(double(:organization => "stc", :location => "my_country::my_state::my_town", :agency => "unicef-un"))
      child = Child.new(data: {:age => "", :another_field => "blah", 'created_by' => "me", 'created_organization' => "stc"})
      child.save.present?.should == true
      child = Child.new(data: {foo: "bar"})
      child.save.present?.should == true
    end

    xit "should not save with image file formats that are not png or jpg" do
      photo = uploadable_photo
      child = Child.new('created_by' => "me", 'created_organization' => "stc")
      child.photo = photo
      child.save.present?.should == true
      loaded_child = Child.get(child.id)
      loaded_child.save.present?.should == true
      loaded_child.photo = uploadable_text_file
      loaded_child.save.should == false
    end

    xit "should not save with a photo larger than 10 megabytes" do
      photo = uploadable_large_photo
      child = Child.new('created_by' => "me", 'created_organization' => "stc")
      child.photo = photo
      child.save.should == false
    end

  end

  describe "new_with_user_name" do

    it "should create regular child fields" do
      child = child_with_created_by('jdoe', 'last_known_location' => 'London', 'age' => 6)
      child.data['last_known_location'].should == 'London'
      child.age.should == 6
    end

    it "should create a unique id" do
      SecureRandom.stub("uuid").and_return(12345)
      child = child_with_created_by('jdoe', 'last_known_location' => 'London')
      child.save!
      child.unique_identifier.should == "12345"
    end

    it "should not create a unique id if already exists" do
      child = child_with_created_by('jdoe', 'last_known_location' => 'London', 'unique_identifier' => 'rapidftrxxx5bcde')
      child.unique_identifier.should == "rapidftrxxx5bcde"
    end

    it "should create a created_by field with the user name" do
      child = child_with_created_by('jdoe', 'some_field' => 'some_value')
      child.created_by.should == 'jdoe'
    end

    it "should create a posted_at field with the current date" do
      DateTime.stub(:now).and_return(Time.utc(2010, "jan", 22, 14, 05, 0))
      child = child_with_created_by('some_user', 'some_field' => 'some_value')
      child.posted_at.should == DateTime.parse("2010-01-22 14:05:00UTC")
    end

    it "should assign name property as nil if name is not passed before saving child record" do
      child = Child.new_with_user(double('user', :user_name => 'user', :organization => 'org', :full_name => 'UserN'), {'some_field' => 'some_value'})
      child.save
      child = Child.find(child.id)
      child.name.should == nil
    end

    describe "when the created at field is not supplied" do

      it "should create a created_at field with time of creation" do
        DateTime.stub(:now).and_return(Time.utc(2010, "jan", 14, 14, 5, 0))
        child = child_with_created_by('some_user', 'some_field' => 'some_value')
        child.created_at.should == DateTime.parse("2010-01-14 14:05:00UTC")
      end

    end

    describe "when the created at field is supplied" do

      it "should use the supplied created at value" do
        child = child_with_created_by('some_user', 'some_field' => 'some_value', 'created_at' => '2010-01-14 14:05:00UTC')
        child.created_at.should == "2010-01-14 14:05:00UTC"
      end
    end
  end

  describe "unique id" do
    it "should create a unique id" do
      SecureRandom.stub("uuid").and_return(12345)
      child = Child.new
      child.save!
      child.unique_identifier.should == "12345"
    end

    it "should return last 7 characters of unique id as short id" do
      SecureRandom.stub("uuid").and_return(1212127654321)
      child = Child.new
      child.save!
      child.short_id.should == "7654321"
    end

  end

  xdescribe "document attachments" do
    before(:each) do
      Clock.stub(:now).and_return(Time.parse("Jan 20 2010 17:10:32"))
    end

    context "with no documents" do
      it "should have an empty set" do
        Child.new.document_keys.should be_empty
      end
    end

    context "with a single new document" do
      before :each do
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
        @child = Child.create('upload_other_document' => [{'document' => uploadable_photo}], 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
      end

      it "should only have one document on creation" do
        @child.other_documents.size.should eql 1
      end
    end

    context "with multiple documents" do
      it "should only have one document on creation" do
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
        docs = [uploadable_photo, uploadable_photo_jeff, uploadable_photo_jorge].map {|d| {'document' => d}}
        @child = Child.create('upload_other_document' => docs, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        @child.other_documents.size.should eql 3
      end
    end
  end

  xdescribe "photo attachments" do

    before(:each) do
      Clock.stub(:now).and_return(Time.parse("Jan 20 2010 17:10:32"))
    end

    context "with no photos" do
      it "should have an empty set" do
        Child.new.photos.should be_empty
      end

      it "should not have a primary photo" do
        Child.new.primary_photo.should be_nil
      end
    end

    context "with a single new photo" do
      before :each do
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
        @child = Child.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
      end

      it "should only have one photo on creation" do
        @child.photos.size.should eql 1
      end

      it "should be the primary photo" do
        @child.primary_photo.should match_photo uploadable_photo
      end

    end

    context "with multiple new photos" do
      before :each do
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
        @child = Child.create('photo' => {'0' => uploadable_photo_jeff, '1' => uploadable_photo_jorge}, 'last_known_location' => 'London', 'created_by' => "me")
      end

      it "should have corrent number of photos after creation" do
        @child.photos.size.should eql 2
      end

      it "should order by primary photo" do
        @child.primary_photo_id = @child["photo_keys"].last
        @child.photos.first.name.should == @child.current_photo_key
      end

      it "should return the first photo as a primary photo" do
        @child.primary_photo.should match_photo uploadable_photo_jeff
      end

    end

    context "when rotating an existing photo" do
      before :each do
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
        @child = Child.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      end

      it "should become the primary photo" do
        existing_photo = @child.primary_photo
        @child.rotate_photo(180)
        @child.save
        #TODO: should be a better way to check rotation other than stubbing Minimagic ?
        @child.primary_photo.should_not match_photo existing_photo
      end

      it "should delete the original orientation" do
        existing_photo = @child.primary_photo
        @child.rotate_photo(180)
        @child.save
        @child.primary_photo.name.should eql existing_photo.name
        existing_photo.should_not match_photo @child.primary_photo
        @child.photos.size.should eql 1
      end

    end

    context "validate photo size" do
      before :each do
        User.stub(:find_by_user_name).and_return(double(:organization => "stc"))
        Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:32"))
      end

      it "should not save child if new photos are more than 10" do
        photos = []
        (1..11).each do |i|
          photos << stub_photo_properties(i)
        end
        child = Child.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        child.photos = photos
        child.save.should == false
        child.errors[:photo].should == ["You are only allowed 10 photos per case."]
      end

      it "should not save child if new photos and existing photos are more than 10" do
        photos = []
        (1..5).each do |i|
          photos << stub_photo_properties(i)
        end
        child = Child.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        child.photos = photos
        child.save
        child.new? == false
        child['photo_keys'].size == 5

        photos = []
        (6..11).each do |i|
          photos << stub_photo_properties(i)
        end
        child.photos = photos
        child.save.should == false
        child['photo_keys'].size == 5
        child.errors[:photo].should == ["You are only allowed 10 photos per case."]
      end

      it "should save child if new and existing photos are 10" do
        photos = []
        (1..5).each do |i|
          photos << stub_photo_properties(i)
        end
        child = Child.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        child.photos = photos
        child.save
        child.new? == false
        child['photo_keys'].size == 5

        photos = []
        (6..10).each do |i|
          photos << stub_photo_properties(i)
        end
        child.photos = photos
        child.save
        child.new? == false
        child['photo_keys'].size == 10
      end

      it "should save child 10 new photos" do
        photos = []
        (1..10).each do |i|
          photos << stub_photo_properties(i)
        end
        child = Child.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        child.photos = photos
        child.save
        child.new? == false
        child['photo_keys'].size == 10
      end

      it "should save child after delete some photos" do
        photos = []
        (1..10).each do |i|
          photos << stub_photo_properties(i)
        end
        child = Child.new('last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        child.photos = photos
        child.save
        child.new? == false
        child['photo_keys'].size == 10

        #Should fails because it reach the limit
        child.photos = [stub_photo_properties(11)]
        child.save.should == false

        #By deleting one, it should save.
        photo_key_to_delete = child['photo_keys'][0]
        child.delete_photos([photo_key_to_delete])
        child.photos = [stub_photo_properties(11)]
        child.save
        child.new? == false
        child['photo_keys'].size == 10
        child['photo_keys'].find_index(photo_key_to_delete).should == nil
      end

      def stub_photo_properties(i)
        photo = uploadable_photo
        photo.stub(:original_filename).and_return(i.to_s)
        photo.stub(:path).and_return(i.to_s)
        photo.stub(:size).and_return(i)
        photo.stub(:content_type).and_return("image/jpg")
        photo
      end

    end

  end

  describe "history log" do
    before :each do
      RecordHistory.delete_all
    end

    xdescribe "photo logging" do

      before :each do
        Clock.stub(:now).and_return(Time.parse("Jan 20 2010 12:04:24"))
        User.stub(:find_by_user_name).and_return(double(:organization => 'stc'))
        @child = Child.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:24"))
      end

      it "should log new photo key on adding a photo" do
        @child.photo = uploadable_photo_jeff
        @child.save
        changes = @child.histories.first.changes
        changes['photo_keys']['to'].last.should == "jeff"
      end

      it "should log multiple photos being added" do
        @child.photos = [uploadable_photo_jeff, uploadable_photo_jorge_300x300]
        @child.save
        ch = @child.histories.first.changes['photo_keys']
        (ch['to'] - ch['from']).should have(2).photo_keys
        (ch['from'] - ch['to']).should == []
      end

      it "should log a photo being deleted" do
        @child.photos = [uploadable_photo_jeff, uploadable_photo_jorge]
        @child.save
        @child.delete_photos([@child.photos.first.name])
        @child.save
        ch = @child.histories.first.changes['photo_keys']
        (ch['from'] - ch['to']).should have(1).photo_key
        (ch['to'] - ch['from']).should == []
      end

      it "should select a new primary photo if the current one is deleted" do
        @child.photos = [uploadable_photo_jeff]
        @child.save
        original_primary_photo_key = @child.photos[0].name
        jeff_photo_key = @child.photos[1].name
        @child.primary_photo.name.should == original_primary_photo_key
        @child.delete_photos([original_primary_photo_key])
        @child.save
        @child.primary_photo.name.should == jeff_photo_key
      end

      it "should take the current photo key during child creation and update it appropriately with the correct format" do
        @child = Child.create('photo' => {"0" => uploadable_photo, "1" => uploadable_photo_jeff}, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        @child.save
        @child.primary_photo.name.should == @child.photos.first.name
        @child.primary_photo.name.should == "jorge"
      end

      it "should not log anything if no photo changes have been made" do
        @child["last_known_location"] = "Moscow"
        @child.save
        changes = @child.histories.first.changes
        changes['photo_keys'].should be_nil
      end

    end

    it "should maintain history when child is flagged and message is added" do
      child = Child.create(data: {'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc"})
      child.add_flag('Duplicate record!', Date.today, "me")
      flag_history = child.histories.first.record_changes['flags']
      flag_history['from'].should == nil
      flag_history['to']['message'].should == 'Duplicate record!'
    end

    it "should maintain history when child is reunited and message is added" do
      child = Child.create(data: {'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc"})
      child.reunited = true
      child.reunited_message = 'Finally home!'
      child.save!
      reunited_history = child.histories.first.record_changes['reunited']
      reunited_history['from'].should be_nil
      reunited_history['to'].should == true
      reunited_message_history = child.histories.first.record_changes['reunited_message']
      reunited_message_history['from'].should be_nil
      reunited_message_history['to'].should == 'Finally home!'
    end

    xdescribe "photo changes" do

      before :each do
        Clock.stub(:now).and_return(Time.parse("Jan 20 2010 12:04:24"))
        User.stub(:find_by_user_name).and_return(double(:organization => 'stc'))
        @child = Child.create('photo' => uploadable_photo, 'last_known_location' => 'London', 'created_by' => "me", 'created_organization' => "stc")
        Clock.stub(:now).and_return(Time.parse("Feb 20 2010 12:04:24"))
      end

      it "should delete items like _328 and _160x160 in attachments" do
        child = Child.new
        child.photo = uploadable_photo
        child.save

        photo_key = child.photos[0].name
        uploadable_photo_328 = FileAttachment.new(photo_key+"_328", "image/jpg", "data")
        uploadable_photo_160x160 = FileAttachment.new(photo_key+"_160x160", "image/jpg", "data")
        child.attach(uploadable_photo_328)
        child.attach(uploadable_photo_160x160)
        child.save
        child[:_attachments].keys.size.should == 3

        child.delete_photos [child.primary_photo.name]
        child.save
        child[:_attachments].keys.size.should == 0
      end
    end

  end


  xdescribe ".photo" do

    it "should return nil if the record has no attached photo" do
      child = create_child "Bob McBobberson"
      Child.all.find { |c| c.id == child.id }.photo.should be_nil
    end

  end


  xdescribe "primary_photo =" do

    before :each do
      @photo1 = uploadable_photo("spec/resources/jorge.jpg")
      @photo2 = uploadable_photo("spec/resources/jeff.png")
      User.stub(:find_by_user_name).and_return(double(:organization => 'UNICEF'))
      @child = Child.new("name" => "Tom", 'created_by' => "me")
      @child.photo= {0 => @photo1, 1 => @photo2}
      @child.save
    end

    it "should update the primary photo selection" do
      photos = @child.photos
      orig_primary_photo = photos[0]
      new_primary_photo = photos[1]
      @child.primary_photo_id.should == orig_primary_photo.name
      @child.primary_photo_id = new_primary_photo.name
      @child.save
      @child.primary_photo_id.should == new_primary_photo.name
    end

    context "when selected photo id doesn't exist" do

      it "should show an error" do
        lambda { @child.primary_photo_id="non-existant-id" }.should raise_error "Failed trying to set 'non-existant-id' to primary photo: no such photo key"
      end

    end

  end

  describe 'organization' do
    it 'should get created user' do
      child = Child.new
      child.created_by = 'test'

      User.should_receive(:find_by_user_name).with('test').and_return('test1')
      child.created_by_user.should == 'test1'
    end

    it 'should be set from user' do
      User.stub(:find_by_user_name).with('mj').and_return(double(:organization => 'UNICEF'))
      child = Child.create(data: {'name' => 'Jaco', :created_by => "mj"})

      child.created_organization.should == 'UNICEF'
    end
  end

  describe "views" do

    #TODO: Revisit with Mobile compatibility
    xdescribe "all ids and revs" do
      before do
        Child.destroy_all!
        @owner = create :user
        @owner2 = create :user
        @child1 = child_with_created_by(@owner.user_name, :name => "child1", :marked_for_mobile => true, :module_id => PrimeroModule::GBV)
        @child2 = child_with_created_by(@owner.user_name, :name => "child2", :marked_for_mobile => false, :module_id => PrimeroModule::CP)
        @child3 = child_with_created_by(@owner2.user_name, :name => "child3", :marked_for_mobile => true, :module_id => PrimeroModule::CP)
        @child4 = child_with_created_by(@owner2.user_name, :name => "child4", :marked_for_mobile => false, :module_id => PrimeroModule::GBV)

        @child1.create!
        @child2.create!
        @child3.create!
        @child4.create!
      end

      context 'when mobile' do
        context 'and module id is CP' do
          it 'returns all CP mobile _ids and revs' do
            ids_and_revs = Child.fetch_all_ids_and_revs([@owner.user_name, @owner2.user_name], true, '2000/01/01', PrimeroModule::CP)
            expect(ids_and_revs.count).to eq(1)
            expect(ids_and_revs).to eq([{"_id" => @child3.id, "_rev" => @child3.rev}])
          end
        end

        context 'and module id is GBV' do
          it 'returns all GBV mobile _ids and revs' do
            ids_and_revs = Child.fetch_all_ids_and_revs([@owner.user_name, @owner2.user_name], true, '2000/01/01', PrimeroModule::GBV)
            expect(ids_and_revs.count).to eq(1)
            expect(ids_and_revs).to eq([{"_id" => @child1.id, "_rev" => @child1.rev}])
          end
        end

        context 'and module id is not provided' do
          it 'returns all mobile _ids and revs' do
            ids_and_revs = Child.fetch_all_ids_and_revs([@owner.user_name, @owner2.user_name], true, '2000/01/01', '')
            expect(ids_and_revs.count).to eq(2)
            expect(ids_and_revs).to include({"_id" => @child1.id, "_rev" => @child1.rev},
                                            {"_id" => @child3.id, "_rev" => @child3.rev})
          end
        end
      end

      context 'when not mobile' do
        it 'returns all _ids and revs' do
          ids_and_revs = Child.fetch_all_ids_and_revs([@owner.user_name, @owner2.user_name], false, '2000/01/01', '')
          expect(ids_and_revs.count).to eq(4)
          expect(ids_and_revs).to include({"_id" => @child1.id, "_rev" => @child1.rev},
                                          {"_id" => @child2.id, "_rev" => @child2.rev},
                                          {"_id" => @child3.id, "_rev" => @child3.rev},
                                          {"_id" => @child4.id, "_rev" => @child4.rev})
        end
      end
    end
  end


  #TODO: For now skipping JSON datatype validation against form definition
  xdescribe 'validate dates and date ranges fields' do
    before do
      fields = [Field.new({"name" => "a_date_field",
                           "type" => "date_field",
                           "display_name_all" => "A Date Field"
                          }),
                Field.new({"name" => "a_range_field",
                           "type" => "date_range",
                           "display_name_all" => "A Range Field"
                          }),
                Field.new({"name" => "b_range_field",
                           "type" => "date_range",
                           "display_name_all" => "B Range Field"
                          })]
      FormSection.create_or_update_form_section({
        :unique_id=> "form_section_with_dates_fields",
        "visible" => true,
        :order => 1,
        "editable" => true,
        :fields => fields,
        :parent_form=>"case",
        "name_all" => "Form Section With Dates Fields",
        "description_all" => "Form Section With Dates Fields",
      })
    end

    it "should validate single date field" do
      #date field invalid.
      child = create_child "Bob McBobberson", :a_date_field => "asdlfkj",
                           :a_range_field_date_or_date_range => "date_range",
                           :b_range_field_date_or_date_range => "date_range"
      child.errors[:a_date_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #date valid.
      child = create_child "Bob McBobberson", :a_date_field => Date.parse("30-May-2014"),
                           :a_range_field_date_or_date_range => "date_range",
                           :b_range_field_date_or_date_range => "date_range"
      child.errors[:a_date_field].should eq([])
    end

    it "should validate range fields" do
      #_from is wrong.
      child = create_child "Bob McBobberson", :a_range_field_from => "aslkdjflkj", :a_range_field_to => Date.parse("31-May-2014"),
                           :a_range_field_date_or_date_range => "date_range",
                           :b_range_field_date_or_date_range => "date_range"
      child.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #_to is wrong.
      child = create_child "Bob McBobberson", :a_range_field_from => "31-May-2014", :a_range_field_to => "alkdfjlj",
                           :a_range_field_date_or_date_range => "date_range",
                           :b_range_field_date_or_date_range => "date_range"
      child.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #_from and _to are wrong.
      child = create_child "Bob McBobberson", :a_range_field_from => "aslkjlkj3", :a_range_field_to => "alkdfjlkj",
                           :a_range_field_date_or_date_range => "date_range",
                           :b_range_field_date_or_date_range => "date_range"
      child.errors[:a_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #range valid dates.
      child = create_child "Bob McBobberson", :a_range_field_from => "31-May-2014", :a_range_field_to => "31-May-2014",
                           :a_range_field_date_or_date_range => "date_range",
                           :b_range_field_date_or_date_range => "date_range"
      child.errors[:a_range_field].should eq([])
    end

    it "should validate range fields with single date selected" do
      #Single date selected wrong in the date range field.
      child = create_child "Bob McBobberson", :b_range_field => "aslkdjflkj",
                           :b_range_field_date_or_date_range => "date",
                           :a_range_field_date_or_date_range => "date_range"
      child.errors[:b_range_field].should eq(["Please enter the date in a valid format (dd-mmm-yyyy)"])

      #valid date
      child = create_child "Bob McBobberson", :b_range_field => "31-May-2014", :b_range_field_date_or_date_range => "date",
                           :a_range_field_date_or_date_range => "date_range"
      child.errors[:b_range_field].should eq([])
    end
  end

  describe "record ownership" do

    before do
      User.all.each{|u| u.destroy}
      Child.all.each{|c| c.destroy}

      @owner = create :user
      @previous_owner = create :user
      @referral = create :user

      @case = build :child, owned_by: @owner.user_name, previously_owned_by: @previous_owner.user_name,
                             assigned_user_names: [@referral.user_name]

    end

    it "can fetch the record owner" do
      expect(@case.owner).to eq(@owner)
    end

  end

  describe "relationships" do
    before do
      @child1 = Child.new(data: {:family_details_section => [{"relation_name" => "Jill", "relation" => "mother"}, {"relation_name" => "Jack", "relation" => "father"}]})
      @child2 = Child.new(data: {:name => "Fred", :family_details_section => [{:relation_name => "Judy", :relation => "mother"}]})
      @child3 = Child.new(data: {:name => "Fred", :family_details_section => [{:relation_name => "Brad", :relation => "father"}]})
      @child4 = create_child("Daphne")
    end

    it "should return the fathers name" do
      expect(@child1.fathers_name).to eq("Jack")
    end

    it "should return the mothers name" do
      expect(@child2.mothers_name).to eq("Judy")
    end

    context "father does not exist" do
      it "should return nil for fathers name" do
        expect(@child2.fathers_name).to be_nil
      end
    end

    context "mother does not exist" do
      it "should return nil for mothers name" do
        expect(@child3.mothers_name).to be_nil
      end
    end

    context "family details does not exist" do
      it "should return nil for fathers name" do
        expect(@child4.fathers_name).to be_nil
      end

      it "should return nil for mothers name" do
        expect(@child4.mothers_name).to be_nil
      end
    end
  end

  describe "case id code" do
    before :all do
      Location.all.each &:destroy
      Role.all.each &:destroy
      Agency.destroy_all
      PrimeroModule.all.each &:destroy

      @permission_case ||= Permission.new(:resource => Permission::CASE,
                                          :actions => [Permission::READ, Permission::WRITE, Permission::CREATE])
      @location_country = Location.create! placename: "Guinea", type: "country", location_code: "GUI", admin_level: 0
      @location_region = Location.create! placename: "Kindia", type: "region", location_code: "GUI123", hierarchy: ["GUI"]
      admin_role = Role.create!(:name => "Admin", :permissions_list => Permission.all_permissions_list)
      field_worker_role = Role.create!(:name => "Field Worker", :permissions_list => [@permission_case])
      agency = Agency.create! id: "agency-unicef", agency_code: "UN", name: "UNICEF"
      a_module = PrimeroModule.create name: "Test Module"
      SystemSettings.create default_locale: "en"
      user = User.create({:user_name => "bob123", :full_name => 'full', :password => 'passw0rd', :password_confirmation => 'passw0rd',
                          :email => 'em@dd.net', :organization => agency.id, :role_ids => [admin_role.id, field_worker_role.id],
                          :module_ids => [a_module.unique_id], :disabled => 'false', :location => @location_region.location_code})
      user2 = User.create({:user_name => "joe456", :full_name => 'full', :password => 'passw0rd', :password_confirmation => 'passw0rd',
                           :email => 'em@dd.net', :organization => agency.id, :role_ids => [admin_role.id, field_worker_role.id],
                           :module_ids => [a_module.unique_id], :disabled => 'false', :location => ''})
      user3 = User.create!(:user_name => "tom789", :full_name => 'full', :password => 'passw0rd', :password_confirmation => 'passw0rd',
                           :email => 'em@dd.net', :organization => (Agency.count + 1), :role_ids => [admin_role.id, field_worker_role.id],
                           :module_ids => [a_module.unique_id], :disabled => 'false', :location => @location_region.location_code)
    end

    context 'system case code format empty' do
      before :all do
        SystemSettings.all.each &:destroy
        @system_settings = SystemSettings.create default_locale: "en"
      end

      it 'should create an empty case id code' do
        child = Child.create!(data: {case_id: 'xyz123', created_by: 'bob123'})
        expect(child.case_id_code).to be_nil
      end

      it 'should create a case id display that matches short id' do
        child = Child.create!(data: {case_id: 'xyz123', created_by: 'bob123'})
        expect(child.case_id_display).to eq(child.short_id)
      end
    end

    context 'system case code separator empty' do
      before :all do
        SystemSettings.all.each &:destroy
        ap1 = AutoPopulateInformation.new(field_key: 'case_id_code',
                                          format: [
                                              "created_by_user.Location.ancestor_by_type(country).location_code",
                                              "created_by_user.Location.ancestor_by_type(region).location_code",
                                              "created_by_user.agency.agency_code"
                                          ],
                                          auto_populated: true)

        @system_settings = SystemSettings.create(default_locale: "en", auto_populate_list: [ap1])
      end

      it 'should create a case id code without separators' do
        child = Child.create!(data: {case_id: 'xyz123', created_by: 'bob123'})
        expect(child.case_id_code).to eq("GUIGUI123UN")
      end

      it 'should create a case id display without separators' do
        child = Child.create!(data: {case_id: 'xyz123', created_by: 'bob123'})
        expect(child.case_id_display).to eq("GUIGUI123UN#{child.short_id}")
      end
    end

    context 'system case code format and separator present' do
      before :all do
        SystemSettings.all.each &:destroy
        ap1 = AutoPopulateInformation.new(field_key: 'case_id_code',
                                          format: [
                                              "created_by_user.Location.ancestor_by_type(country).location_code",
                                              "created_by_user.Location.ancestor_by_type(region).location_code",
                                              "created_by_user.agency.agency_code"
                                          ],
                                          separator: '-', auto_populated: true)

        @system_settings = SystemSettings.create(default_locale: "en", auto_populate_list: [ap1])
      end

      it 'should create a case id code with separators' do
        child = Child.create!(data: {case_id: 'xyz123', created_by: 'bob123'})
        expect(child.case_id_code).to eq("GUI-GUI123-UN")
      end

      it 'should create a case id display with separators' do
        child = Child.create!(data: { case_id: 'xyz123', created_by: 'bob123'})
        expect(child.case_id_display).to eq("GUI-GUI123-UN-#{child.short_id}")
      end

      it 'should create a case id code if user location is missing' do
        child = Child.create!(data: {case_id: 'abc456', created_by: 'joe456'})
        expect(child.case_id_code).to eq("UN")
      end

      it 'should create a case id display if user location is missing' do
        child = Child.create!(data: { case_id: 'abc456', created_by: 'joe456'})
        expect(child.case_id_display).to eq("UN-#{child.short_id}")
      end

      it 'should create a case id code if user agency is missing' do
        child = Child.create!(data: { case_id: 'zzz', created_by: 'tom789'})
        expect(child.case_id_code).to eq("GUI-GUI123")
      end

      it 'should create a case id display if user agency is missing' do
        child = Child.create!(data: { case_id: 'zzz', created_by: 'tom789'})
        expect(child.case_id_display).to eq("GUI-GUI123-#{child.short_id}")
      end
    end
  end

  describe 'syncing of protection concerns' do
    before do
      Child.destroy_all
      User.stub(:find_by_user_name).and_return(double(:organization => 'UNICEF'))
      @protection_concerns = ["Separated", "Unaccompanied"]
    end

    it "should add protection concerns from subform to multiselect protection concerns field" do
      @child = Child.new(data: {
                          'name' => "Tom", 'created_by' => "me", 'protection_concerns' => @protection_concerns,
                          'protection_concern_detail_subform_section' => [
                              {protection_concern_type: "Child is neglected"},
                              {protection_concern_type: "Extreme levels of poverty"},
                              {protection_concern_type: "Unaccompanied"}

      ]})
      @child.save!
      @child.protection_concerns.should == @protection_concerns + ["Child is neglected", "Extreme levels of poverty"]
    end

    it "should remove nils from protection concerns multiselect" do
      @child = Child.new(data: {
                       'name' => "Tom", 'created_by' => "me", 'protection_concerns' => @protection_concerns,
                       'protection_concern_detail_subform_section' => [
                           {protection_concern_type: "Child is neglected"},
                           {protection_concern_type: nil},
                           {protection_concern_type: nil},
                           {protection_concern_type: "Unaccompanied"}
                       ]})
      @child.save!
      @child.protection_concerns.should_not include(nil)
    end
  end

  describe 'calculate age', search: true do
    before do

      Child.destroy_all

      # The following is necessary so we get back date_of_birth from the DB as a Date object, not as a string
      Field.destroy_all
      FormSection.destroy_all
      fields = [
          Field.new({"name" => "child_status",
                     "type" => "text_field",
                     "display_name_all" => "Child Status"
                    }),
          Field.new({"name" => "date_of_birth",
                     "type" => "date_field",
                     "display_name_all" => "Date of Birth"
                    }),
          Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_all" => "Age"
                    })]
      form = FormSection.new(
          :unique_id => "form_section_test",
          :parent_form=>"case",
          "visible" => true,
          "name_all" => "Form Section Test",
          :fields => fields
      )
      form.save!

      @case1 = Child.create(data: {name: 'case1', date_of_birth: Date.new(2010, 10, 11)})
      @case2 = Child.create(data: {name: 'case2', date_of_birth: Date.new(2008, 10, 11)})
      @case3 = Child.create(data: {name: 'case3', date_of_birth: Date.new(2008, 3, 13)})
      @case4 = Child.create(data: {name: 'case4', date_of_birth: Date.new(1998, 11, 11)})
      @case5 = Child.create(data: {name: 'case5', date_of_birth: Date.new(2014, 10, 12)})
      @case6 = Child.create(data: {name: 'case6', date_of_birth: Date.new(2012, 2, 29)}) # leap year
      @case7 = Child.create(data: {name: 'case7', date_of_birth: Date.new(2012, 2, 14)}) # leap year
      @case8 = Child.create(data: {name: 'case8', date_of_birth: Date.new(2012, 10, 11)}) # leap year
      @case9 = Child.create(data: {name: 'case9', date_of_birth: Date.new(2015, 3, 1)})
      @case10 = Child.create(data: {name: 'case10', date_of_birth: Date.new(2014, 10, 10)})
      @case11 = Child.create(data: {name: 'case11', date_of_birth: Date.new(2010, 2, 28)}) # leap year
      Sunspot.commit
    end

    context 'when current date is non-leap year 2015' do
      before :each do
        Date.stub(:current).and_return(Date.new(2015, 10, 11))
        Date.stub(:yesterday).and_return(Date.new(2015, 10, 10))
      end

      it 'should find cases with birthdays today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).to include(@case1, @case2, @case8)
      end

      it 'should not find cases with birthdays not today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).not_to include(@case3, @case4, @case5, @case6, @case7)
      end

      it 'should find cases within a date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).to include(@case1, @case2, @case8, @case10)
      end

      it 'should not find cases that fall outside the given date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).not_to include(@case3, @case4, @case5, @case6, @case7)
      end

      it 'should calculate age with birthday tomorrow' do
        expect(@case5.calculated_age).to eq(0)
      end

      it 'should calculate age with birthday on leap day' do
        expect(@case6.calculated_age).to eq(3)
      end

      it 'should calculate age with birthday not on leap day' do
        expect(@case1.calculated_age).to eq(5)
      end
    end

    context 'when current date is March 1 on non-leap year' do
      before :each do
        Date.stub(:current).and_return(Date.new(2015, 3, 1))
        Date.stub(:yesterday).and_return(Date.new(2015, 2, 28))
      end

      it 'should find cases with birthdays today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).to include(@case9)
      end

      it 'should not find cases with birthdays not today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).not_to include(@case1, @case2, @case3, @case4, @case5, @case7, @case8, @case10, @case11)
      end

      it 'should find cases within a date range, including leap day' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).to include(@case6, @case9, @case11)
      end

      it 'should not find cases that fall outside the given date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).not_to include(@case1, @case2, @case3, @case4, @case5, @case7, @case8, @case10)
      end

      it 'should calculate age with birthday today' do
        expect(@case9.calculated_age).to eq(0)
      end

      it 'should calculate age with birthday on leap day' do
        expect(@case6.calculated_age).to eq(3)
      end

      it 'should calculate age with birthday not on leap day' do
        expect(@case1.calculated_age).to eq(4)
      end
    end

    context 'when current date is leap year 2016' do
      before :each do
        Date.stub(:current).and_return(Date.new(2016, 2, 29))
        Date.stub(:yesterday).and_return(Date.new(2016, 2, 28))
      end

      it 'should find cases with birthdays today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).to include(@case6)
      end

      it 'should not find cases with birthdays not today' do
        expect(Child.by_date_of_birth_range(Date.current, Date.current)).not_to include(@case1, @case2, @case3, @case4, @case5, @case7, @case8, @case9)
      end

      it 'should find cases within a date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).to include(@case6, @case11)
      end

      it 'should not find cases that fall outside the given date range' do
        expect(Child.by_date_of_birth_range(Date.yesterday, Date.current)).not_to include(@case1, @case2, @case3, @case4, @case5, @case7, @case8, @case9, @case10)
      end

      it 'should calculate age with birthday tomorrow' do
        expect(@case9.calculated_age).to eq(0)
      end

      it 'should calculate age with birthday on leap day' do
        expect(@case6.calculated_age).to eq(4)
      end

      it 'should calculate age with birthday not on leap day' do
        expect(@case1.calculated_age).to eq(5)
      end
    end
  end

  xdescribe "Batch processing" do
    before do
      Child.destroy_all
    end

    it "should process in two batches" do
      child1 = child_with_created_by("user1", :name => "child1")
      child2 = child_with_created_by("user2", :name => "child2")
      child3 = child_with_created_by("user3", :name => "child3")
      child4 = child_with_created_by("user4", :name => "child4")
      child4.create!
      child3.create!
      child2.create!
      child1.create!

      expect(Child.all.page(1).per(3).all).to include(child1, child2, child3)
      expect(Child.all.page(2).per(3).all).to include(child4)
      Child.should_receive(:all).exactly(3).times.and_call_original

      records = []
      Child.each_slice(3) do |children|
        children.each{|c| records << c.name}
      end

      records.should eq(["child1", "child2", "child3", "child4"])
    end

    it "should process in 0 batches" do
      Child.should_receive(:all).exactly(1).times.and_call_original
      records = []
      Child.each_slice(3) do |children|
        children.each{|c| records << c.name}
      end
      records.should eq([])
    end

  end

  xdescribe '.matching_tracing_requests' do
    before do
      # Create child form
      FormSection.all.each &:destroy
      fields = [
          Field.new({"name" => "name",
                     "type" => "text_field",
                     "display_name_all" => "Full Name",
                     "matchable" => true
                    }),
          Field.new({"name" => "name_nickname",
                     "type" => "text_field",
                     "display_name_all" => "Nickname",
                     "matchable" => true
                    }),
          Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_en" => "Age",
                     "matchable" => true
                    })
      ]

      form = FormSection.new(
          :unique_id => "form_section_test",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 50,
          :order => 15,
          :order_subform => 0,
          "editable" => true,
          "name_all" => "Form Section Test",
          "description_all" => "Form Section Test",
          :fields => fields
      )

      form.save!
      Child.any_instance.stub(:field_definitions).and_return(fields)
      Child.refresh_form_properties
      Child.all.each &:destroy

      # Create Tracing Request form
      fields = [
          Field.new({"name" => "name",
                     "type" => "text_field",
                     "display_name_en" => "Name",
                     "matchable" => true
                    }),
          Field.new({"name" => "name_nickname",
                     "type" => "text_field",
                     "display_name_en" => "Nickname",
                     "matchable" => true
                    }),
          Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_en" => "Age",
                     "matchable" => true
                    })
      ]

      tr_form = FormSection.create_or_update_form_section(
          {
              :unique_id=> "form_section_tracing_request_subform",
              "visible" => true,
              "is_nested" => true,
              :order => 1,
              "editable" => true,
              :fields => fields,
              :parent_form=>"tracing_request",
              "name_all" => "Form Section With Dates Fields",
              "description_all" => "Form Section With Dates Fields",
          }
      )

      tracing_request_tracing_request_fields = [
          Field.new(
              {
                  "name" => "tracing_request_subform_section",
                  "type" => "subform",
                  "editable" => true,
                  "subform_section_id" => tr_form.id,
                  "display_name_en" => "Tracing Request"
              }
          )
      ]

      FormSection.create_or_update_form_section(
          {
              :unique_id => "tracing_request_tracing_request",
              :parent_form=>"tracing_request",
              "visible" => true,
              :order_form_group => 30,
              :order => 30,
              :order_subform => 0,
              "editable" => true,
              "mobile_form" => true,
              :fields => tracing_request_tracing_request_fields,
              "name_en" => "Tracing Request",
              "description_en" => "Tracing Request"
          }
      )

      TracingRequest.any_instance.stub(:field_definitions).and_return(fields)
      TracingRequest.refresh_form_properties
      TracingRequest.all.each &:destroy
    end

    after :all do
      clean_up_objects
    end

    it 'matches traces from case' do
      child1 = Child.create(
          {
              name: 'child1',
              name_nickname: 'johnathan',
              age: 15,
              sex: 'male'
          }
      )
      tr = TracingRequest.create(
          {
              relation_name: 'mother',
              inquiry_date: '12-Nov-2018',
              tracing_request_subform_section: [{name_nickname: 'johnathan', age: 15, name: 'child1', sex: 'male'}]
          }
      )

      Child.stub(:find_match_records).and_return({"#{tr.id}"=>34.343723})

      potential_matches = child1.matching_tracing_requests
      expect(potential_matches).not_to be_empty
      expect(potential_matches.first.tracing_request_id).to eq(tr.id)
      trace = tr.traces(potential_matches.first.tr_subform_id).first
      expect(trace.name_nickname).to eq('johnathan')
    end
  end

  xdescribe 'match criteria' do
    before do
      Child.all.each &:destroy
      FormSection.all.each &:destroy
      fields = [
          Field.new({"name" => "name",
                     "type" => "text_field",
                     "display_name_all" => "name",
                     "matchable" => true
                    }),
          Field.new({"name" => "name_nickname",
                    "type" => "text_field",
                    "display_name_en" => "Nickname",
                    "matchable" => true
                    }),
          Field.new({"name" => "sex",
                     "type" => "text_field",
                     "display_name_en" => "Sex",
                     "matchable" => true
                    }),
          Field.new({"name" => "age",
                     "type" => "numeric_field",
                     "display_name_all" => "Age"
                    })]
      form = FormSection.new(
          :unique_id => "form_section_test",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 50,
          :order => 15,
          :order_subform => 0,
          "editable" => true,
          "name_all" => "Form Section Test",
          "description_all" => "Form Section Test",
          :fields => fields
      )
      form.save!
      Child.any_instance.stub(:field_definitions).and_return(fields)
      Child.refresh_form_properties

      @case1 = Child.create(name: 'case1', name_nickname: 'murtaza', sex: 'male')
      @case2 = Child.create(name: 'case2', age: 13, sex: 'male')
      @case3 = Child.create(age: 15)
      @matching_fields = { form_section_test: ["name"] }
    end

    context 'when field in match_fields' do
      it 'should find all values in match criteria' do
        expect(@case1.match_criteria).to eq({:name=>[@case1.name_nickname, @case1.name], :sex=>[@case1.sex]})
      end

      it 'should find matchable_fields values in match criteria' do
        expect(@case1.match_criteria(@case1, @matching_fields)).to eq({:name=>[@case1.name, @case1.name_nickname]})
      end
    end

    context 'when field not in match_fields' do
      it 'should find exact match criteria' do
        expect(@case2.match_criteria).to eq({:name=>[@case2.name], :sex=>[@case2.sex]})
      end

      it 'should find exact match criteria with matchable_fields' do
        expect(@case2.match_criteria(@case2, @matching_fields)).to eq({:name=>[@case2.name]})
      end
    end

    context 'when field is not matchable' do
      it 'should find no criteria' do
        expect(@case3.match_criteria()).to eq({})
      end

      it 'should find no criteria with matchable_fields' do
        expect(@case3.match_criteria(@case3, @matching_fields)).to eq({})
      end
    end
  end

  describe "family_detail_values" do
    before do
      @case1 = Child.new(data: {:name => "Fred", :family_details_section => [{"relation_name" => "Jill", "relation" => "mother"}, {"relation_name" => "Jack", "relation" => "father"}]})
      @case2 = Child.new(data: {:name => "Fred", :family_details_section => [{:relation_name => "Judy", :relation => "mother"}]})
      @case3 = create_child("Daphne")
    end

    context 'when mutiple fields' do
      it "should return the relations names" do
        expect(@case1.family_detail_values("relation_name")).to eq("Jill Jack")
      end
    end

    context 'when single field' do
      it 'should return a single relation name' do
        expect(@case2.family_detail_values("relation")).to eq("mother")
      end
    end

    context 'when no fields' do
      it 'should find no family details' do
        expect(@case3.family_detail_values("relation")).to be_nil
      end
    end
  end

  after :all do
    Child.destroy_all
    Field.destroy_all
    FormSection.destroy_all
  end

  private

  def create_child(name, options={})
    #TODO - i18n
    options.merge!("name" => name, "last_known_location" => "new york", 'created_by' => "me", 'created_organization' => "stc")
    Child.create(data: options)
  end

  def create_duplicate(parent)
    duplicate = Child.create(:name => "dupe")
    duplicate.mark_as_duplicate(parent['short_id'])
    duplicate.save!
    duplicate
  end

  def child_with_created_by(created_by, options = {})
    user = User.new({:user_name => created_by, :organization=> "UNICEF"})
    Child.new_with_user user, options
  end
end
