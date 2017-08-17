require 'addressable/uri'

FactoryGirl.define do
  factory :replication, :traits => [ :model ] do
    description 'Sample Replication'
    remote_app_uri PrimeroURI.parse('https://example.com:1234')
    username 'test_user'
    password 'test_password'
    couch_target_uri PrimeroURI.parse("https://couch.example.com:5984/replication_test")

    after_build do |replication|
      replication.stub :fetch_remote_couch_config => true
    end
  end
end