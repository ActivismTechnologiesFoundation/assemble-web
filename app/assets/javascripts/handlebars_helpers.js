Handlebars.registerHelper("momentToString", function(momentObj, format){
  return momentObj.format(format);
});
