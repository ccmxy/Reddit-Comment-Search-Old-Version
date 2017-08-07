
# Requirements

-  [gunicorn](http://gunicorn.org) 19.3.0
- [falcon](https://falconframework.org/) 1.2.0
- [praw 5.0.1](https://praw.readthedocs.io/en/latest/)

# To use
- Set access_control_allow_origin to '*' (or wherever you want requests from) in [server.py](server.py).
- Set '<client_id>, <client_secret>, and <client_agent> to your [registered reddit app](https://www.reddit.com/prefs/apps/) in [sortComments.py](RedditCommentsSearchPckg/sortComments.py).
-  Run `gunicorn server:api --bind 0.0.0.0` to start server on localhost
-  Verify that server is running by checking http://localhost:8000/comments 
-  Change SERVER_ADDRESS in [script.js](../website/script.js) to your local server address.

