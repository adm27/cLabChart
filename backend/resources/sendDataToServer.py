import pymongo as pymongo

password = 'c4p1t4n4m3r1c4'

client = pymongo.MongoClient("mongodb+srv://adm27:"+password+"@cluster0.dt9r9fo.mongodb.net/?retryWrites=true&w=majority")
db = client["circularLabDB"]
collection_x_levels = db["x_level"]
collection_variables = db["ngs_prices"]
collection_countries = db["countries"]

list_countries = ['France', 'Italy', 'Spain', 'Argentina']
for country in list_countries:
    collection_countries.insert_one({
        'name': country
    })


x_levels = []
with open('data_x_level.txt') as f:
    lines = f.readlines()
    for line in lines:
        text = line.split('\t')
        x_levels.append({
            'name': text[0],
            'color': text[1]
        })
collection_x_levels.insert_many(x_levels)
variables = []
with open('data_vars.txt') as f:
    lines = f.readlines()
    for line in lines:
        text = line.split('\t')
        variable = {
            'country_id': collection_countries.find_one({'name': text[0]}).get("_id"),
            'year': int(text[1]),
            'x_level_id': collection_x_levels.find_one({'name': text[2]}).get("_id"),
            'ngs_price': float(text[3])
        }
        variables.append(variable)
print(variables)
collection_variables.insert_many(variables)

# collection_variables.aggregate([
#     { '$lookup':
#         {
#            'from': "x_level",
#            'localField': "x_level_id",
#            'foreignField': "_id",
#            'as': "x_level"
#         },
#     },
#     {   '$unwind': "$x_level"},
#     {'$lookup':
#         {
#             'from': "countries",
#             'localField': "country_id",
#             'foreignField': "_id",
#             'as': "country"
#         }
#     },
#     {   '$unwind': "$country"},
# ])
# print()










