import datetime
from bson.json_util import dumps
from bson.objectid import ObjectId
import datetime


def get_beers(mongo):
    return {"code": 200, "data": dumps(mongo.db.beers.find({}, {"name": 1, "_id": 1}))}


def post_beer(mongo, json):
    if "name" not in json or "country" not in json:
        return "bad"
    #todo plus de check ?
    json["createdAt"] = datetime.datetime.now()
    mongo.db.beers.insert_one(json)
    return {"code": 200, "data": "posted"}


def rate_beer(mongo, json):
    beer = mongo.db.beers.find_one({"_id": ObjectId(json["_id"])})
    if beer is None:
        return {"code": 400, "data": "bad objectid"}

    if "rate" in json:
        if "rate" in beer:
            currentavg = beer["rate"]["avg"]
            currententries = beer["rate"]["entries"]
            newrate = json["rate"]
            avg = currentavg + ((newrate - currentavg) / (currententries + 1))
            entries = currententries + 1
        else:
            avg = json["rate"]
            entries = 1
        mongo.db.beers.update({"_id": ObjectId(json["_id"])}, {"$set": {"rate": {"avg": avg, "entries": entries}}}, upsert=True)
    if "comment" in json:
        mongo.db.beers.update({"_id": ObjectId(json["_id"])}, {"$addToSet": {"comments": {
                "date": datetime.datetime.now(), "text": json["comment"]
            }}}, upsert=True)
    return {"code": 200, "data": "rated"}


def update_beer(mongo, json):
    if "_id" not in json:
        return {"code": 400, "data": "No Object Id"}
    beer = mongo.db.beers.find_one({"_id": ObjectId(json["_id"])})
    if beer is None:
        return {"code": 400, "data": "bad objectid"}
    mongo.db.beers.update({"_id": ObjectId(json["_id"])}, {"$set": json["fields"]})
    return {"code": 200, "data": "Updated"}

