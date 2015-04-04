json.(event, 
  :id,
  :name, 
  :topic, 
  :description, 
  :url,
)

json.starts_at  event.starts_at.to_f unless event.starts_at.blank?
json.ends_at    event.ends_at.to_f unless event.ends_at.blank?