import { Main }    from './main.js'
import { Pacman }  from './pacman.js'
import { Ghost }   from './ghost.js'
import { Feed }    from './feed.js'
import { Control } from './control.js'
import { Footer }  from './footer.js'
import { Mobile }  from './mobile.js'

export class Frame{
  constructor(){
    Frame.create()
    Frame.start()
  }

  static get root(){
    return document.querySelector(`.frame-area`)
  }

  static get block_size(){
    // const s5 = document.querySelector('.S5')
    // return s5.offsetWidth
    return Mobile.block_size
  }

  static get cols_count(){
    return ~~(Frame.root.offsetWidth / Frame.block_size)
  }

  static get is_ready(){
    return Frame.root.getAttribute('data-status') === 'ready' ? true : false
  }

  static get_elm(num){
    return Frame.root.querySelector(`[data-num='${num}']`)
  }

  static get is_weak(){
    const power = Frame.root.getAttribute('data-power')
    switch(power){
      case '1':
      case '2':
        return true
      default:
        return false
    }
  }

  static get is_clear(){
    return Frame.root.getAttribute('data-status') === 'clear' ? true : false
  }

  static get is_game_over(){
    return Footer.life_count <= 0 ? true : false
  }

  static start(){
    if(!Frame.is_game_over){
      Frame.root.setAttribute('data-status' , 'ready')
      Ghost.init()
      Pacman.init()
      Frame.message_on(`READY!`)
      setTimeout((()=>{
        Frame.root.setAttribute('data-status' , '')
        Frame.message_off()
        Ghost.start()
        Pacman.start()
      }),2000)
    }
    else{
      Frame.game_over()
    }
  }

  static game_over(){
    Frame.message_on(`GAME OVER`)
  }

  static get elm_message(){
    return Frame.root.querySelector('.message')
  }

  static message_on(message){
    const div = document.createElement('div')
    div.className = 'message'
    div.innerHTML = message
    Frame.root.appendChild(div)
  }

  static message_off(){
    Frame.root.removeChild(this.elm_message)
  }

  static create(){
    Frame.frame_datas = JSON.parse(Frame.asset_json)
    Frame.view()
    Frame.set_collision()
    Frame.set_ghost_start_area()
  }

  static crear(){
    Frame.root.innerHTML = ''
  }

  static view(){
    for(let i=0; i<Frame.frame_datas.length; i++){
        const p = document.createElement('p')
        p.className = Frame.frame_datas[i]
        Frame.root.appendChild(p)
        p.setAttribute('data-num' , i)
    }
  }

  static put(elm , coodinates){
    if(!elm){return}
    const pos = this.calc_coodinates2position(coodinates)
    this.pos(elm , pos)
    elm.setAttribute('data-x' , coodinates.x)
    elm.setAttribute('data-y' , coodinates.y)
  }

  static calc_coodinates2position(coodinates){
    const size = Frame.block_size
    return {
      x : (coodinates.x) * size,
      y : (coodinates.y) * size,
    }
  }

  static pos(elm , pos){
    elm.style.setProperty('left' , `${pos.x}px` , '')
    elm.style.setProperty('top'  , `${pos.y}px` , '')
  }

  // 壁座標に1を設置
  static set_collision(type){
    const cols_count = Frame.cols_count
    const maps = []
    let row_count = 0
    for(const frame_data of Frame.frame_datas){
      maps[row_count] = maps[row_count] || []
      // 移動できる
      if(frame_data.match(/^P/i)
      || frame_data.toUpperCase() === 'S5'
      || frame_data.match(/^W/i)
      || frame_data.match(/^T/i)){
        maps[row_count].push(0)
      }
      // 壁
      else{
        maps[row_count].push(1)
      }
      if(maps[row_count].length === cols_count){
        row_count++
      }
    }
    Frame.map = this.map = maps
  }

