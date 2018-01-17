require 'rails_helper'

describe ApplicationController do

  let(:user_full_name) { 'Bill Clinton' }
  let(:user) { User.new(:full_name => user_full_name) }
  let(:session) { double('session', :user => user) }

  describe 'current_user_full_name' do
    it 'should return the user full name from the session' do
      controller.stub(:current_session).and_return(session)
      subject.current_user_full_name.should == user_full_name
    end
  end

  describe 'locale' do
    it "should be set to default" do
      controller.stub(:current_session).and_return(session)
      @controller.set_locale
      I18n.locale.should == I18n.default_locale
    end

    it "should be change the locale" do
      user = double('user', :locale => :ar)
      session = double('session', :user => user)
      controller.stub(:current_session).and_return(session)

      @controller.set_locale
      user.locale.should == I18n.locale
    end

    context "when hasn't translations to locale" do
      before :each do
        user = double('user', :locale => :ar)
        session = double('session', :user => user)
        controller.stub(:current_session).and_return(session)
      end

      xit "should set be set to default" do

      end
    end
  end

  describe "user" do
    it "should return me the current logged in user" do
      user = User.new(:user_name => 'user_name', :role_names => ["default"])
      User.should_receive(:find_by_user_name).with('user_name').and_return(user)
      session = Session.new :user_name => user.user_name
      controller.stub(:current_session).and_return(session)
      controller.current_user.user_name.should == 'user_name'
    end
  end

  describe '#encrypt_data_to_zip' do
    before :each do
      controller.params[:password] = 'test_password'
    end

    it 'should send encrypted zip with one file' do
      password = 's3cr3t'
      files = [ RapidftrAddon::ExportTask::Result.new("/1/2/3/file_1.pdf", "content 1") ]
      data = "content 1"
      filename = "test"

      controller.should_receive(:send_file) do |file, opts|
        Zip::InputStream.open(file, 0, Zip::TraditionalDecrypter.new(password)) do |ar|
          entry = ar.get_next_entry
          ar.read.should == data
        end
      end

      controller.send(:encrypt_data_to_zip, data, filename, password)
    end

    it 'should send proper filename to the browser' do
      CleansingTmpDir.stub :temp_file_name => 'encrypted_file'
      Zip::File.stub :open => true

      controller.should_receive(:send_file).with('encrypted_file', hash_including(:filename => 'test_filename.csv.zip', :type => 'application/zip', :disposition => "inline"))
      controller.encrypt_data_to_zip '', 'test_filename.csv', ''
    end
  end

end
