require 'rails_helper'

describe ChildrenController do
  describe "routing" do
    it "recognizes and generates #index" do
      { :get => "/children" }.should route_to(:controller => "children", :action => "index")
    end

    it "recognizes and generates #new" do
      { :get => "/children/new" }.should route_to(:controller => "children", :action => "new")
    end

    it "recognizes and generates #show" do
      { :get => "/children/1" }.should route_to(:controller => "children", :action => "show", :id => "1")
    end

    it "recognizes and generates #edit" do
      { :get => "/children/1/edit" }.should route_to(:controller => "children", :action => "edit", :id => "1")
    end

    it "recognizes and generates #create" do
      { :post => "/children" }.should route_to(:controller => "children", :action => "create")
    end

    it "recognizes and generates #update" do
      { :put => "/children/1" }.should route_to(:controller => "children", :action => "update", :id => "1")
    end

    it "recognizes and generates #destroy" do
      { :delete => "/children/1" }.should route_to(:controller => "children", :action => "destroy", :id => "1")
    end

    it "recognizes and generates #search" do
      { :get => '/children/search' }.should route_to(:controller => 'children', :action => 'search')
    end

    it 'handles a multi-child export request' do
      { :post => 'advanced_search/export_data' }.should route_to( :controller => 'advanced_search', :action => 'export_data' )
    end
  end

  describe "aliased routing" do
    it "recognizes and generates aliased #index" do
      { :get => "/cases" }.should route_to(:controller => "children", :action => "index")
    end

    it "recognizes and generates aliased #new" do
      { :get => "/cases/new" }.should route_to(:controller => "children", :action => "new")
    end

    it "recognizes and generates aliased #show" do
      { :get => "/cases/1" }.should route_to(:controller => "children", :action => "show", :id => "1")
    end

    it "recognizes and generates aliased #edit" do
      { :get => "/cases/1/edit" }.should route_to(:controller => "children", :action => "edit", :id => "1")
    end

    it "recognizes and generates aliased #create" do
      { :post => "/cases" }.should route_to(:controller => "children", :action => "create")
    end

    it "recognizes and generates aliased #update" do
      { :put => "/cases/1" }.should route_to(:controller => "children", :action => "update", :id => "1")
    end

    it "recognizes and generates aliased #destroy" do
      { :delete => "/cases/1" }.should route_to(:controller => "children", :action => "destroy", :id => "1")
    end

    it "recognizes and generates aliased #search" do
      { :get => '/cases/search' }.should route_to(:controller => 'children', :action => 'search')
    end
  end

  describe "RapidFTR compatible api routing" do
    it "recognizes and generates RapidFTR #index" do
      { :get => "/api/children" }.should route_to(:controller => "children", :action => "index", :format => :json)
    end

    it "recognizes and generates RapidFTR #new" do
      { :get => "/api/children/new" }.should route_to(:controller => "children", :action => "new", :format => :json)
    end

    it "recognizes and generates RapidFTR #show" do
      { :get => "/api/children/1" }.should route_to(:controller => "children", :action => "show", :id => "1", :format => :json)
    end

    it "recognizes and generates RapidFTR #edit" do
      { :get => "/api/children/1/edit" }.should route_to(:controller => "children", :action => "edit", :id => "1", :format => :json)
    end

    it "recognizes and generates RapidFTR #create" do
      { :post => "/api/children" }.should route_to(:controller => "children", :action => "create", :format => :json)
    end

    it "recognizes and generates RapidFTR #update" do
      { :put => "/api/children/1" }.should route_to(:controller => "children", :action => "update", :id => "1", :format => :json)
    end
  end
end
