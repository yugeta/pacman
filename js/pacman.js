import { Main }     from './main.js'
import { Frame }    from './frame.js'
import { Control }  from './control.js'
import { Feed }     from './feed.js'
import { Ghost }    from './ghost.js'
import { Footer }   from './footer.js'

export class Pacman{

  static init(){
    Footer.delete_life()
    Pacman.direction = null
    Pacman.next_pos  = null
    Pacman.create()
    Pacman.coodinates = Pacman.start_coodinates
    Frame.put(Pacman.elm, Pacman.coodinates)
    Pacman.elm.style.setProperty('--anim-speed' , `${Main.anim_speed}ms` , '')
  }

  static start(){
    if(!Control.direction){return}
    Pacman.move(Control.direction)
  }

  static create(){
    if(Pacman.elm){return}
    const div = document.createElement('div')
    div.className = 'pacman'
    Frame.root.appendChild(div)
  }

  static get start_coodinates(){
    return {
      x : 14,
      y : 23,
    }
  }

  static get elm(){
    return document.querySelector('.frame-area .pacman')
  }

  static move(direction){
    if(Frame.is_ready){return}
    if(Pacman.direction){
      return
    }
    Pacman.direction = direction
    
    Pacman.elm.setAttribute('data-status' , "anim")
    this.moving()
  }

  static moving(){
    if(Main.is_dead || Main.is_clear){return}
    Pacman.next_pos = Frame.next_pos(Pacman.direction , Pacman.coodinates)
    //warp
    if(Frame.is_warp(Pacman.next_pos)){
      Pacman.coodinates = Frame.get_another_warp_pos(Pacman.next_pos)
      Pacman.next_pos   = Frame.next_pos(Pacman.direction , Pacman.coodinates)
    }
    if(Frame.is_collision(Pacman.next_pos)
    && !Pacman.is_wall(Pacman.next_pos)){
      Pacman.elm.setAttribute('data-status' , "")
      delete Pacman.direction
      return
    }
    Pacman.elm.setAttribute('data-direction' , Pacman.direction)
    Pacman.elm.animate(
      [
        {
          left : `${Pacman.coodinates.x * Frame.block_size}px`,
          top  : `${Pacman.coodinates.y * Frame.block_size}px`,
        },
        {
          left : `${Pacman.next_pos.x * Frame.block_size}px`,
          top  : `${Pacman.next_pos.y * Frame.block_size}px`,
        }
      ],
      {
        duration: Main.anim_speed
      }
    )
    Promise.all(Pacman.elm.getAnimations().map(e => e.finished)).then(()=>{
      Pacman.moved()
    })
  }

  static moved(){
    Pacman.coodinates = Pacman.next_pos
    Frame.put(Pacman.elm, Pacman.coodinates)
    Feed.move_map()
    
    if(Control.direction && Control.direction !== Pacman.direction){
      const temp_pos = Frame.next_pos(Control.direction , Pacman.coodinates)
      if(!Frame.is_collision(temp_pos)
      && !Pacman.is_wall(temp_pos)){
        Pacman.direction = Control.direction
      }
    }
    Pacman.moving()
  }

  static is_wall(map){
    const through_item = Frame.frame_datas[Frame.get_pos2num(map)]
    if(through_item === 'TU'
    || through_item === 'TD'
    || through_item === 'TL'
    || through_item === 'TR'){
      return true
    }
    else{
      false
    }
  }

  static is_collision(pos){
    if(!pos){return}
    if(Pacman.coodinates && pos.x === Pacman.coodinates.x && pos.y === Pacman.coodinates.y){
      return true
    }
    else if(Pacman.next_pos && pos.x === Pacman.next_pos.x && pos.y === Pacman.next_pos.y){
      return true
    }
    else{
      return false
    }
  }

  static crashed(elm_ghost){
    // Pacman.elm.setAttribute('data-anim' , '')
    setTimeout(Pacman.dead , 1000)
  }

  static dead(){
    Ghost.hidden_all()
    Pacman.elm.setAttribute('data-direction' , 'up')
    Pacman.elm.setAttribute('data-status' , 'dead')
  }

  static move_stop(){
    const anim = Pacman.elm.getAnimations()
    if(anim && anim.length){
      // console.log(anim.length)
      anim[0].pause()
    }
    else{

    }
  }

  static hidden(){
    Pacman.elm.style.setProperty('display','none','')
  }

  static remove(){
    Pacman.elm.parentNode.removeChild(Pacman.elm)
  }

  static close_mouse(){
    // Pacman.elm.setAttribute('data-status' , 'mouse-close')
  }

}