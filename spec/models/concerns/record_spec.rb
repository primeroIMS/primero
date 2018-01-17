
require 'rails_helper'

_Child = Class.new(CouchRest::Model::Base) do
  def self.parent_form
    'case'
  end

  include Record

  property :name, String
  property :bio, String
end

describe Record do
  describe 'media histories' do
    it "should delete the newly created media history(current_photo_key and recorded_audio) as the media names are changed before save of child record" do
      existing_histories = {"unique_id" => "h1", "user_name" => "rapidftr", "datetime" => "2013-01-01 00:00:01UTC", "changes" => {"sex" => {"to" => "male", "from" => "female"}}}
      given_histories = [existing_histories,
                         {"unique_id" => 'h2', "datetime" => "2013-02-04 06:55:03", "user_name" => "rapidftr", "changes" => {"current_photo_key" => {"to" => "2c097fa8-b9ab-4ae8-aa4d-1b7bda7dcb72","from" => "photo-364416240-2013-02-04T122424"}}, "user_organization" => "N/A"},
                         {"unique_id" => 'h3', "datetime" => "2013-02-04 06:58:12","user_name" => "rapidftr","changes" => {"recorded_audio" => {"to" => "9252364d-c011-4af0-8739-0b1e9ed5c0ad1359961089870","from" => ""}}, "user_organization" => "N/A"}
                        ]
      child = _Child.new("name" => "existing name", "last_updated_at" => "2013-12-12 00:00:01UTC", "histories" =>  [existing_histories])
      given_properties = {"name" => "given name", "last_updated_at" => "2013-01-01 00:00:00UTC", "histories" => given_histories}
      child.update_properties_with_user_name "rapidftr", nil, nil, nil, false, given_properties
      histories = child["histories"]
      histories.size.should == 1
      histories.first["changes"]["current_photo_key"].should be_nil
    end
  end

  describe 'update_properties' do
    it 'updates last_updated_by with the given user even if provided in the attributes' do
      c = _Child.new("name" => "Bob")
      c.stub(:field_definitions).and_return([])
      c.save!
      c.update_properties({"last_updated_by" => "random guy", "name" => "Rob"}, 'primero')
      c.last_updated_by.should == 'primero'
    end
  end
end
