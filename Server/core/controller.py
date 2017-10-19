import datetime
from bson.json_util import dumps
from bson.objectid import ObjectId



def get_beers(mongo):
    return dumps(mongo.db.beers.find({}))


def post_beer(mongo, json):
    if "name" not in json or "country" not in json:
        return "bad"
    #todo plus de check ?
    json["createdAt"] = datetime.datetime.now()
    print(mongo.db.beers.insert_one(json).inserted_id)
    return "ok"


def rate_beer(mongo, json):
    beer = mongo.db.find_one({"_id": ObjectId(json["_id"])})
    if beer is None:
        return "bad objectid"

    if "rate" in json:
        currentavg = beer["rate"]["avg"]
        currententries = beer["rate"]["entries"]
        newrate =  json["rate"]
        avg = currentavg + ( (newrate - currentavg) / (currententries + 1) )
        entries = currententries + 1
        mongo.db.beers.update({"_id": ObjectId(json["id"])}, {"$set": {"rate": {"avg": avg, "entries": entries}}}, upsert=True)
    if "comment" in json:
        mongo.db.beers.update({"_id": ObjectId(json["id"])}, {"$addToSet": {"comments": beer["comment"]}}, upsert=True)

    return None