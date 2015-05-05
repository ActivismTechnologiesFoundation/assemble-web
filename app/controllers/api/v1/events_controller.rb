module Api
  module V1
    class EventsController < ApplicationController

      def show
        @event = Event.find(params[:id])
        render template: "api/v1/events/show", event: @event
      end

      def index
        topic_id = params[:topic_id].to_i

        @events = if topic_id && topic_id > 0
          Topic.find(topic_id).events.limit(10)
        else
          Event.limit(10)
        end
      end

      def create
        @event = Event.create!(event_params)
        render template: "api/v1/events/show", event: @event
      end

      def update
        @event = Event.find(params[:id])
        @event.update!(event_params)
        render template "api/v1/events/show", event: @event
      end

      private 

      def event_params 
        permitted = [
          :name, 
          :topic, 
          :description, 
          :url,
          :starts_at, 
          :ends_at
        ]
        params.require(:event).permit(permitted)
      end
    end
  end
end