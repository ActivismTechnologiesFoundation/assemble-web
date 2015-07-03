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

      this.topics = new Backbone.Collection(options.topics);
      this.topicSelect = new AssembleApp.Views.CustomSelectView({
        collection: this.topics
      });
      this.topicSelect.setSelected(this.topics.at(this.topics.length-1));

      this.listenTo(this.topicSelect, 'value_changed', this.fetchEvents);

      this.render();

      this.eventsCollection.fetch();
    },

    render: function() {
      var data = {};

      this.$el.html(this.template(data));

      this.assign(this.topicSelect, '#topic-select');
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
      var eventForm = new AssembleApp.Views.EventForm({topics: this.topics});

      this.listenToOnce(eventForm, 'save_success', this.updateEvents);

      $('body').append(eventForm.render());
    },

    updateEvents: function() {
      this.fetchEvents(this.topicSelect.currentValue());
    }

  });

  AssembleApp.Views.EventForm = Backbone.View.extend({
    tag: 'div',

    className: 'event-form-container',

    events: {
      'click #overlay'  : 'tapped_outside',
      'submit' : 'submit'
    },

    bindings: {
      '#name' : 'name',
      '#topic' : 'topic',
      '#description': 'description',
      '#url' : 'url',
      '#address' : 'address'
    },

    initialize: function(options) {
      this.topics = options.topics;

      this.model = this.model ? this.model : new AssembleApp.Models.Event();

      this.template = Handlebars.compile($('#event-form-template').html());

      this.topicSelect = new AssembleApp.Views.CustomSelectView({
        collection: this.topics, 
        collapsable: true
      });
    },

    render: function() {
      var data = this.model.toJSON();
      data.topics = this.topics.toJSON();

      this.$el.html(this.template(data));

      this.assign(this.topicSelect, '.topic-dropdown');

      this.stickit();

      return this.$el;
    },

    assign: function(view, selector) {
      view.setElement(this.$(selector)).render();
    },

    submit: function(event){
      event.preventDefault();

      function success(model) {
        this.trigger('save_success', this.model);
        this.close();
      }

      function error(model, response) {
        this.process_errors(response.responseJSON.errors);
      }
      this.model.save({}, {success: success.bind(this), error: error.bind(this)});
    },

    process_errors: function(errors) {
      for(var key in errors) {
        this.$('#'+key+'.validatable').removeClass('valid').addClass('error');
      }
    },

    tapped_outside: function(event) {
      event.preventDefault();
      event.stopPropagation();
      //   console.log($(event.target).parents('form'));

      // if(event.target != this.$('form').get(0) && 
      //    $(event.target).parents('form', this.$('form')).length === 0) {
        this.close();
      // }
    },

    close: function(){
      this.$el.remove();
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
      'click li': 'valueChanged',
      'click .dropdown': 'toggleDropdown'
    },

    initialize: function(options) {
      this.collapsable = !!options.collapsable;
      this.template = Handlebars.compile($('#topic-select-view-template').html());
    },

    render: function() {
      var data = { 
        values: this.collection.toJSON(), 
        selected: this.currentValue().get('name'), 
        collapsable: this.collapsable
      };
      this.$el.html(this.template(data));

      return this.$el;
    },

    valueChanged: function(event) {
      var $selectedItem = $(event.currentTarget),
          selectedId = $selectedItem.data('id');

      this.setSelected(this.collection.get(selectedId));

      if(this.collapsable) {
        this.render();
        this.toggle();
      }
    },

    toggleDropdown: function() {
      this.$('ul').toggle();
    },

    setSelected: function(selectedValue) {
      if(this.currentValue()) {
        this.currentValue().set('classes', '');
      }

      selectedValue.set('classes', 'selected');

      this.selectedValue = selectedValue;

      this.trigger('value_changed', selectedValue);

      this.render();
    },

    currentValue: function() {
      return this.selectedValue || new Backbone.Model({name: 'Topic of event'});
    },
  });

})(jQuery);
