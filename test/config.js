describe('Config factory', function() {
  var Config;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('Standout'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_Config_) {
    Config = _Config_;
  }));

  // A simple test to verify the Users factory exists
  it('should exist', function() {
    expect(Config).toBeDefined();
  });

  describe('serverRequest', function() {
      it ('should return an array', function(done) {
          Config.serverRequest('GET', 'http://localhost:3000/suppliers', {}, function(suppliers) {
              expect(typeof(suppliers.data)).toEqual('Array');
              done();
          });
      });
  });


});
