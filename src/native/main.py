import sys
import http.client
import PyQt5.QtCore
# from PyQt5.QtWidgets import QWidget, QDesktopWidget, QApplication, QMessageBox, QFormLayout, QLineEdit
from PyQt5.QtWidgets import *

class MainWindow(QWidget):
	
	def __init__(self):
		super().__init__()
		self._before = ''
		self.initUI()
		
		
	def initUI(self):               
		
		self.setGeometry(QDesktopWidget().availableGeometry())        
		self.setWindowTitle('Call it Pain')    
		box = QVBoxLayout();
		form = QFormLayout()
		primarySearch = QLineEdit()
		log = QTextEdit()
		def search():
			text = primarySearch.text()
			BODY = "{\"string\":\""+text+"\"}"
			headers = {"Content-type": "application/json","Accept": "text/plain"}
			print(BODY)
			conn = http.client.HTTPConnection("localhost", 8080)
			conn.request("POST", "/search", BODY, headers)
			response = conn.getresponse()
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

		
if __name__ == '__main__':
	
	app = QApplication(sys.argv)
	ex = MainWindow()
	sys.exit(app.exec_())