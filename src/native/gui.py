import sys, threading
import http.client
import PyQt5.QtCore
from PyQt5.QtCore import QThread
from socketIO_client import SocketIO, LoggingNamespace
from PyQt5.QtWidgets import *

class MainWindow(QWidget):
	
	def __init__(self):
		super().__init__()
		self.initUI()
		self._before = ''
		
	def initUI(self):               
		
		self.setGeometry(QDesktopWidget().availableGeometry())        
		self.setWindowTitle('Call it Pain')    
		box = QVBoxLayout()
		form = QFormLayout()
		primarySearch = QLineEdit()
		log = QTextEdit()
		def on_aaa_response(*args):
			print('on_aaa_response', args)
			
		socketIO = SocketIO('localhost', 8080, LoggingNamespace)
		socketIO.on('live', on_aaa_response)
		

		def search():
			text = primarySearch.text()
			BODY = "{\"string\":\""+text+"\"}"
			headers = {"Content-type": "application/json","Accept": "text/plain"}
			print(BODY)
			conn = http.client.HTTPConnection("localhost", 8080)
			conn.request("POST", "/search", BODY, headers)
			response = conn.getresponse()
			socketIO.wait(seconds=5)
			log.append(response.read().decode('utf-8'));
			print("Hello",response.status, response.read())
			conn.close()

		primarySearch.returnPressed.connect(search)
		form.addRow("Search:", primarySearch)
		box.addLayout(form)
		box.addWidget(log)
		self.setLayout(box)
		self.center()
		self.show()

	def center(self):		
		qr = self.frameGeometry()
		cp = QDesktopWidget().availableGeometry().center()
		print(QDesktopWidget().availableGeometry())
		qr.moveCenter(cp)
		self.move(qr.topLeft())

class GUI():
	# def __init__(self): 
	# 	print("Init")
	# 	print("Die bitch")
	def start(self):
		app = QApplication(sys.argv)
		ex = MainWindow()
		sys.exit(app.exec_())