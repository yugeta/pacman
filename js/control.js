import { Pacman } from './pacman.js'
import { Frame }  from './frame.js'

export class Control{
  constructor(){
    window.addEventListener('keydown' , Control.keydown.bind(this))
    window.addEventListener('keyup'   , Control.keyup.bind(this))
  }

  static key2name(key){
    switch(key){
      case 37 : return 'left'
      case 38 : return 'up'
      case 39 : return 'right'
      case 40 : return 'down'
    }
  }

  static keydown(e){
    if(e.repeat === true){return}
    if(Frame.is_clear){return}
    const key  = e.keyCode
    
    const direction = Control.key2name(key)
    if(!direction){return}
    Control.direction = direction
    Pacman.move(Control.direction)
  }

  static keyup(e){
    if(!Control.direction){return}
    const direction = Control.key2name(e.keyCode)
    Control.clear()
  }

  static clear(){
    if(!Control.direction){return}
    delete Control.direction
  }
}