(function ($) {

  AssembleApp.Views.EventsView = Backbone.View.extend({
    el: $('#events-top-level-view'),

    events: {
      'click #add-event': 'showEventForm'
    },

    initialize: function(options) {
      this.template = Handlebars.compile($('#events-top-level-view-template').html());
      this.eventsCollection = new AssembleApp.Collections.Events();

      this.eventsListView = new AssembleApp.Views.ListView({
        collection: this.eventsCollection,
        view: AssembleApp.Views.EventListCellView,
        type: 'event'
      });

      var topics = new Backbone.Collection(options.topics);
      this.topicSelect = new AssembleApp.Views.CustomSelectView({
        collection: topics
      });
      this.topicSelect.setSelected(topics.at(topics.length-1));

      this.listenTo(this.topicSelect, 'value_changed', this.fetchEvents);

      this.render();

      this.eventsCollection.fetch();
    },

    render: function() {
      var data = {};

      this.$el.html(this.template(data));

      this.assign(this.topicSelect, '#topic-select')
      this.assign(this.eventsListView, '#events-list');

      return this.$el;
    },

    assign: function(view, selector) {
      view.setElement(this.$(selector)).render();
    },

    fetchEvents: function(topic) {
      this.eventsCollection.fetch({data: {topic_id: topic.id}, reset: true});
    },

    showEventForm: function() {
      this.eventForm = new AssembleApp.Views.EventForm();
      $('body').append(this.eventForm.render());
    }

  });

  AssembleApp.Views.EventForm = Backbone.View.extend({
    tag: 'div',

    className: 'event-form-container',

    events: {
      'click'  : 'dismiss',
      'submit' : 'submit'
    },

    initialize: function() {
      this.model || (this.model = new AssembleApp.Models.Event());
      this.template = Handlebars.compile($('#event-form-template').html());
    },

    render: function() {
      var data = this.model.toJSON();
      this.$el.html(this.template(data));

      return this.$el;
    },

    submit: function(event){
      event.preventDefault();
    },

    dismiss: function(event) {
      if(event.target != this.$('form').get(0) && 
         $(event.target).parent('form').length == 0) {
        this.$el.remove();
      }
    }
  });

  AssembleApp.Views.EventListCellView = Backbone.View.extend({
    tagName: 'li',

    className: 'event-cell',

    initialize: function(){
      this.template = Handlebars.compile($('#event-list-cell-view-template').html());
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      return this.$el;
    }
  });

  AssembleApp.Views.CustomSelectView = Backbone.View.extend({
    events: {
      'click li': 'valueChanged'
    },

    initialize: function() {
      this.template = Handlebars.compile($('#topic-select-view-template').html());
    },

    render: function() {
      var data = { values: this.collection.toJSON(), selected: this.currentValue().get('name')};
      this.$el.html(this.template(data));

      return this.$el;
    },

    valueChanged: function(event) {
      var $selectedItem = $(event.currentTarget),
          selectedId = $selectedItem.data('id');

      this.setSelected(this.collection.get(selectedId));
    },

    setSelected: function(selectedValue) {
      this.currentValue() ? this.currentValue().set('classes', '') : 0;

      selectedValue.set('classes', 'selected');

      this.selectedValue = selectedValue;

      this.trigger('value_changed', selectedValue);

      this.render();
    },

    currentValue: function() {
      return this.selectedValue;
    },
  });

})(jQuery);
