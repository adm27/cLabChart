from flask import Flask, request, jsonify
from flask_cors import CORS
import database as DB

db = DB.get_database()

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


def get_total_vars_info_filter(filter_match):
    collection_variables = db['ngs_prices']
    a = collection_variables.aggregate([
        {
            '$lookup':
            {
               'from': "x_level",
               'localField': "x_level_id",
               'foreignField': "_id",
               'as': "x_level"
            },
        },
        {
            '$unwind': "$x_level"
        },
        {
            '$lookup':
            {
                'from': "countries",
                'localField': "country_id",
                'foreignField': "_id",
                'as': "country"
            }
        },
        {
            '$unwind': "$country"
        },
        {
            "$project": {
                '_id': 0,
                'ngs_price': 1,
                'x_level': {
                    'name': 1,
                    'color': 1
                },
                'country': '$country.name',
                'year': 1
            }
        },
        {
            "$match": filter_match,
        },
    ])
    return list(a)


@app.route('/api/get_vars', methods=['GET'])
def search():
    args = dict(request.args)
    if 'year' in args:
        args['year'] = int(args['year'])
    if 'ngs_price' in args:
        args['ngs_price'] = int(args['ngs_price'])
    result = get_total_vars_info_filter(args)
    return jsonify(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)