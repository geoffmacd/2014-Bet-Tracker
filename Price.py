class Price:
    """Object for each type of price"""
    def winstr(self):
        return self.winner + ' - ' + str(self.winBet)  
    def losestr(self):
        return self.loser + ' - ' + str(self.loseBet) 
    def __init__(self, type,winner, loser,curPrice,winBet,loseBet):
        self.type = type
        self.winner = winner
        self.loser = loser
        self.winBet = winBet
        self.loseBet = loseBet
        self.win = self.winstr()
        self.lose = self.losestr()
        self.curPrice = curPrice
