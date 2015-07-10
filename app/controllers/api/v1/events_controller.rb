module Api
  module V1
    class EventsController < ApplicationController
      before_action :convert_timestamps, only: [:create, :update]

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
        success = false
        ActiveRecord::Base.transaction do 

          @event = Event.new(event_params)
                  puts "starts_atstarts_atstarts_atstarts_at #{@event.starts_at}"
                                    puts "starts_atstarts_atstarts_atstarts_at #{@event.starts_at}"


          success = @event.save

          topic = Topic.find(params[:topic_id])
          @event.topics << topic if success

          raise ActiveRecord::Rollback unless success
        end

        render_event(@event, success)
      end

      def update
        @event = Event.find(params[:id])

        success = @event.update(event_params)

        render_event(@event, success)
      end

      private 

      def convert_timestamps
        event = params[:event]

        return if event.blank?

        event[:starts_at] = Time.at(event[:starts_at]) unless event[:starts_at].blank?
      end

      def render_event(event, success=true)
        status = success ? :ok : :unprocessable_entity

        render template: "api/v1/events/show", locals: { event: event }, status: status
      end

      def event_params 
        permitted = [
          :name, 
          :topic_id,
          :description, 
          :url,
          :address,
          :starts_at, 
          :ends_at
        ]
        params.require(:event).permit(permitted)
      end
    end
  end
end