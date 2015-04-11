String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.camelCase = function() { 
    return this.toLowerCase().replace(/[_-](.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}