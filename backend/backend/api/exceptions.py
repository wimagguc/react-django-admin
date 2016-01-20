
class UnauthorisedException(Exception):
	def __init__(self):
		pass
	def __str__(self):
		return repr(self)
