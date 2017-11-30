require 'rails_helper'

module Security
  describe SessionSecret do
    before :each do
      SessionSecret.stub :env => "some_test_rails_env"
    end

    it 'should generate and save secret when not present in database' do
      SessionSecret.stub :fetch => nil, :create => {"token" => "some_secret", "key_base" => "some_key_base"}
      SessionSecret.session_secret.should == {"token" => "some_secret", "key_base" => "some_key_base"}
    end

    it 'should return saved secret if present in database' do
      SessionSecret.stub :fetch => {"token" => "some_secret", "key_base" => "some_key_base"}, :create => {"token" => "some_other_secret", "key_base" => "some_other_key_base"}
      SessionSecret.should_not_receive(:create)
      SessionSecret.session_secret.should == {"token" => "some_secret", "key_base" => "some_key_base"}
    end

    it 'fetch should return saved secret from CouchDB' do
      SessionSecret.stub :database => SessionSecret.database
      SessionSecret.database.should_receive(:get).with("session_secret").and_return("value" => {"token" => "random_secret_2", "key_base" => "random_key_base_2"})
      SessionSecret.fetch.should == {"token" => "random_secret_2", "key_base" => "random_key_base_2"}
    end

    it 'save should save secret to CouchDB' do
      SessionSecret.stub :generate => "random_secret_1", :database => SessionSecret.database
      SessionSecret.database.should_receive(:save_doc).with("_id" => "session_secret", "value" => {"token" => "random_secret_1", "key_base" => "random_secret_1"}).and_return(true)
      SessionSecret.create.should == {"token" => "random_secret_1", "key_base" => "random_secret_1"}
    end

    it 'should return current rails env' do
      RSpec::Mocks.space.proxy_for(SessionSecret).reset
      SessionSecret.env.should == Rails.env
    end

    it 'database name should match db_prefix and db_suffix' do
      SessionSecret.stub :env => "random"
      SessionSecret.database.name.should match(/^#{COUCHDB_CONFIG[:db_prefix]}/)
      SessionSecret.database.name.should match(/#{COUCHDB_CONFIG[:db_suffix]}$/)
    end

    #Old format session secret value should be transparent converted to the new format.
    describe "Manage Old Format" do
      before :each do
        #Assumed database contains the old format.
        @database = SessionSecret.database
        @database.save_doc "_id" => "session_secret", "value" => "Old Format"
      end

      it 'should fetch nil session secret because old format' do
        @database.get("session_secret")["value"].should == "Old Format"
        #Current session secret value is based on the old format.
        #Fetch should returns nil because the format.
        SessionSecret.fetch.should == nil
      end

      it 'should recreate session secret because old format' do
        SessionSecret.stub :generate => "New Format"
        @database.get("session_secret")["value"].should == "Old Format"
        #Session secret should be converted to the new format.
        SessionSecret.session_secret.should == {"token" => "New Format", "key_base" => "New Format"}
      end

      it 'should recreate session secret because old format' do
        SessionSecret.stub :generate => "New Format"
        SessionSecret.stub :database => SessionSecret.database
        #Retrieve the current value which is the old format.
        doc = {"value" => "Old Format"}
        SessionSecret.database.should_receive(:get).with("session_secret").and_return(doc)
        #Doc with old format should be delete to avoid conflict when recreate document.
        SessionSecret.database.should_receive(:delete_doc).with(doc)
        #New value format for the session secret.
        secret_value = {"token" => "New Format", "key_base" => "New Format"}
        params_doc = {"_id" => "session_secret", "value" => secret_value }
        #Because old format call the method to create the new secret session.
        SessionSecret.database.should_receive(:save_doc).with(params_doc)
        SessionSecret.session_secret.should == secret_value
      end
    end

    after :each do
      SessionSecret.database.delete!
    end

  end
end
