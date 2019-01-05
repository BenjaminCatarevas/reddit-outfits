import praw

import config
from database import RedditOutfitsDatabase
from util_url import extract_outfit_urls_from_comment

'''
This script is ran once every hour on all subreddits.
'''

def change_in_thread(old_thread: set, new_thread: dict):
    # num_top_level_comments is different OR thread_score is different OR num_total_comments is different.
    return old_thread[0] != len(new_thread.comments) or old_thread[4] != new_thread.score or old_thread[8] != new_thread.num_comments

def change_in_comment(old_comment: set, new_comment: dict):
    # body is different or comment_score is different.
    return old_comment[1] != new_comment.body or old_comment[4] != new_comment.score

def update_threads(threads_to_update: list, database):
    '''
    Given a list of threads, updates each one by calling various functions to the database.
    '''

    reddit = praw.Reddit(
        user_agent = 'Comment Extraction',
        client_id = config.reddit_client_id,
        client_secret = config.reddit_client_secret
    )

    for old_thread in threads_to_update:
        # Obtain a Submission object.
        # The element at index 1 is the thread ID of each thread record.
        new_thread = reddit.submission(id=old_thread[1])

        if change_in_thread(old_thread, new_thread):
            # Update the number of top level comments, thread score, and number of total comments, regardless of which value has changed.
            # This is done for succinctness. If we do not update all of the columns at once, then due to the nature of psycopg2, we would have to have functions to update each column.
            # The same applies for comments.
            database.update_thread(old_thread[1], len(new_thread.comments), new_thread.score, new_thread.num_comments)

        # In the event there are "load more comments" or "continue this thread," we replace those with the comments they are hiding.
        new_thread_comments = new_thread.comments.replace_more(limit=None)

        for new_comment in new_thread_comments:
            old_comment = database.select_comment(new_comment.id)

            # Update comment information.
            if change_in_comment(old_comment, new_comment):
                database.update_comment(old_comment[2], new_comment.body, new_comment.score)

            # Update outfits for a given comment if new ones are added later on.
            # This can happen if for instance a user posts an outfit they've already posted once before, then realize it and update their comment.
            new_outfits = extract_outfit_urls_from_comment(new_comment.body)

            for new_outfit in new_outfits:
                if not database.outfit_exists(new_outfit):
                    database.insert_outfit(new_outfit)

# Establish a connection to the database.
database = RedditOutfitsDatabase('reddit_outfits', 'redditoutfits', config.redditoutfits_password)

# Retrieve threads that need to be updated.
malefashionadvice_threads_to_update = database.select_threads_to_update('malefashionadvice')
femalefashionadvice_threads_to_update = database.select_threads_to_update('femalefashionadvice')
streetwear_threads_to_update = database.select_threads_to_update('streetwear')

# Update the threads.
update_threads(malefashionadvice_threads_to_update, database)
update_threads(femalefashionadvice_threads_to_update, database)
update_threads(streetwear_threads_to_update, database)

database.close()