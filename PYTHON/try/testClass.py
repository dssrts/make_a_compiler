
# tinignan ko lang kung pano nirereturn yung value
class Melissa:
    def __init__(self, type, value=None):
        self.type = type
        self.value = value

    def __repr__(self):
        if self.value: return f'{self.type}:{self.value}'
        return f'{self.type}'

a = "apple"

print(Melissa(a))