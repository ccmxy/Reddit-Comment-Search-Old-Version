# server.py
import falcon
import json
import praw
import argparse
from RedditCommentSearchPckg import SortComments

class GetComments:
    def on_get(self, req, resp):
        resp.set_header('Access-Control-Allow-Origin', 'http://146.148.107.191/')

        """Handles GET requests"""        		
        comment_limit = req.get_param('comment_limit', None)
        user_name = req.get_param('user_name', None)
        show_links = req.get_param('show_links', False)
        show_text= req.get_param('show_text', None)
        search = req.get_param('search', None)
        subreddit = req.get_param('subreddit', None)

        sortCommentsObject = SortComments(commit_limit=comment_limit, show_links=show_links, show_text=show_text, subreddit=subreddit, user_name=user_name, search=search)
        sortCommentsObject.sortComments() #sort the comments depending on user options (if no user or sub chosen, comments taken from r/redditdev)

        sortCommentsObject.fillJson()
        dic = sortCommentsObject.getJson()
    	resp.body = json.dumps(dic)
    

api = falcon.API()
api.add_route('/comments', GetComments())
