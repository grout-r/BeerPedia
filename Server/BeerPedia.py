from flask import Flask, request, make_response, jsonify
from flask_pymongo import PyMongo
from bson import json_util, ObjectId
from json import dumps
import datetime
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
    return make_response(jsonify(users.register(mongo, request.json["data"])))


@app.route('/login', methods=['GET', 'POST'])
def login():
    return make_response(json_util.dumps(users.login(mongo, logged_users, request.json["data"])))


@app.route('/add_favorite', methods=['GET', 'POST'])
def add_favorite():
    json = request.json
    if json is None:
        return "bad_request"
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"code": 403, "data": "Wrong token"}))
    return make_response(json_util.dumps(users.add_favorite(mongo, json["data"], ObjectId(user["_id"]))))


@app.route('/get_beers',  methods=['POST'])
def get_beer():
    json = request.json
    if json is None:
        return "bad_request"
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"code": 403, "data": "Wrong token"}))
    return make_response(json_util.dumps(controller.get_beers(mongo)))


@app.route('/rate_beer', methods=["POST"])
def rate_beer():
    json = request.json
    if json is None:
        return "bad_request"
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"code": 403, "data": "Wrong token"}))
    return make_response(json_util.dumps(controller.rate_beer(mongo, json["data"])))


@app.route('/update_beer', methods=["POST"])
def update_beer():
    json = request.json
    if json is None:
        return "bad_request"
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"code": 403, "data": "Wrong token"}))
    return make_response(json_util.dumps(controller.update_beer(mongo, json["data"])))


@app.route('/post_beer', methods=["POST"])
def post_beer():
    json = request.json
    if json is None:
        return "bad_request"
    user = users.is_logged(logged_users, json)
    if user is None:
        return make_response(json_util.dumps({"code": 403, "data": "Wrong token"}))
    return make_response(json_util.dumps(controller.post_beer(mongo, json["data"])))


if __name__ == '__main__':
    app.run()
