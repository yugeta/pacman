import { Main }     from './main.js'
import { Frame }    from './frame.js'
import { Control }  from './control.js'
import { Feed }     from './feed.js'
import { Ghost }    from './ghost.js'

export class Pacman{
  // 初期表示座標処理
  constructor(){
    Pacman.coodinates = this.start_coodinates
    Frame.put(this.elm, Pacman.coodinates)
    this.elm.style.setProperty('--anim-speed' , `${Main.anim_speed}ms` , '')
  }

  get start_coodinates(){
    return {
      x : 14,
      y : 23,
    }
  }

  get elm(){
    return Pacman.elm
  }

  static get elm(){
    return document.querySelector('.pacman')
  }

  static move(direction){
    if(Pacman.direction){
      return
    }
    Pacman.direction = direction
    
    this.elm.setAttribute('data-anim' , "true")
    this.moving()
  }

  static moving(){
    if(Main.is_dead){return}
    Pacman.next_pos = Frame.next_pos(Pacman.direction , Pacman.coodinates)
    //warp
    if(Frame.is_warp(Pacman.next_pos)){
      Pacman.coodinates = Frame.get_another_warp_pos(Pacman.next_pos)
      Pacman.next_pos   = Frame.next_pos(Pacman.direction , Pacman.coodinates)
    }
    if(Frame.is_collision(Pacman.next_pos)
    && !Pacman.is_wall(Pacman.next_pos)){
      this.elm.setAttribute('data-anim' , "")
      delete Pacman.direction
      return
    }
    this.elm.setAttribute('data-direction' , Pacman.direction)
    this.elm.animate(
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
    Promise.all(this.elm.getAnimations().map(e => e.finished)).then(()=>{
      Pacman.moved()
    })
  }

  static moved(){
    Pacman.coodinates = Pacman.next_pos
    Frame.put(this.elm, Pacman.coodinates)
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
    if(!pos || !Pacman.coodinates || !Pacman.next_pos){return}
    if(pos.x === Pacman.coodinates.x && pos.y === Pacman.coodinates.y){
      return true
    }
    else if(pos.x === Pacman.next_pos.x && pos.y === Pacman.next_pos.y){
      return true
    }
    else{
      return false
    }
  }

  static crashed(elm_ghost){console.log('pacman-dead' , elm_ghost)
    setTimeout(Pacman.dead , 1000)
    const anim = Pacman.elm.getAnimations()
    if(anim && anim.length){
      anim[0].pause()
    }
  }

  static dead(){
    Ghost.hidden_all()
    Pacman.elm.setAttribute('data-direction' , 'up')
    Pacman.elm.setAttribute('data-status' , 'dead')
  }
}