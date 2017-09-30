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


@app.route('/post_beer', methods=["POST"])
def post_beer():
    b = request.is_json
    print(b)
    r = request
    print(r)
    a = request.json
    print(dumps(a))
    return controller.post_beer(mongo)


if __name__ == '__main__':
    app.run()
