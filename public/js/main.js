var socket = (function(){

    var socket = io.connect('http://localhost:8081');
    socket.emit("");
    socket.on("welcome",function(data){
       var votes = new window.fuuzikviews.header({
        
       })
        
    });
    return socket;

})()