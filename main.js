const { app, BrowserWindow, ipcMain, remote } = require('electron');
const express = require("express");
let mainWindow;

app.on('ready', function () {

  var ex = express();

  mainWindow = new BrowserWindow();
  ipcMain.on("para", (event, arg) => {
    if (arg.status) {
      console.log("msg enviada...");
      mainWindow.hide();
    }
  });


  ex.get("/whats/:num/:msg", function (req, res) {
    var numero = req.params.num;
    var msg = req.params.msg;
    enviar(numero, msg);
    res.send("Enviando mensagem....")

  });


  function enviar(telefone, mensagem) {
    mainWindow.loadURL("https://web.whatsapp.com/send?phone=+" + telefone + "&text=" + mensagem,
      { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36' });
    mainWindow.show();
    mainWindow.addListener('show', () => {
      console.log('enviado');
    })
    mainWindow.webContents.once('dom-ready', () => {

      mainWindow.webContents.executeJavaScript(`
      console.log("no problem!");
      enviado = false
      setInterval(()=>{
        console.log("passou!");
        var btsend = document.getElementsByClassName("_1U1xa")[0];
        var inputSend = document.getElementsByClassName("_2UL8j")[0];
        if(typeof inputSend !== "undefined" && inputSend.textContent && !enviado){
          btsend.click();
          enviado=true;
        }else if(enviado){
          ipcRenderer.send("para", {status:true});
           ${mainWindow.hide()}
        }
      },1000);
    `)
    })

  }
  ex.listen(3400);
})
