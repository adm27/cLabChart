from flask import Flask, request, jsonify
from flask_cors import CORS
import database as DB

db = DB.get_database()

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

def get_countries():
    collection_countries = db['countries']
    return list(collection_countries.aggregate([{'$unset': '_id'}]))

def get_x_levels():
    collection_x_levels = db['x_level']
    return list(collection_x_levels.aggregate([{'$unset': '_id'}]))
def get_variable_result_source(x_level_name):
    collection_variables = db['ngs_prices']
    a = collection_variables.aggregate([
    {
        '$lookup': {
            'from': 'x_level',
            'localField': 'x_level_id',
            'foreignField': '_id',
            'as': 'x_level'
        }
    }, {
        '$unwind': '$x_level'
    }, {
        '$lookup': {
            'from': 'countries',
            'localField': 'country_id',
            'foreignField': '_id',
            'as': 'country'
        }
    }, {
        '$unwind': '$country'
    },
    {
        "$match": {'x_level.name': x_level_name},
    },
    {
        '$group': {
            '_id': '$year',
            'totalCountries': {
                '$addToSet': {
                    'country': '$country.name',
                    'ngs_price': '$ngs_price'
                }
            }
        }
    }, {
        '$project': {
            '_id': 0,
            'year': '$_id',
            'totalCountries': 1
        }
    }
])
    return list(a)


def get_total_vars_info_filter(filter_match):
    collection_variables = db['ngs_prices']
    pipeline = [{
        '$lookup':
            {
                'from': "x_level",
                'localField': "x_level_id",
                'foreignField': "_id",
                'as': "x_level"
            },
    }, {
        '$unwind': "$x_level"
    }, {
        '$lookup':
            {
                'from': "countries",
                'localField': "country_id",
                'foreignField': "_id",
                'as': "country"
            }
    }, {
        '$unwind': "$country"
    }, {
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
    }]
    a = collection_variables.aggregate(pipeline+filter_match)
    return list(a)


@app.route('/api/get_vars', methods=['GET'])
def search_vars_by_filter():
    args = request.args
    filters = []
    if 'year' in args:
        filters.append({'$match': {'$or': [{'year': int(year)} for year in args.getlist('year')]}})
    if 'ngs_price' in args:
        filters.append({'$match': {'$or': [{'ngs_price': int(ngs_price)} for ngs_price in args.getlist('ngs_price')]}})
    if 'country' in args:
        filters.append({'$match': {'$or': [{'country': country} for country in args.getlist('country')]}})
    if 'x_level' in args:
        filters.append({'$match': {'$or': [{'x_level.name': x_level} for x_level in args.getlist('x_level')]}})

    result = get_total_vars_info_filter(filters)
    return jsonify(result)


@app.route('/api/get_var/<var_name>', methods=['GET'])
def search_var(var_name):
    result = get_variable_result_source(var_name)
    return jsonify(result)


@app.route('/api/get_countries', methods=['GET'])
def get_countries_endpoint():
    result = get_countries()
    return jsonify(result)


@app.route('/api/get_x_levels', methods=['GET'])
def get_x_levels_endpoint():
    result = get_x_levels()
    return jsonify(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)