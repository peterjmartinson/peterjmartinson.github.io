---
layout: post
title: Twitch Client
excerpt: See who is streaming at TwitchTV!
tags: [Node.js, jQuery, HTML]
---

## Description

Twitch Client allows a user to see whether certain streamers are streaming on [{ TwitchTV }](https://www.twitch.tv).  The user gets different responses depending on whether 1. the streamer exists, 2. the streamer is currently streaming, or 3. the streamer is currently not streaming.  Currently, the list of potential streamers is hard-coded into the application, but a planned improvement is to add a search feature.

## Execution

The project uses the [{ TwitchTV API }](https://dev.twitch.tv/), which is accessed by [{ jQuery }](https://jquery.com) AJAX handlers.

There are AJAX calls to three Twitch endpoints.

1. `https://wind-bow.glitch.me/twitch-api/users/<channel>?callback=?` - This endpoint provides basic existence information about the user.

2. `https://wind-bow.glitch.me/twitch-api/channels/<channel>?callback=?` - This one is needed to get the user's avatar.

3. `https://wind-bow.glitch.me/twitch-api/streams/<channel>?callback=?` - Needed to get details of what the user is currently streaming.

The program initiates the process by calling the `/users/` route with

{% highlight javascript %}

{% endhighlight %}
