if @event.errors.blank?
  json.partial! "api/v1/events/event", event: @event
else
  json.errors @event.errors
end