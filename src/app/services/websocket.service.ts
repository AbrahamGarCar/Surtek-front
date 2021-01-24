import { Injectable } from '@angular/core';
// import { io } from 'socket.io-client/build/index';
import { io, Socket } from 'socket.io-client/build/index';
import { environment } from '../../environments/environment.prod';

import { Usuario } from '../classes/usuario';
import { Router } from '@angular/router';
import { Observable, Subscriber } from 'rxjs';


    @Injectable({
    providedIn: 'root'
    })
    
    export class WebsocketService {

    public socketStatus = false;
    private socket:any;
    public usuario: Usuario = null;

    constructor( private router: Router ) {
      this.socket = io(environment.wsUrl);
      this.cargarStorage();
      this.checkStatus();
    }


    checkStatus() {
      this.socket.on('connect', () => {
        console.log('Conectado al servidor');
        this.socketStatus = true;
        this.cargarStorage();
      });

      this.socket.on('disconnect', () => {
        console.log('Desconectado del servidor');
        this.socketStatus = false;
      });
    }


    emit( evento: string, payload?: any, callback?: Function ) {
      console.log('Emitiendo', evento);
      // emit('EVENTO', payload, callback?)
      this.socket.emit( evento, payload, callback );
    }

    listen( evento: string ) {
      // return this.socket.fromEvent( evento );
      return new Observable(( Subscriber ) => {
        this.socket.on(evento, (data) => {
          Subscriber.next(data);
        })
      })
    }

    loginWS( nombre: string ) {
      return new Promise(  (resolve, reject) => {
        this.emit( 'configurar-usuario', { nombre }, (resp) => {
          this.usuario = new Usuario( nombre );
          this.guardarStorage();
          resolve();
        });
      });

    }

    logoutWS() {
      this.usuario = null;
      localStorage.removeItem('usuario');

      const payload = {
        nombre: 'sin-nombre'
      };

      this.emit('configurar-usuario', payload, () => {} );
      this.router.navigateByUrl('');

    }


    getUsuario() {
      return this.usuario;
    }

    guardarStorage() {
      localStorage.setItem( 'usuario', JSON.stringify( this.usuario ) );
    }

    cargarStorage() {

      if ( localStorage.getItem('usuario') ) {
        this.usuario = JSON.parse( localStorage.getItem('usuario') );
        this.loginWS( this.usuario.nombre );
      }

    }

}
