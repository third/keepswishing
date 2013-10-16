var toolbox = require('../config/toolbox')
  , config = toolbox.config
  , path = require('path')
  , jade = require('jade')
  , fs = require('fs')


var send = function(toEmail, subject, html, next){
  var mandrill = require('node-mandrill')(config.mailer.apiKey);

  mandrill('/messages/send', {
      message: {
          to: [{email: toEmail, name: toEmail}],
          from_email: config.mailer.from,
          from_name: config.mailer.fromFriendlyName,
          subject: subject,
          html: html
      }
  }, function(error, response) {
      //uh oh, there was an error
      if(error) {
        console.log(JSON.stringify(error));
      }
      //everything's good, lets see what mandrill said
      else {
        console.log(response);
      } 
  });
}


var sendByTemplate = function(template, templateOptions, toEmail, subject){ 

  var jadetemplate = jade.compile(fs.readFileSync(path.resolve(__dirname, template), 'utf8'), {filename: path.resolve(__dirname, '../views/pages/master/mailer.jade')});
  var html = jadetemplate(templateOptions);

  send(toEmail, subject, html);
}


var sendConfirmSignupEmail = function(toEmail, templateOptions){
  sendByTemplate('../views/pages/content/mailer/user/confirm-signup.jade', templateOptions, toEmail, 'Please verify your email address');
}



exports.send: send

exports.sendByTemplate: sendByTemplate

exports.sendConfirmSignupEmail: sendConfirmSignupEmail
