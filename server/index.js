const express = require('express');
const app = express();
const socketIo = require('socket.io');
const http = require('http');

// inicializar seridor 
const server = http.createServer(app);
const io = socketIo.listen(server);

// manejar la conicion de socket
io.on('connection', function(socket){
    // aqui recibe la conexion de socket desde el cliente y valor tomar en cuenta 
    console.log('Nueva  conexion de socket');
    socket.on('prueba', function (data) {
        console.log('recibe'+data.value);

        // prueba
    enviarArduino(data.value);
    })

    

})


// pasar archivo para presentar 
app.get('/', (req, res, next) =>{
    res.sendFile(__dirname+'/index.html');
})


const SerialPort = require('serialport')
const ReadLine = SerialPort.parsers.Readline;
const parser = new ReadLine();



const mySerial = new SerialPort('/dev/ttyACM0', {
// const mySerial = new SerialPort('COM6', {

    baudRate: 9600
});

const parser1 = mySerial.pipe(new ReadLine({ delimiter: '\r\n' }))

mySerial.on('open', function(){
    console.log('puerto serial abierto');
});


// envia al cliente de la aplicacion
parser1.on("data", function(data){
    console.log(data.toString());
    console.log(data)
    // enviar mediante io
    io.emit('arduino:data',{
        value: data.toString()
    })
});

// prueba
parser1.on("prueba", function(data){
    console.log('trajo',data.toString());
    // enviar mediante io
    // io.emit('arduino:data',{
    //     value: data.toString()
    // })
});

mySerial.on('err', function(err) {
    console.log(err.message);
});


io.on('arduino:prueba', function (data) {
    console.log(data.toString());
});
// app.get('/', (req, res)=>{
//     res.end('Hola mundo');
// });

// app.listen(3000);

//  servidor que puerto se queda escuchando
server.listen(3000, () => {
    console.log('servidor por el 3000');
})



// enviar al arduino mediante puerto serial
function enviarArduino(data) {
    console.log('se ejecuto' );
    // envia el valor al arduino
    mySerial.write(data);
}