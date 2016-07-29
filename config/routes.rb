Rails.application.routes.draw do
  devise_for :users
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  get '/',               to: 'home#index',         as: 'home'
  get '/map',            to: 'map#index',          as: 'map'
  get '/countries',      to: 'countries#index',    as: 'countries'
  get '/countries/:iso', to: 'countries#show',     as: 'country'
  get '/cancer-types',   to: 'cancer_types#index', as: 'cancers'
  get '/about',          to: 'about#index',        as: 'about'

  # User profile projects
  get    'network/:user_id/projects',             to: 'network_projects#index',  as: 'user_projects'
  get    'network/:user_id/projects/:project_id', to: 'network_projects#show',   as: 'user_project'
  get    'network/projects/new',                  to: 'network_projects#new',    as: 'new_user_project'
  post   'network/projects/create',               to: 'network_projects#create', as: 'create_user_project'
  get    'network/projects/edit/:project_id',     to: 'network_projects#edit',   as: 'edit_user_project'
  put    'network/projects/update/:project_id',   to: 'network_projects#update', as: 'update_user_project'
  delete 'network/projects/delete/:project_id',   to: 'network_projects#delete', as: 'delete_user_project'

  # Admin
  #get 'admin/excel-uploader', to: 'admin/excel_uploader#new', as: :admin_excel_uploader

  namespace :api, defaults: { format: 'json' } do
    scope module: :v1 do
      resources :regions,      only: [:index, :show]
      resources :cancer_types, only: [:index, :show], path: '/cancer-types'

      get 'lists/countries',    to: 'lists#countries'
      get 'lists/cancer-types', to: 'lists#cancer_types'
    end
  end

  root to: 'home#index'
end
