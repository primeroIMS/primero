require 'spec_helper'

describe ChildrenController do
  describe "routing" do
    it "recognizes and generates #index" do
      { :get => "/case" }.should route_to(:controller => "children", :action => "index")
    end

    it "recognizes and generates #new" do
      { :get => "/case/new" }.should route_to(:controller => "children", :action => "new")
    end

    it "recognizes and generates #show" do
      { :get => "/case/1" }.should route_to(:controller => "children", :action => "show", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/case/1/edit" }.should route_to(:controller => "children", :action => "edit", :id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/case" }.should route_to(:controller => "children", :action => "create")
    end

    it "recognizes and generates #update" do
      { :put => "/case/1" }.should route_to(:controller => "children", :action => "update", :id => "1")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/case/1" }.should route_to(:controller => "children", :action => "destroy", :id => "1")
    end

    it "recognizes and generates #search" do
      { :get => '/case/search' }.should route_to(:controller => 'children', :action => 'search')
    end

    it 'handles a multi-child export request' do
      { :post => 'advanced_search/export_data' }.should route_to( :controller => 'advanced_search', :action => 'export_data' )
    end
  end
end
