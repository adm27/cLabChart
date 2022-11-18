class Variable:
    def __init__(self, country, year, x_level, ngs_price):
        self.country = country
        self.year = year
        self.x_level = x_level
        self.ngs_price = ngs_price

    @staticmethod
    def by_json(json):
        return Variable(json['country'], json['year'], json['x_level'], json['ngs_price'])

    def to_json(self):
        return {
            'id': self.id,
            'country': self.country,
            'year': self.year,
            'x_level': self.x_level,
            'ngs_price': self.ngs_price,
        }
