class XLevel:
    def __int__(self, name, color):
        self.name = name
        self.color = color

    def to_json(self):
        return {
            'name': self.name,
            'color': self.color
        }