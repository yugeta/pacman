import { Frame }   from './frame.js'
import { Pacman }  from './pacman.js'
import { Control } from './control.js'
import { Css }     from './css.js'

export class Mobile{
  constructor(){
    this.set_window_size()
    this.set_event()
  }

  get window_size(){
    return window.innerWidth
  }

  get frame_size(){
    return Frame.root.offsetWidth
  }

  get elm_pacman_root(){
    return document.querySelector('.pacman-root')
  }

  static get block_size(){
    return Mobile.data_block_size || document.querySelector('.S5').offsetWidth
  }

  static get elm_memo(){
    return document.querySelector('.frame-footer .memo')
  }

  set_window_size(){
    if(this.window_size >= this.frame_size){return}
    const rate = this.window_size / this.frame_size
    this.elm_pacman_root.style.setProperty('transform',`scale(${rate})`,'')
  }

  set_event(){
    if(typeof window.ontouchstart !== 'undefined'){
      window.addEventListener('touchstart' , Mobile.touchstart.bind(this))
      window.addEventListener('touchmove'  , Mobile.touchmove.bind(this))
      window.addEventListener('touchend'   , Mobile.touchend.bind(this))
    }
  }

  static touchstart(e){
    Mobile.touch_datas = {
      pos : {
        x : e.touches[0].pageX,
        y : e.touches[0].pageY,
      },
      direction : null,
    }
    Mobile.view_memo()
  }

  static touchmove(e){
    if(!Mobile.touch_datas){return}
    Mobile.touch_datas.direction = Control.direction || null
    const pos = {
      x : e.touches[0].pageX,
      y : e.touches[0].pageY,
    }
    Control.direction = Mobile.get_direction(pos)
    if(Control.direction === Mobile.touch_datas.direction){return}
    Mobile.view_memo()
    Mobile.pacman_move(Control.direction)
  }

  static touchend(e){
    if(Mobile.touch_datas){
      delete Mobile.touch_datas
    }
    if(Control.direction){
      delete Control.direction
    }
  }

  static get_direction(pos){
    if(!Mobile.touch_datas){return}

    const min = 10

    const diff_pos = {
      x : pos.x - Mobile.touch_datas.pos.x,
      y : pos.y - Mobile.touch_datas.pos.y,
    }
    const volume = {
      x : Math.abs(diff_pos.x),
      y : Math.abs(diff_pos.y),
    }

    diff_pos.x = volume.x >= min ? diff_pos.x : 0
    diff_pos.y = volume.y >= min ? diff_pos.y : 0
    
    // vertical
    if(diff_pos.x && volume.x > volume.y){
      if(diff_pos.x < 0){
        return 'left'
      }
      else{
        return 'right'
      }
    }
    // horizontal
    else if(diff_pos.y && volume.x < volume.y){
      if(diff_pos.y < 0){
        return 'up'
      }
      else{
        return 'down'
      }
    }
    // other
    return null
  }

  static view_memo(){
    // console.log(Mobile.elm_memo,Mobile.touch_datas.direction)
    Mobile.elm_memo.textContent = Control.direction || ''
  }

  static pacman_move(direction){
    if(!direction){return}
    // Control.direction = direction
    Pacman.move(direction)
  }
}