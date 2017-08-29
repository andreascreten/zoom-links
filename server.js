'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})

//*********************************************
// Setup different handlers for messages
//*********************************************

var sendMessage = function(msg, zoomId) {
  msg.say({
    text: 'Hey, that looks like a Zoom ID! Join now: https://teamleader.zoom.us/j/' + zoomId + ".\n\nHave a good meeting, Andreas.",
    as_user: true
  });
}

// response to the user typing "help"
slapp.message('^([0-9]{9,12})$', (msg) => {
  sendMessage(msg, msg.body.event.text)
})

slapp.message('^\<tel\:[0-9-]{9,12}\|([0-9-]{9,12})\>', (msg) => {
  var zoomId = msg.body.event.text.replace(/^\<tel\:[0-9-]{9,12}\|/, '').replace('-', '').replace('-', '').replace('>', '');
  sendMessage(msg, zoomId);
})



// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
