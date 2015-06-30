module Api
  module V1
    class EventsController < ApplicationController

      def show
        @event = Event.find(params[:id])
        render_event(event)
      end

      def index
        topic_id = params[:topic_id].to_i

        @events = if topic_id && topic_id > 0
          Topic.find(topic_id).events.order(created_at: :desc).limit(10)
        else
          Event.order(created_at: :desc).limit(10)
        end
      end

      def create
        @event = Event.new(event_params)
        success = @event.save

        render_event(@event, success)
      end

      def update
        @event = Event.find(params[:id])

        success = @event.update(event_params)

        render_event(@event, success)
      end

      private 

      def render_event(event, success=true)
        status = success ? :ok : :unprocessable_entity

        render template: "api/v1/events/show", locals: { event: event }, status: status
      end

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