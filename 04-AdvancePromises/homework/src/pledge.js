'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:
function $Promise(executor) {
    if(typeof(executor)!=='function'){
        throw new TypeError(' executor not a  function')
    }
  this._state='pending'
  this._handlerGroups=[] // aca van los .then
  executor(this._internalResolve.bind(this),this._internalReject.bind(this)) // Lo bindeo xq cuando me llamen al executor, el contexto no va a tener ni idea quien es el this

 
 
} 
  $Promise.prototype._internalResolve=function(someData) {
    if (this._state ==='pending'){
    this._state='fulfilled';
    this._value=someData;
    this._callHandlers();
    }
   
  }

  $Promise.prototype._internalReject=function(myReason){
    if(this._state==='pending'){
    this._state='rejected';
    this._value=myReason;
    this._callHandlers();
    }
   
  }

  $Promise.prototype.then=function(successCb,errorCb){
    if(typeof(successCb)!=='function')successCb= false; // Si me pasan un sH que no es una funcion lo seteo en false
    if(typeof(errorCb)!=='function')errorCb=false; // Si me pasan un eH  que no es una funcion lo seteo en false
    const downstreamPromise=new $Promise(function(){})
    this._handlerGroups.push({successCb,errorCb,downstreamPromise}); // Cada vez que se invoca a .then se agrega un sH y un Eh, al arreglo de handlers. Ahora tmb la downstreampromise
    if(this._state !=='pending') this._callHandlers() //Esto es para si me invocan un .then una vez la promesa ya fue resuelta, no voy a ir de nuevo al internalReject o internalResolve, directamente lo mando al callHandlers para q le ejecute el sH o el eH. (Teniendo en cuenta q en la linea de arriba ya tambien los agregue al arreglo)
    return downstreamPromise


    

  }
  $Promise.prototype._callHandlers=function(){
      
    while(this._handlerGroups.length > 0){ // Mientras haya .then en el arreglo
        let current = this._handlerGroups.shift(); // Saco 1 ( en orden) {sH1,eH1,pB} {sH2,eH2,pC}
        if(this._state==='fulfilled'){ // Si el estado esta fulfilled
          if(!current.successCb){
            current.downstreamPromise._internalResolve(this._value)
            
          }else{
              const result = current.succesCb(this._value)
              if(result instanceof $Promise){
                result.then(value=>current.downstreamPromise._internalResolve(value), 
                err => current.downstreamPromise._internalReject(err));
              }else{
                current.downstreamPromise._internalResolve(result)
              }
          }
            // current.successCb && current.successCb(this._value); // Le aplico el sH con el valor
        }else if(this._state==="rejected"){  // sino
            current.errorCb && current.errorCb(this._value) // le aplico el eH
        }
    }
    
  }
  
  $Promise.prototype. catch=function(errorCb){
    return this.then(null,errorCb)
  }
  
 
 


module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
