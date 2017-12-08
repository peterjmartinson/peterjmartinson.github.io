// Testing with QUnit
var q = QUnit;

// ===== fetchCurrent =========================

q.module('fetchCurrent()');
q.test('There is a module', function(assert) {
  assert.equal(typeof twitch, 'object', 'twitch is an object');
});

q.test('The AJAX call succeeds', function(assert) {
  // var done = assert.async();
  var channel = 'freecodecamp';
  console.log(assert);
  twitch.fetchCurrent(channel, function(channel, res) {
    // assert.notEqual(res, {}, 'the response is not empty');
    // assert.equal(typeof res, 'object', 'there was a response');
    // done();
  });
});

// ===== THE LIST =========================

// q.module('The List');
// q.test('addStreamer', function(assert) {
//   assert.equal(typeof twitch.addStreamer, 'function', 'is a function');
// });

// q.test('fetchCurrent', function(assert) {
//   assert.equal(typeof twitch.fetchCurrent, 'function', 'is a function');
// });

// q.test('addStreamer adds an element to the fixture', function(assert) {
//   var fixture = $( '#qunit-fixture' );

//   fixture.append( '<ul id="fixture-ul"></ul>' );
//   assert.equal( $( '#fixture-ul', fixture ).length, 1, 'div added successfully');
//   // twitch.addStreamer({name : 'freecodecamp'});
//   // assert.equal( $( 'li' ).length, 1, 'li added successfully');
// });

// q.test('addStreamer determines whether a channel is streaming', function(assert) {
//   var done = assert.async();
//   var streaming = 'ESL_SC2';
//   var not_streaming = 'freecodecamp';

//   twitch.fetchCurrent(streaming, function(channel, res) {
//     assert.notEqual(twitch.addStreamer(channel, res), null, streaming + ' is streaming');
//   });
//   twitch.fetchCurrent(not_streaming, function(channel, res) {
//     assert.equal(twitch.addStreamer(channel, res), null, not_streaming + ' is not streaming');  
//     done();
//   });
// });


















