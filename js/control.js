import { Pacman } from './pacman.js'

export class Control{
  constructor(){
    window.addEventListener('keydown' , this.keydown.bind(this))
    window.addEventListener('keyup'   , this.keyup.bind(this))
  }

  static key2name(key){
    switch(key){
      case 37 : return 'left'
      case 38 : return 'up'
      case 39 : return 'right'
      case 40 : return 'down'
    }
  }

  keydown(e){
    if(e.repeat === true){return}
    const key  = e.keyCode
    const name = Control.key2name(key)
    if(!name){return}
    Control.key_data = {
      key_code : key,
      name     : name,
    }
    Pacman.move(Control.key_data)
  }

  keyup(e){
    if(!Control.key_data){return}
    const name = Control.key2name(e.keyCode)
    if(Control.key_data.name !== name){return}
    delete Control.key_data
  }
}