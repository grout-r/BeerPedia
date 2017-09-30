import datetime
from bson.json_util import dumps


def get_beers(mongo):
    return dumps(mongo.db.beers.find({}))


def post_beer(mongo):
    post = {"name": "Goudale",
            "type": "Blonde",
            "country": ["Belgium"],
            "date": datetime.datetime.utcnow()}
#    print(mongo.db.beers.insert_one(post).inserted_id)
    return "ok"