# frozen_string_literal: true
Rails.application.routes.draw do
  resources :kudos, only: [:index, :create, :update], constraints: { format: :json }, defaults: { format: :json }

  get 'kudos_app', to: 'kudos_app#index'
  get 'settings', to: 'kudos_app#index'
  get 'present', to: 'kudos_app#index'

  # Auth
  get 'auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'logout', to: 'sessions#destroy', as: 'logout'

  post 'users/settings', to: 'users#update'

  post 'like', to: 'likes#like'
  post 'unlike', to: 'likes#unlike'

  resources :sessions, only: [:new, :create, :destroy]

  get 'home/show'

  root to: 'kudos_app#index'
end
