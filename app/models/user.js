var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt')
  , Toolbox = require('../../config/toolbox')
  , Enums = require('../../config/enums')
  , SALT_WORK_FACTOR = 10
  , MAX_LOGIN_ATTEMPTS = 5
  , LOCK_TIME = 2 * 60 * 60 * 1000;


var UserSchema = new Schema({
  clientId: {type: Schema.Types.ObjectId, ref: 'Client'},
  username: {type: String, required: true, unique: true, lowercase: true},
  password: {type: String, required: true},
  loginAttempts: {type: Number, required: true, default: 0},
  lockUntil: {type: Number},
  firstName: {type: String, default: '', trim: true},
  lastName: {type: String, default: '', trim: true},
  confirmed: {type: Boolean, default: false},
  confirmedAt: {type: Date},
  status: {type: String, enum: ['Unconfirmed', 'Active', 'Inactive'], default: 'Unconfirmed'},
  createdAt: {type: Date, default: Toolbox.now}
});


UserSchema.virtual('isLocked').get(function() {
  // check for a future lockUntil timestamp
  return !!(this.lockUntil && this.lockUntil > Toolbox.now());
});


UserSchema.virtual('fullName').get(function() {
  var result = (this.firstName + ' ' + this.lastName).trim();
  
  if(result === ''){
    result = 'Unknown Friend';
  }

  return result;
});


UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if(!user.isModified('password')) {
    return next();
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) {
      return next(err);
    }

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if(err){
        return next(err);
      }

        // set the hashed password back on our user document
        user.password = hash;
        return next();
    });
  });
});


UserSchema.method('comparePassword', function(candidatePassword, next) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if(err) {
      return next(err);
    }

    next(null, isMatch);
  });
});


UserSchema.method('incLoginAttempts', function(next) {
  
  // if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Toolbox.now()) {
    return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
    }, next);
  }
  
  // otherwise we're incrementing
  var updates = {$inc: {loginAttempts: 1}};

  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = {lockUntil: Toolbox.now() + LOCK_TIME};
  }
  
  return this.update(updates, next);
});



UserSchema.static('getById', function(userId, next) {
  this.findOne({_id: mongoose.Types.ObjectId(userId)}, {password: 0}, function(err, user){
    if(err) {
      return next(err);  
    } 

    // make sure the user exists
    if(!user) {
      return next(null, null, Enums.userReasons.NOT_FOUND);
    }

    return next(null, user)
  });
});


UserSchema.static('getByUsername', function (username, next) {
  this.findOne({username: username}, {password: 0}, function(err, user){
    if(err){
      return next(err);
    }
    
    if(!user) {
      return next(null, null, Enums.userReasons.NOT_FOUND);
    }

    return next(null, user);
  });
});


UserSchema.static('getAuthenticated', function(username, password, next) {
  this.findOne({username: username}, function(err, user) {
    if(err) {
      return next(err);
    }

    // make sure the user exists
    if(!user) {
      return next(null, null, Enums.userReasons.NOT_FOUND);
    }

    //check if the account is currently locked
    if(user.isLocked) {

      // just increment login attempts if account is already locked
      return user.incLoginAttempts(function(err) {
        if(err){
          return next(err);
        } 
        
        return next(null, null, Enums.userReasons.MAX_ATTEMPTS);
      });
    }

    // test for a matching password
    user.comparePassword(password, function(err, isMatch) {
      if (err) return next(err);

      // check if the password was a match
      if(isMatch) {
        
        // if there's no lock or failed attempts, just return the user
        if (!user.loginAttempts && !user.lockUntil) {
          return next(null, user);
        }
        
        // reset attempts and lock info
        var updates = {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 }
        };
        
        return user.update(updates, function(err) {
          if(err){
            return next(err);
          } 
          
          return next(null, user);
        });
      }

      // password is incorrect, so increment login attempts before responding
      user.incLoginAttempts(function(err) {
        if(err){
          return next(err);
        }

        return next(null, null, Enums.userReasons.PASSWORD_INCORRECT);
      });
    });
  });
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
