import os
import pymongo as pymongo


def get_database():
    try:
        db_username = os.environ['DB_USERNAME']
        db_password = os.environ['DB_PASSWORD']

        client = pymongo.MongoClient("mongodb+srv://"+db_username+":"+db_password+"@cluster0.dt9r9fo.mongodb.net/?retryWrites=true&w=majority")
        db = client["circularLabDB"]
        return db
    except Exception as e:
        print(e)
