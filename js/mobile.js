import { Frame } from './frame.js'
import { Css }   from './css.js'

export class Mobile{
  constructor(){
    this.set_window_size()
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

  set_window_size(){
    if(this.window_size >= this.frame_size){return}
    const rate = this.window_size / this.frame_size

    // const value = Css.get_css(':root' , '--block')
    // const block_size = Number(value.replace('px',''))
    // const new_size = block_size * rate
    // Css.set_css(':root' , '--block' , `${new_size}px`)
    // Mobile.data_block_size = new_size

    // console.log(value,block_size,new_size)
    this.elm_pacman_root.style.setProperty('transform',`scale(${rate})`,'')
    

    // console.log(Css.get_css(':root' , '--block'))
  }

  set_event(){
    if(typeof window.ontouchstart !== 'undefined'){
      window.addEventListener('touchstart' , Control.touchstart.bind(this))
      window.addEventListener('touchmove'  , Control.touchmove.bind(this))
      window.addEventListener('touchend'   , Control.touchend.bind(this))
    }
  }

  static touchstart(e){
    console.log(e)
  }

  static touchmove(e){
    console.log(e)
  }

  static touchend(e){
    console.log(e)
  }
}