import { Frame }     from './frame.js'
import { Pacman }    from './pacman.js'
import { Ghost }     from './ghost.js'

export class Feed{
  
  static move_map(){
    const num  = Frame.get_pos2num(Pacman.coodinates)
    const item = Frame.frame_datas[num]
    switch(item){
      case 'P1':
        this.eat_normal_dot(num)
        break
      case 'P2':
        Feed.power_on()
        Feed.flg_soon = setTimeout(Feed.power_soon , 7000)
        Feed.flg_off  = setTimeout(Feed.power_off  , 10000)
        this.eat_big_dot(num)
        break
    }
  }
  
  static eat_normal_dot(num){
    Frame.frame_datas[num] = 'S5'
    const elm = Frame.get_elm(num)
    if(!elm){return}
    
    elm.setAttribute('class','S5')
  }

  static eat_big_dot(num){
    Frame.frame_datas[num] = 'S5'
    const elm = Frame.get_elm(num)
    if(!elm){return}
    
    elm.setAttribute('class','S5')
  }

  static power_on(){
    Frame.root.setAttribute('data-power' , '1')
    Ghost.power_on()
    if(Feed.flg_soon){
      clearTimeout(Feed.flg_soon)
    }
    if(Feed.flg_off){
      clearTimeout(Feed.flg_off)
    }
  }
  static power_soon(){
    Frame.root.setAttribute('data-power' , '2')
  }
  static power_off(){
    Frame.root.setAttribute('data-power' , '0')
    Ghost.power_off()
    delete Feed.flg_soon
    delete Feed.flg_off
  }
}