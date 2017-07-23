import re
import copy
import praw

class MyComment:

    def __init__(self, comment):
        self.body = comment.body
        self.subreddit = comment.subreddit.display_name
        self.permalink = 'https://www.reddit.com/r/' + self.subreddit + '/comments/' + comment.submission.id + '//' + comment.id
        self.id = comment.id

class SortComments:


    def __init__(self, **kwargs):
        self.comments = []
        self.dic = []
        self.comment_limit = kwargs.get('comment_limit', None)
        self.user_name = kwargs.get('user_name', None)
        self.search = kwargs.get('search', None)
        self.subreddit = kwargs.get('subreddit', None)
        self.show_text = kwargs.get('show_text', False)
        self.show_links = kwargs.get('show_links', False)

    def sortComments(self):
       
        #Fill client_id, client_secret, and user_agent with valid credentials
        r = praw.Reddit(client_id='<client_id>',
                        client_secret='<clinet_secret>',
                        user_agent='<user_agent>')

        if(self.getUserName()):
            comments = r.redditor(self.user_name).comments.new(limit=self.comment_limit)
            for comment in comments:
                newComment = MyComment(comment)
                self.comments.append(newComment)

                
            if(self.getSubreddit()):
                self.subredditComments(self.subreddit)

        elif(self.getSubreddit()):
            comments = r.subreddit(self.subreddit).comments(limit=self.comment_limit)
            for comment in comments:
                newComment = MyComment(comment)
                self.comments.append(newComment)

        else:
            comments = r.subreddit('redditdev').comments(limit=self.comment_limit)
            for comment in comments:
                newComment = MyComment(comment)
                self.comments.append(newComment)

        if(self.getSearch()):
            self.wordSearchComments(self.search)


    def printJson(self):
        comments = self.getComments()
        for comment in comments:
            print("[ + {'comment_text':" + comment.body + ", 'comment_link': 'https://www.reddit.com/r/" + comment.subreddit.display_name  + "/comments" + comment.submission.id + "//" + comment.id + "'}, ")


    def getJson(self):
        return self.dic

    def fillJson(self):
        comments = self.getComments()
        for comment in comments:
                self.dic.append({'comment_link': comment.permalink, "comment_text": comment.body, "comment_id": comment.id})


    def printSelfComments(self):
        comments = self.getComments()
        for comment in comments:
            print(comment.body)
    
    def printArgs(self):
        args = self.getArgs()
        if(args.user_name):
            print(args.user_name)

    def getComments(self):
        return self.comments

    def getSubreddit(self):
        return self.subreddit

    def getUserName(self):
        return self.user_name

    def getSearch(self):
        return self.search
    
    def wordSearchComments(self, search_list):
        comments_list = []
        search_list = search_list.split("###")
        comments = self.getComments()
        for comment in self.comments:
            comment_text = comment.body.lower()
            if any(phrase.lower() in comment_text for phrase in search_list):
                comments_list.append(comment)
        self.comments = comments_list

    def subredditComments(self, input_subreddit_name):
        output_comments_list = []
        comments = self.getComments()
        for comment in comments:
            if (input_subreddit_name.lower() == comment.subreddit.lower()):
                output_comments_list.append(comment)
        self.comments = output_comments_list





