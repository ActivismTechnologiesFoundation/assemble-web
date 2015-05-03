(function ($) {

  AssembleApp.Views.EventsView = Backbone.View.extend({
    el: $('#events-top-level-view'),

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
      'change select': 'valueChanged'
    },

    initialize: function() {
      this.template = Handlebars.compile($('#custom-select-view-template').html());
    },

    render: function() {
      var data = { values: this.collection.toJSON(), selected: this.$('select').val()};
      this.$el.html(this.template(data));

      return this.$el;
    },

    valueChanged: function() {
      this.trigger('value_changed', this.currentValue());
    },

    currentValue: function() {
      return this.collection.get(this.$('select').val());
    },
  });

})(jQuery);
