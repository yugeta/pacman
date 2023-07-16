import { Asset }   from './asset.js'
import { Frame }   from './frame.js'
import { Control } from './control.js'
import { Feed }    from './feed.js'
import { Footer }  from './footer.js'
import { Mobile }  from './mobile.js'

export const Main = {
  anim_speed         : 200,
  ghost_normal_speed : 200,
  ghost_weak_speed   : 400,
  ghost_dead_speed   : 50,
  is_crash           : false,
  is_dead            : false,
  is_clear           : false,
  life_count         : 3,
}

function init(){
  new Asset({
    files:[
      {
        file   : 'assets/frame.json',
        target : 'frame',
        name   : 'asset_json',
        type   : 'data',
      },
      {
        file   : 'assets/ghost.json',
        target : 'ghost',
        name   : 'data_json',
        type   : 'data',
      },
      {
        file   : 'assets/ghost.html',
        target : 'ghost',
        name   : 'asset',
        type   : 'html',
      }
    ]
  }).then(()=>{
    new Footer()
    new Frame()
    new Control()
    new Feed()
    new Mobile()
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