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
    Control.direction = name
    Pacman.move(Control.direction)
  }

  keyup(e){
    if(!Control.direction){return}
    const name = Control.key2name(e.keyCode)
    if(Control.direction !== name){return}
    delete Control.direction
  }
}