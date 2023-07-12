import { Frame }     from './frame.js'
import { Pacman }    from './pacman.js'


export class Feed{
  
  static move_map(){
    const num  = Frame.get_pos2num(Pacman.coodinates)
    const item = Frame.frame_datas[num]
    switch(item){
      case 'P1':
        this.eat_normal_dot(num)
        break
      case 'P2':
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
}