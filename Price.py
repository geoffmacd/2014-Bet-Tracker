class Price:
    """Object for each type of price"""
    def descstr(self,guy):
        return guy['name'] + ' - ' + str(guy['bet'])  
    def __init__(self, type,curPrice,p1,p2):
        self.type = type
        self.curPrice = curPrice
        print p1,p2
        if(abs(curPrice - p1['bet']) < abs(curPrice - p2['bet'])):
            self.win = self.descstr(p1)
            self.lose = self.descstr(p2)
        else:
            self.win = self.descstr(p2)
            self.lose = self.descstr(p1)

