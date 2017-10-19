import uuid
from bson import ObjectId

def register(mongo, json):
    if all(k in json for k in ("username", "email", "password")):
        user = mongo.db.users.find_one({"username": json["username"]})
        if user is not None:
            return {"code": 200, "data": "User already exists"}
        mongo.db.users.insert_one(json)
        return {"code": 200, "data": "inserted"}
    else:
        return {"code": 400, "data": "Values are missing"}


def login(mongo, logged_users, json):
    user = mongo.db.users.find_one({"username": json["username"]})
    if user is None:
        return {"code": 401, "data": "User does not exist"}
    if user["password"] != json["password"]:
        return {"code": 401, "data": "Wrong password"}
    for k, v in logged_users.items():
        if v["username"] == json["username"]:
            return {"code": 200, "data":  {"me": user, "token": k}}
    token = uuid.uuid4().hex
    logged_users[token] = user
    return {"code": 200, "data": {"me": user, "token": token}}


def add_favorite(mongo, json, userid):
    beer = mongo.db.beers.find_one({"_id": ObjectId(json["beer_id"])})
    if beer is None:
        return {"code": 400, "data": "Wrong beer ID"}
    mongo.db.users.update({"_id": userid},  {"$addToSet": {"favorites": ObjectId(json["beer_id"])}})
    return {"code": 200, "data": "Added"}


def is_logged(logged_users, json):
    if "token" not in json:
        return None
    if json["token"] not in logged_users:
        return None
    return logged_users[json["token"]]


