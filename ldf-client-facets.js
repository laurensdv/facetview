/*! @license Â©2013 Ruben Verborgh - Multimedia Lab / iMinds / Ghent University */
/** Browser interface for the LDF client. */

var LinkedDataFragmentsClientFacets = (function ($) {
  var ldf = require('ldf-client'),
      SparqlIterator = ldf.SparqlIterator,
      FragmentsClient = ldf.FragmentsClient,
      Logger = ldf.Logger,
      N3 = require('n3');

  // Creates a new Linked Data Fragments Client UI
  function LinkedDataFragmentsClientFacets(subject, predicate, objVal, startFragment, callback) {
    this.pattern = { 'subject' : subject, 'predicate' : predicate, 'object' : objVal };
    this._callback = callback;
    this.config = {};
    this.resultsString = "";
    this.config.startFragment = startFragment;
    this.config.prefixes = {
     "rdf":         "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
     "rdfs":        "http://www.w3.org/2000/01/rdf-schema#",
     "owl":         "http://www.w3.org/2002/07/owl#",
     "skos":        "http://www.w3.org/2004/02/skos/core#",
     "xsd":         "http://www.w3.org/2001/XMLSchema#",
     "dc":          "http://purl.org/dc/terms/",
     "dcterms":     "http://purl.org/dc/terms/",
     "dc11":        "http://purl.org/dc/elements/1.1/",
     "foaf":        "http://xmlns.com/foaf/0.1/",
     "geo":         "http://www.w3.org/2003/01/geo/wgs84_pos#",
     "dbpedia":     "http://dbpedia.org/resource/",
     "dbpedia-owl": "http://dbpedia.org/ontology/",
     "dbpprop":     "http://dbpedia.org/property/",
    };

    console.log("created new client");
  }

  // Activates the Linked Data Fragments Client UI
  LinkedDataFragmentsClientFacets.prototype.activate = function () {
      var pattern = this.pattern;
      var startFragment = this.startFragment;
      var config = this.config;
      var callback = this._callback;
      var deferred = Q.defer();

      console.log("activated new client");
      // Create the iterator to solve the query
      config.fragmentsClient = new FragmentsClient(config.startFragment, config);

      var result = config.fragmentsClient.getFragmentByPattern(pattern);

      result.on('error', function (error) { callback(pattern, { totalTriples : 0}); deferred.resolve();  });

      result.getProperty('metadata', function (metadata) {
        callback(pattern, metadata);
        deferred.resolve();
      });

      return deferred.promise;
  };

  return LinkedDataFragmentsClientFacets;
})(jQuery);
