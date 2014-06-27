/*! @license Â©2013 Ruben Verborgh - Multimedia Lab / iMinds / Ghent University */
/** Browser interface for the LDF client. */

var LinkedDataFragmentsClientUI = (function ($, Q) {
  var ldf = require('ldf-client'),
      SparqlIterator = ldf.SparqlIterator,
      FragmentsClient = ldf.FragmentsClient,
      Logger = ldf.Logger,
      N3 = require('n3');

  // Creates a new Linked Data Fragments Client UI
  function LinkedDataFragmentsClientUI(element, target, query, startFragment, callback) {
    this.query = query;
    this._$element = $(element);
    this._target = target;
    this._callback = callback;
    this.config = {};
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
     "dbpprop":     "http://dbpedia.org/property/"
    };


    console.log("created new client");
  }

  // Activates the Linked Data Fragments Client UI
  LinkedDataFragmentsClientUI.prototype.activate = function () {
      var query = this.query;
      var startFragment = this.startFragment;
      var config = this.config;
      var target = this._target;
      var callback = this._callback;
      var $results = this._$element.find('.results');

      $results.empty();

      console.log("activated new client");
      // Create the iterator to solve the query
      config.fragmentsClient = new FragmentsClient(config.startFragment, config);
      var sparqlIterator = new SparqlIterator(query, config);
      switch (sparqlIterator.parsedQuery.type) {
        // Write a JSON array representation of the rows
        case 'SELECT':
          var resultsCount = 0;
          addToResults('[');
          sparqlIterator.on('data', function (row) {
            addToResults(resultsCount++ ? ',\n' : '\n', row);
          });
          sparqlIterator.on('end', function () {
            addToResults(resultsCount ? '\n]' : ']');
          });
        break;
        // Write an RDF representation of all results
        case 'CONSTRUCT':
          var writer = new N3.Writer({ write: function (chunk, encoding, done) {
            addToResults(chunk), done && done();
          }}, config.prefixes);
          sparqlIterator.on('data', function (triple) { writer.addTriple(triple); })
                        .on('end',  function () { writer.end(); });
        break;
        default:
          throw new Error('Unsupported query type: ' + sparqlIterator.parsedQuery.type);
      }
      sparqlIterator.on('end', function () {
          var resultString = $results.text();
          target = JSON.parse(resultString);
          console.log('done');
          console.log(target);
          callback();
      });
      sparqlIterator.on('error', function (error) { console.log(error.message); throw error; });
      sparqlIterator.read();

    // Add text to the results
    function addToResults() {

      for (var i = 0, l = arguments.length; i < l; i++) {
        var item = arguments[i];
        if (typeof item !== 'string')
          item = JSON.stringify(item, null, '  ');
        console.log(item);
        $results.append(item);
      }

    };

  };

  return LinkedDataFragmentsClientUI;
})(jQuery);
