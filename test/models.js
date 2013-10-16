var expect = require('expect.js')
  , async = require('async') 
  , Toolbox = require('../config/toolbox')
  , Enums = require('../config/enums')
  , Counter = require('../app/models/counter')
  , User = require('../app/models/user')




before(function() {
  var connStr = Toolbox.config.db + '-test';        //connect to the test database
  require('../config/db')(connStr, function() {

  });  
});


describe('Counter', function(){
  var uniqueNumber = (new Date()).getTime();

  after(function(done) {
    //delete user if there's any
    Counter.remove({_id: uniqueNumber}, function(err) {
      if(err) {
        throw err;
      }

      done();
    });
  });

  it('should increment', function(done){
    async.parallel([
      function(callback){
        Counter.nextNumber(uniqueNumber, function(err, result) {
          callback(null, result);
        });
      },
      function(callback){
        Counter.nextNumber(uniqueNumber, function(err, result) {
          callback(null, result);
        });
      }
    ],
    function(err, results){
      expect(results[0]).to.be(1);
      expect(results[1]).to.be(2);
      done();
    });
  });
});



describe('User', function(){
  var username = 'somename@example.com';
  var password = 'commonpassword';
  var userId = '';                              //to be filled after save
  var dummyusername = 'dummyusername';
  var dummypassword = 'dummypassword';
  var dummyuserId = '';
  

  before(function(done) {
    //delete user if there's any
    User.remove({username: username}, function(err) {
      if(err) {
        throw err;
      }

      var testUser = new User({
          username: username.toUpperCase(),       //username should always be turned to lower case so we're passing upper case here for testing
          password: password
      });

      testUser.save(function(err, doc) {
        userId = doc.id;
        done();
      });
    });
  });


  it('should not be authenticated', function(done) {
    User.getAuthenticated(dummyusername, dummypassword, function(err, doc, reason) {
      expect(reason).to.be(Enums.userReasons.NOT_FOUND);

      done();
    });
  });

  it('should be authenticated', function(done) {
    User.getAuthenticated(username, password, function(err, doc, reason) {
      expect(reason).to.be(undefined);
      expect(doc.username).to.be(username);

      done();
    });
  });


  it('should get incorrect password', function(done) {
    User.getAuthenticated(username, dummypassword, function(err, doc, reason) {
      expect(reason).to.be(Enums.userReasons.PASSWORD_INCORRECT);

      done();
    });
  });

  it('should get MAX_ATTEMPTS after 5 tries', function(done) {
    User.getAuthenticated(username, dummypassword, function(err, doc, reason) {
      expect(reason).to.be(Enums.userReasons.PASSWORD_INCORRECT);

      User.getAuthenticated(username, dummypassword, function(err, doc, reason) {
        expect(reason).to.be(Enums.userReasons.PASSWORD_INCORRECT);

        User.getAuthenticated(username, dummypassword, function(err, doc, reason) {
          expect(reason).to.be(Enums.userReasons.PASSWORD_INCORRECT);

          User.getAuthenticated(username, dummypassword, function(err, doc, reason) {
            expect(reason).to.be(Enums.userReasons.PASSWORD_INCORRECT);

            User.getAuthenticated(username, dummypassword, function(err, doc, reason) {
              expect(reason).to.be(Enums.userReasons.MAX_ATTEMPTS);

              done();
            });
          });
        });

      });

    });
  });

  describe('#getByUsername', function() {
    it('should find username ' + username, function(done) {
      User.getByUsername(username, function(err, doc, reason) {
        expect(doc.username).to.be(username);

        done();
      });
    });

    it('should NOT find username ' + dummyusername, function(done) {
      User.getByUsername(dummyusername, function(err, doc, reason) {
        expect(reason).to.be(Enums.userReasons.NOT_FOUND);

        done();
      });
    });
  });


  describe('#getById', function() {
    it('should find user id ' + userId, function(done) {
      User.getById(userId, function(err, doc, reason) {
        expect(doc.id).to.be(userId);

        done();
      });
    });

    it('should NOT find user id ' + dummyuserId, function(done) {
      User.getByUsername(dummyuserId, function(err, doc, reason) {
        expect(reason).to.be(Enums.userReasons.NOT_FOUND);

        done();
      });
    });
  });
});

