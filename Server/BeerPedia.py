from flask import Flask, request
from flask_pymongo import PyMongo
from json import dumps
import datetime
import core.controller as controller

app = Flask(__name__)
app.config['CUSTOM_DBNAME'] = 'beerpedia'
mongo = PyMongo(app, 'CUSTOM')


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/get_beers')
def get_beer():
    return controller.get_beers(mongo)

@app.route('/rate_beer', methods=["POST"])
def rate_beer():
    json = request.json
    if json is None:
        return "bad_request"
    return controller.rate_beer(mongo, json["data"])


@app.route('/post_beer', methods=["POST"])
def post_beer():
    json = request.json
    if json is None:
        return "bad_request"
    return controller.post_beer(mongo, json["data"])


if __name__ == '__main__':
    app.run()
