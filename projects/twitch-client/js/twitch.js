var twitch = {};

/**
 * Adds streamer information to the webpage
 *   hint: this is the callback!
 * @params {string} The name of the streamer
 * @params {string} The link to the streamer's avatar
 * @params {object} Response package from Twitch
 * @returns {object} The streamer's information
*/
twitch.addStreamer = function(channel, logo, response) {
  var list_element = '',
      url          = 'https://www.twitch.tv/',
      now_streaming = {},
      new_list_element;
  list_element += '<li>';
  if (response == 404) { // doesn't exist
    url += channel;
    list_element += '  <div class="logo"><img src="' + logo + '"></div>';
    list_element += '  <div class="streamer">';
    list_element += '    <strong>' + channel + '</strong><br>';
    list_element += '    <em>&nbsp;&nbsp;&nbsp;&nbsp;does not exist.</em>';
    list_element += '  </div>'
    new_list_item = $(list_element);
  } else {
    if (response.stream) {  // is currently streaming
    now_streaming = response.stream.game,
    url += channel;
    list_element += '  <a href="' + url + '" target="_blank">';
    list_element += '    <div class="logo"><img src="' + logo + '"></div>';
    list_element += '    <div class="streamer">';
    list_element += '      <strong>' + channel + '</strong><br>';
    list_element += '      <em>&nbsp;&nbsp;&nbsp;&nbsp;is currently streaming ' + now_streaming + '</em>';
    list_element += '    </div>'
    list_element += '  </a>';
    new_list_item = $(list_element);
    } else {  // is not currently streaming
      url += channel;
      list_element += '  <a href="' + url + '" target="_blank">';
      list_element += '    <div class="logo"><img src="' + logo + '"></div>';
      list_element += '    <div class="streamer">';
      list_element += '      <strong>' + channel + '</strong><br>';
      list_element += '      <em>&nbsp;&nbsp;&nbsp;&nbsp;is not currently streaming.</em>';
      list_element += '    </div>'
      list_element += '  </a>';
      new_list_item = $(list_element);
    }
  }
  list_element += '</li>';
  new_list_item.appendTo( $( 'ul' ) );
  return response.stream;
}

/**
 * See if a channel is currently streaming, or even exists
 *   hint: this function calls twitch.addStreamer() !!
 * @params {string} The name of the streamer
 * @params {function} Function that receives the data, usually fetchCurrent()
*/
twitch.fetchStreamer = function(channel, callback) {
  var base_url = 'https://wind-bow.glitch.me/twitch-api/users/',
      suffix = '?callback=?',
      url = base_url + channel + suffix;
  $.getJSON(url, function(data) {

    var logo_base_url = 'https://wind-bow.glitch.me/twitch-api/channels/',
        logo_suffix = '?callback=?',
        logo_url = logo_base_url + channel + logo_suffix;
    $.getJSON(logo_url, function(logo_data) {
      var logo = logo_data.logo != null ? logo_data.logo : "https://dummyimage.com/64x64/ffd9aa/552f00.png&text=@";
      if ( data.status != '422' && data.status != '404' ) {
        callback(1, channel, logo, twitch.addStreamer);
      } else {
        callback(0, channel, logo, twitch.addStreamer);
      }
    });
  });
};


/**
 * Get the streaming channel's info
 *
 * @params {boolean} Flag that indicates whether the channel exists
 * @params {string} The name of the streamer
 * @params {string} The link to the streamer's avatar
 * @params {function} Function that receives the data, usually addStreamer()
*/
twitch.fetchCurrent = function(exists, channel, logo, callback) {
  var base_url = 'https://wind-bow.glitch.me/twitch-api/streams/',
      suffix = '?callback=?',
      url = base_url + channel + suffix;
  if (exists) {
    $.getJSON(url, function(data) {
      callback(channel, logo, data);
    });
  } else {
    callback(channel, logo, 404);
  }
};

twitch.fetchStreamer('ESL_SC2', twitch.fetchCurrent);
twitch.fetchStreamer('freecodecamp', twitch.fetchCurrent);
twitch.fetchStreamer('cretetion', twitch.fetchCurrent);
twitch.fetchStreamer('comster404', twitch.fetchCurrent);

