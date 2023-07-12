import { Ghost }   from './ghost.js'
import { Frame }   from './frame.js'
import { Control } from './control.js'
import { Pacman }  from './pacman.js'
import { Feed }    from './feed.js'

export const Main = {
  anim_speed         : 200,
  ghost_normal_speed : 200,
  ghost_weak_speed   : 400,
  ghost_dead_speed   : 50,
  is_crash           : false,
  is_dead            : false,
  is_clear           : false,
}

function init(){
  new Frame().then(()=>{
    new Ghost()
    new Pacman()
    new Control()
    new Feed()
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