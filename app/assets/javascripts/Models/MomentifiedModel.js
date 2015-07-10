
(function () {

    Backbone.MomentifiedModel = Backbone.Model.extend({
        constructor: function (attributes, options) {
            attributes || (attributes = {});
            options || (options = {});

            this.format || (this.format = options.format);

            this.momentify_attributes(attributes);

            arguments[0] = attributes;
            
            Backbone.Model.prototype.constructor.apply(this, arguments);
        }, 

        momentify_attributes: function(a){
            var attrs = !!a ? a : this.attributes;
            this._enumerate_time_attributes(function(key, value, attributes) {
                if(!moment.isMoment(value)) {
                    if(this.format == "unix") {
                        attributes[key] = moment.unix(attributes[key]);
                    } else {
                        attributes[key] = moment(attributes[key]);
                    }
                }
            }.bind(this), attrs);
        },

        unix_clone: function() {
            var clone = this.clone();

            clone._enumerate_time_attributes(function(key, value, attributes){
                if(moment.isMoment(value)) {
                    attributes[key] = Number(value) / 1000.0;
                }
            },  clone.attributes);

            return clone;
        },

        _enumerate_time_attributes: function(callback, attributes) {
            _.keys(attributes).forEach(_.bind(function (key) {
                var value = attributes[key];
                if (!!key.match(/_at$/) && !!value) {
                    callback(key, value, attributes);
                }
            }, this));
        }
    });

})();
