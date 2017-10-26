import uuid
from bson import ObjectId, json_util
from flask import make_response


def register(mongo, logged_users, json):
    if all(k in json for k in ("username", "email", "password")):
        user = mongo.db.users.find_one({"username": json["username"]})
        if user is not None:
            return make_response(json_util.dumps({"data": "User already exists"}), 400)
        mongo.db.users.insert_one(json)
        return login(mongo, logged_users, json)
    else:
        return make_response(json_util.dumps({"data": "Values are missing"}), 400)


def login(mongo, logged_users, json):
    user = mongo.db.users.find_one({"username": json["username"]})
    if user is None:
        return make_response(json_util.dumps({"data": "User does not exist"}), 400)
    if user["password"] != json["password"]:
        return make_response(json_util.dumps({"data": "Wrong password"}), 401)
    for k, v in logged_users.items():
        if v["username"] == json["username"]:
            return make_response(json_util.dumps({"data":  {"me": user, "token": k}}), 200)
    token = uuid.uuid4().hex
    logged_users[token] = user
    return make_response(json_util.dumps({"data": {"me": user, "token": token}}), 200)


def add_favorite(mongo, json, userid):
    beer = mongo.db.beers.find_one({"_id": ObjectId(json["beer_id"])})
    if beer is None:
        return {"code": 400, "data": "Wrong beer ID"}
    mongo.db.users.update({"_id": userid},  {"$addToSet": {"favorites": ObjectId(json["beer_id"])}})
    return make_response(json_util.dumps({"data": "Added"}), 200)


def remove_favorite(mongo, json, userid):
    beer = mongo.db.beers.find_one({"_id": ObjectId(json["beer_id"])})
    if beer is None:
        return {"code": 400, "data": "Wrong beer ID"}
    mongo.db.users.update({"_id": userid},  {"$pull": {"favorites": ObjectId(json["beer_id"])}})
    return make_response(json_util.dumps({"data": "Removed"}), 200)


def is_logged(logged_users, json):
    if "token" not in json:
        return None
    print(json["token"])
    print(logged_users)
    if json["token"] not in logged_users:
        return None
    return logged_users[json["token"]]
