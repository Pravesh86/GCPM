class MapController < ApplicationController
  def index
    @title = t 'map'
    @params = request.query_parameters

    # Common vars
    @countries = Country.all
    @organizations = Organization.all
    @organization_types = OrganizationType.all
    @cancer_types = CancerType.all
    @project_types = ProjectType.all
    respond_to do |format|
        format.html
        format.js
    end
  end
end