class CancerTypesController < ApplicationController
  before_action :set_cancer_type, only: :show

  respond_to :html, :js

  def index
  end

  def show
    @page = params.key?(:page) && params[:page] ? params[:page].to_i : 1
    @title = t 'map'
    @filters = %w(projects events)
    @current_type = params.key?(:data) ? params[:data] : 'projects'
    @user_data = current_user.present? ? JSON.generate(build_user_data) : nil

    limit = 12 + (@page * 9)

    if params.key?(:data) && params[:data] == 'events'
      events = Event.fetch_all(cancer_types: @cancer_type.id).order('created_at DESC')
      @items = events.limit(limit)
      @more = (events.size > @items.size)
      @items_total = events.size
    else
      projects = Project.fetch_all(cancer_types: @cancer_type.id).order('created_at DESC')
      @items = projects.limit(limit)
      @more = (projects.size > @items.size)
      @items_total = projects.size
    end

    respond_with(@items)
    # @filters = %w(projects events)
    # @limit = 15
    # @projects = Project.fetch_all(cancer_types: @cancer_type.id)
    #   .order('created_at DESC')
    #   .limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    # @projectsCount = Project.fetch_all(cancer_types: @cancer_type.id).length
    # @events = Event.fetch_all(cancer_types: @cancer_type.id)
    #   .order('created_at DESC')
    #   .limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    # @eventsCount = Event.fetch_all(cancer_types: @cancer_type.id).length

    # @current_type = params[:data] || 'projects'
    # @organizations  = Organization.fetch_all(cancer_types: @cancer_type.id)
    # .order('created_at DESC')
    # .limit(params[:limit] ? params[:limit].to_i * @limit : @limit)
    # @organizationsCount = @organizations.length
  end

  private

  def set_cancer_type
    @cancer_type = CancerType.find_by(id: params['id'])
  end

  def build_user_data
    if current_user.name && current_user.email
      user_initial = current_user.email[0].upcase
    else
      user_initial = 'U'
    end
    {
      user_project: Project.where("user_id = #{current_user.id}").count,
      user_event: Event.where("user_id = #{current_user.id}").count,
      user_initial: user_initial
    }
  end

end
