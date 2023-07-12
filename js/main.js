import { Ghost }   from './ghost.js'
import { Frame }   from './frame.js'
import { Control } from './control.js'
import { Pacman }  from './pacman.js'

export const Main = {}

function init(){
  new Frame().then(()=>{
    new Ghost()
    new Pacman()
    new Control()
  })
}

switch(document.readyState){
  case 'complete':
  case 'interactive':
    init()
    break
  default:
    window.addEventListener('DOMContentLoaded' , (()=>init()))
}