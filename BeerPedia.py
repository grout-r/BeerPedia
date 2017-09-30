from flask import Flask
from flask_pymongo import PyMongo
import datetime

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/post')
def post():
    post = {"name": "Goudale",
            "type": "Blonde",
            "country": ["Belgium"],
            "date": datetime.datetime.utcnow()}
    print(beers.insert_one(post).inserted_id)
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
    client = PyMongo.MongoClient()
    db = client.beerpedia
    beers = db.beers
