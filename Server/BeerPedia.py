from flask import Flask, request, make_response, jsonify
from flask_pymongo import PyMongo
from bson import json_util, ObjectId
import core.controller as controller
import core.users as users

app = Flask(__name__)
app.config['CUSTOM_DBNAME'] = 'beerpedia'
mongo = PyMongo(app, 'CUSTOM')
logged_users = {}

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/register', methods=['GET', 'POST'])
def register():
    return users.register(mongo, logged_users, request.json["data"])


@app.route('/login', methods=['GET', 'POST'])
def login():
    return users.login(mongo, logged_users, request.json["data"])


@app.route('/add_favorite', methods=['GET', 'POST'])
def add_favorite():
    json = request.json
    if json is None:
        return make_response(json_util.dumps({"data": "Bad Request"}), 400)
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"data": "Bad token"}), 403)
    return users.add_favorite(mongo, json["data"], ObjectId(user["_id"]))


@app.route('/remove_favorite', methods=['GET', 'POST'])
def remove_favorite():
    json = request.json
    if json is None:
        return make_response(json_util.dumps({"data": "Bad Request"}), 400)
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"data": "Bad token"}), 403)
    return users.remove_favorite(mongo, json["data"], ObjectId(user["_id"]))


@app.route('/get_beer',  methods=['POST'])
def get_beer():
    json = request.json
    if json is None:
        return make_response(json_util.dumps({"code": 400, "data": "Bad Request"}), 400)
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"code": 403, "data": "Wrong token"}), 403)
    return controller.get_beer(mongo, json)


@app.route('/get_beers',  methods=['POST'])
def get_beers():
    json = request.json
    if json is None:
        return make_response(json_util.dumps({"code": 400, "data": "Bad Request"}), 400)
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"code": 403, "data": "Wrong token"}), 403)
    return controller.get_beers(mongo)


@app.route('/rate_beer', methods=["POST"])
def rate_beer():
    json = request.json
    if json is None:
        return make_response(json_util.dumps({"data": "Bad Request"}), 400)
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"data": "Bad token"}), 403)
    return controller.rate_beer(mongo, json["data"])


@app.route('/update_beer', methods=["POST"])
def update_beer():
    json = request.json
    if json is None:
        return make_response(json_util.dumps({"data": "Bad Request"}), 400)
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"data": "Bad token"}), 403)
    return controller.update_beer(mongo, json["data"])


@app.route('/post_beer', methods=["POST"])
def post_beer():
    json = request.json
    if json is None:
        return make_response(json_util.dumps({"data": "Bad Request"}), 400)
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"data": "Bad token"}), 403)
    return controller.post_beer(mongo, json["data"])


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000")
