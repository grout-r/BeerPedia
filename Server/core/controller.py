import datetime
from bson import json_util
from bson.objectid import ObjectId
from flask import make_response
import datetime


def get_beers(mongo):
    beers = {"data":  json_util.dumps(mongo.db.beers.find({}, {"name": 1, "_id": 1, "barcode": 1}))}
    return make_response(json_util.dumps(beers), 200)


def post_beer(mongo, json):
    if "name" not in json or "country" not in json:
        return  make_response({"data": "Wrong data"}, 400)
    json["createdAt"] = datetime.datetime.now()
    mongo.db.beers.insert_one(json)
    return make_response(json_util.dumps({"data": "posted"}), 200)


def rate_beer(mongo, json):
    beer = mongo.db.beers.find_one({"_id": ObjectId(json["_id"])})
    if beer is None:
        return make_response(json_util.dumps({"data": "bad objectid"}), 400)

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
        return make_response(json_util.dumps({"data": "rated"}), 200)


def update_beer(mongo, json):
    if "_id" not in json:
        return make_response({"data": "No Object Id"}, 400)
    beer = mongo.db.beers.find_one({"_id": ObjectId(json["_id"])})
    if beer is None:
        return make_response({"data": "bad objectid"}, 400)
    mongo.db.beers.update({"_id": ObjectId(json["_id"])}, {"$set": json["fields"]})
    return make_response(json_util.dumps({"data": "Updated"}), 200)


def get_beer(mongo, json):
    print(json_util.dumps(json))
    if "_id" not in json:
        return make_response(json_util.dumps({"data": "No Object Id"}), 400)
    beer = mongo.db.beers.find_one({"_id": ObjectId(json["_id"])})
    if beer is None:
        return make_response(json_util.dumps({"data": "bad objectid"}), 400)
    return make_response(json_util.dumps(beer), 200)
