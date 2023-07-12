import { Frame }    from './frame.js'
import { Control }  from './control.js'

export class Pacman{
  // 初期表示座標処理
  constructor(){
    Pacman.anim_speed = 400
    Pacman.coodinates = this.start_coodinates
    Frame.put(this.elm, Pacman.coodinates)
    this.elm.style.setProperty('--anim-speed' , `${Pacman.anim_speed}ms` , '')
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

  static move(key_data){
    if(Pacman.key_data ){
      if(Pacman.key_data.name !== key_data.name){
        Pacman.key_data = key_data
      }
      return
    }
    Pacman.key_data = key_data
    
    this.elm.setAttribute('data-anim' , "true")
    this.moving()
  }
  static moving(){
    const next_pos = {
      x : Pacman.coodinates.x,
      y : Pacman.coodinates.y,
    }
    switch(Pacman.key_data.name){
      case 'left':
        next_pos.x -= 1
        break
      case 'right':
        next_pos.x += 1
        break
      case 'up':
        next_pos.y -= 1
        break
      case 'down':
        next_pos.y += 1
        break
      default: return
    }
    this.elm.setAttribute('data-direction' , Pacman.key_data.name)
    this.elm.animate(
      [
        {
          left : `${Pacman.coodinates.x * Frame.block_size}px`,
          top  : `${Pacman.coodinates.y * Frame.block_size}px`,
        },
        {
          left : `${next_pos.x * Frame.block_size}px`,
          top  : `${next_pos.y * Frame.block_size}px`,
        }
      ],
      {
        duration: Pacman.anim_speed
      }
    )
    Promise.all(this.elm.getAnimations().map(e => e.finished)).then(()=>{
      Pacman.moved(next_pos)
    })
  }

  static moved(next_pos){
    if(!Pacman.key_data){return}
    Pacman.coodinates = next_pos
    Frame.put(this.elm, Pacman.coodinates)
    if(Control.key_data){
      Pacman.moving()
    }
    else{
      this.elm.setAttribute('data-anim' , "")
      delete Pacman.key_data
    }
  }
}