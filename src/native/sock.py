from socketIO_client import SocketIO, LoggingNamespace

def on_aaa_response(*args):
    print('on_aaa_response', args)

socketIO = SocketIO('localhost', 8080, LoggingNamespace)

# Listen
socketIO.on('live', on_aaa_response)
socketIO.on('live', on_aaa_response)
# socketIO.emit('aaa')
# socketIO.emit('aaa')
# socketIO.wait(seconds=100)

# Stop listening
# socketIO.off('aaa_response')
# socketIO.emit('aaa')
# socketIO.wait(seconds=1)

# Listen only once
# socketIO.once('aaa_response', on_aaa_response)
# socketIO.emit('aaa')  # Activate aaa_response
# socketIO.emit('aaa')  # Ignore
# socketIO.wait(seconds=1)