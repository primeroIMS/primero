require 'spec_helper'

describe Ability do

  CRUD = [:index, :create, :view, :edit, :update, :destroy]


  describe "Records" do

    it "allows an owned record to be read given a read permission" do
    end

    it "doesn't allow an owned record to be written to given only a read permission" do
    end

    it "allows a non-owned but associated record to be read" do
    end

    it "allows an owned record to be written to given a write permission" do
    end

    it "allows an owned record to be flagged" do
    end

    it "allows an owned record to be reassigned" do
    end

    it "doesn't allow a record to be written to even if the record can be flagged and assigned" do
    end

    it "doesn't allow a record owned by someone else to be read by a user with no specified scope" do
    end

    it "doesn't allow a record owned by someone else to be read by a user with a 'self' scope" do
    end

    it "allows a record owned by a fellow group member to be read by a user with 'group' scope" do
    end

    it "allows a record owned by someone else to be read by a user with full 'all' scope" do
    end

  end

  describe "Users" do
    it "allows a user with read permissions to edit their own user" do
    end

    it "allows a user with no expicit 'user' permission to edit their own user" do
    end

    it "doesn't allow a user with no explicit 'user' permission to read or edit another user" do
    end

    it "doesn't allow a user with no specified scope to edit another user" do
    end

    it "allows a user with group scope to only edit another user in that group" do
    end

    it "allows viewing and editing of Users, Groups, Roles, and Agencies if the 'user' permission is set along with 'read' and 'write'" do
    end

  end

  describe "Other resources" do
    it "allows viewing and editing of Metadata resources if that permission is set along with 'read' and 'write'" do
    end

    it "allows viewing and editing of System resources if that permission is set along with 'read' and 'write'" do
    end

  end

end
