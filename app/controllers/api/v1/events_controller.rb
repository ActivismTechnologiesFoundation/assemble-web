module Api
  module V1
    class EventsController < BaseController
      before_action :convert_timestamps, only: [:create, :update]

      def show
        @event = Event.find(params[:id])
        render_event(event)
      end

      def index
        @events = Event.filter(filter_params)
      end

      def create
        success = false
        ActiveRecord::Base.transaction do 

          @event = Event.new(event_params)

          raise ActiveRecord::Rollback unless success = @event.save
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

      def filter_params
        permitted = [
          :topic_id,
          :zipcode
        ]
        params.permit(permitted)
      end

      def event_params 

        params.require(:event).permit(
          :name, 
          :description, 
          :url,
          :address,
          :zipcode,
          :starts_at, 
          :ends_at,
          topic: [
            :id
          ]
        )
      end
    end
  end
end