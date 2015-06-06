class EventsController < ApplicationController
  def index
    @topics = Topic.all
    @topics << Topic.new(name: 'all', id: 0)
  end
end