  static is_collision(map){
    if(!map || !Frame.map || !Frame.map[map.y]){return}
    return Frame.map[map.y][map.x]
  }

  // type @ [pacman , ghost]
  static is_through(map , direction, status){
    const through_item = Frame.frame_datas[Frame.get_pos2num(map)]
    if(status === 'dead'){
      // return true
      if(through_item === 'TU' && direction === 'up'
      || through_item === 'TD' && direction === 'down'
      || through_item === 'TL' && direction === 'left'
      || through_item === 'TR' && direction === 'right'){
        return false
      }
      else{
        return true
      }
    }
    else{
      if(through_item === 'TU' && direction !== 'up'
      || through_item === 'TD' && direction !== 'down'
      || through_item === 'TL' && direction !== 'left'
      || through_item === 'TR' && direction !== 'right'){
        return false
      }
      else{
        return true
      }
    }
  }

  static get_pos2num(pos){
    return pos.y * Frame.map[0].length + pos.x
  }
  static get_num2pos(num){
    return {
      x : num % Frame.map[0].length,
      y : ~~(num / Frame.map[0].length),
    }
  }

  static is_warp(map){
    const num = Frame.get_pos2num(map)
    return Frame.frame_datas[num] === 'W1' ? true : false
  }

  static get_another_warp_pos(map){
    const warp_index_arr = Frame.filterIndex(Frame.frame_datas , 'W1')
    const current_index = Frame.get_pos2num(map)
    const another_num = warp_index_arr.find(e => e !== current_index)
    return Frame.get_num2pos(another_num)
  }

  static filterIndex(datas,target){
    const res_arr = []
    for(let i=0; i<datas.length; i++){
      if(datas[i] === target){
        res_arr.push(i)
      }
    }
    return res_arr
  }

  static next_pos(direction , pos){
    const temp_pos = {
      x : pos.x,
      y : pos.y,
    }
    switch(direction){
      case 'left':
        temp_pos.x -= 1
        break
      case 'right':
        temp_pos.x += 1
        break
      case 'up':
        temp_pos.y -= 1
        break
      case 'down':
        temp_pos.y += 1
        break
      default: return
    }
    return temp_pos
  }

  static set_ghost_start_area(){
    const ghost_start_area = []
    for(let i=0; i<Frame.frame_datas.length; i++){
      if(Frame.frame_datas[i] !== 'TU'
      && Frame.frame_datas[i] !== 'TD'
      && Frame.frame_datas[i] !== 'TL'
      && Frame.frame_datas[i] !== 'TR'){continue}
      const pos = Frame.get_num2pos(i)
      ghost_start_area.push({
        num : i,
        pos : pos,
      })
    }
    const pos = {
      x : ghost_start_area.map(e => e.pos.x).reduce((sum , e)=>{ return sum + e}) / ghost_start_area.length,
      y : ghost_start_area.map(e => e.pos.y).reduce((sum , e)=>{ return sum + e}) / ghost_start_area.length,
    }

    Frame.ghost_start_area = pos
  }

  static stage_clear(){
    Main.is_clear = true
    Control.clear()
    Pacman.move_stop()
    Pacman.close_mouse()
    Ghost.move_stops()
    Ghost.hidden_all()
    setTimeout((()=>{
      Frame.root.setAttribute('data-status' , 'clear')
    }),500)
    setTimeout((()=>{
      Control.direction = null
      Main.is_clear = false
      Frame.crear()
      Frame.root.setAttribute('data-status' , '')
      Frame.create()
      Feed.reset_data()
      Frame.start()
    }),4000)
  }

  static crashed(){
    Control.clear()
    Ghost.move_stops()
    Ghost.remove_all()
    setTimeout((()=>{
      Control.direction = null
      Main.is_dead = false
      Frame.root.setAttribute('data-status' , '')
      Frame.set_ghost_start_area()
      Pacman.remove()
      Frame.start()
    }),3000)
  }
}