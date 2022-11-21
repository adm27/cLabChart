import json

import pymongo as pymongo


def get_database():
    try:
        file = open("db_config_file.json", "r")
        db_config = json.load(file)
        client = pymongo.MongoClient("mongodb+srv://"+db_config['user']+":"+db_config['password']+"@cluster0.dt9r9fo.mongodb.net/?retryWrites=true&w=majority")
        db = client["circularLabDB"]
        return db
    except Exception as e:
        print(e)
