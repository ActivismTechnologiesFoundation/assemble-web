(function ($) {

    var FlashView = Backbone.View.extend({
        events: {
            'click .close' : 'hide'
        },

        initialize: function() {
            this.template = Handlebars.compile($('#flash-view-template').html());
        },

        render: function(data) {
            $('body').find('#flash-alert').remove();

            var $el = $(this.template(data));
            $('body').prepend($el);

            this.setElement($el);

            return this.$el;
        },

        showError: function(text) {
            this._show(text, 'danger');

        },

        showWarning: function(text) {
            this._show(text, 'warning');
        },

        showSuccess: function(text) {
            this._show(text, 'success');
        },

        hide: function() {
            this.$el.hide();
        },

        _show: function(text, type) {
            this.render({text: text, type: type});
            this.$el.show();
        }
    });

    AssembleApp.Views.FlashView = new FlashView();

})(jQuery);