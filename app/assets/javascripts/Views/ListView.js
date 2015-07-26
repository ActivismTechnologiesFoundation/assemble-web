(function ($) {
  AssembleApp.Views.ListView = Backbone.View.extend({
    events: {
      "scroll" : "user_scrolled"
    },

    initialize: function (options) {
      this.views = {};
      this.view = options.view;
      this.type = options.type;
      this.view_options = options.viewOptions || {};
      this.auto_scroll = options.auto_scroll;
      this.infinite_scroll_bottom = options.infinite_scroll_bottom;
      this.infinite_scroll_top = options.infinite_scroll_top;

      this.listenTo(this.collection, "reset", this.reset);
      this.listenTo(this.collection, "add", this.add);
      this.listenTo(this.collection, "remove", this.remove);
      this.listenTo(this.collection, "fetching_next", this.fetching_next);
      this.listenTo(this.collection, "fetching_next_complete", this.fetching_next_complete);
    },

    render: function () {
      this.reset();

      return this.$el;
    },

    reset: function () {
      this.__reset();
      this.scroll_up();
    },

    __reset: function() {
      this.$el.html("");

      this.collection.forEach(function (model) {
        this.add(model, { disable_scroll: true });
      }, this);
    },

    add: function (model, options) {
      options = options || {};

      var view = new this.view(_.extend({model: model}, this.view_options)),
        index = this.collection.indexOf(model),
        $after = this.$("li:nth-child("+(index+1)+")");

      if ($after.size() == 0) {
        this.$el.append(view.render());
      } else{
        view.render().insertBefore($after);
      }

      if(!options.disable_scroll) {
        this.scroll_up();
      }

      this.views[model.id] = view;
    },

    remove: function (model) {      
      this.$("#"+this.type+"-"+model.get("id")).remove();
      this.scroll_up();

      delete this.views[model.id];
    },

    scroll_up: function(argument) {
      if (this.auto_scroll && this.$("li").length) {
        this.$el
          .stop(true)
          .scrollTo(this.$("li").last(), { duration: 400 });
      }
    },

    user_scrolled: function(){

      if(this.__scrolled_bottom() && this.infinite_scroll_bottom) {
        this.trigger("scrolled_to_bottom");
        this.fetch_more_data();
      }

      if(this.__scrolled_top() && this.infinite_scroll_top) { 
        this.trigger("scrolled_to_top");
        this.fetch_more_data();
      }
    },

    reset_page: function() {
      this.collection.page = 2;
    },

    fetch_more_data: function(){
      if(_.isFunction(this.collection.fetch_next_page)) {
        if(!this.collection.isLoading) {
          this.collection.fetch_next_page();
        }
      }
    },

    fetching_next: function(){
      this.$("li.loading").remove();

      var loadingTag = "<li class='loading'>Loading More...</li>";

      if(this.infinite_scroll_bottom) {
        this.$el.append(loadingTag);
      } else if(this.infinite_scroll_top) {
        this.$el.prepend(loadingTag);
      }
    },

    fetching_next_complete: function() {
      this.$("li.loading").remove();

      var before_height = this.$el[0].scrollHeight;

      this.__reset();

      var difference = this.$el[0].scrollHeight - before_height;

        end_of_fetched_content = this.infinite_scroll_top ? 0 : this.$el[0].scrollHeight;
        offset = this.infinite_scroll_top ? -difference + 20 : difference + this.$el.innerHeight();

      this.$el.scrollTop(end_of_fetched_content - offset);
    },

    __scrolled_top: function() {
      return this.$el.scrollTop() == 0;
    },

    __scrolled_bottom: function() {
      return this.$el.scrollTop() + this.$el.innerHeight() >= this.$el[0].scrollHeight;
    }

  });
})(jQuery);
