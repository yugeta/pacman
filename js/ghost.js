import { Main }   from './main.js'
import { Frame }  from './frame.js'
import { Pacman } from './pacman.js'

export class Ghost{
  constructor(){
    this.put_element()
  }

  static datas = [
    { id : 1,
      direction : null,
      coodinate : { x : 12, y : 11 },
    },
    { id : 2,
      direction : null,
      coodinate : { x : 15, y : 11 },
    },
    { id : 3,
      direction : null,
      coodinate : { x : 12, y : 14 },
    },
    { id : 4,
      direction : null,
      coodinate : { x : 15, y : 14 },
    },
  ]

  static get elm_ghosts(){
    return document.querySelectorAll('.ghost')
  }

  static get_data(elm){
    const color_num = elm.getAttribute('data-color')
    return Ghost.datas.find(e => e.id === Number(color_num))
  }

  static get_id(elm){
    const data = Ghost.get_data(elm)
    return data.id
  }
  static get_coodinate(elm){
    const data = Ghost.get_data(elm)
    return data.coodinate
  }

  put_element(){
    for(const data of Ghost.datas){
      const elm = document.createElement('div')
      elm.className = 'ghost'
      elm.setAttribute('data-color' , data.id)
      Frame.root.appendChild(elm)
    }
    this.load_asset()
  }

  load_asset(){
    const xhr = new XMLHttpRequest()
    xhr.open('get' , `assets/ghost.html` , true)
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.onreadystatechange = ((e) => {
      if(xhr.readyState !== XMLHttpRequest.DONE){return}
      if(xhr.status === 404){return}
      if (xhr.status === 200) {
        this.asset = e.target.response
        this.set_ghost()
        setTimeout(this.set_move.bind(this) , 300)
      }
    }).bind(this)
    xhr.send()
  }

  set_ghost(){
    const elm_ghosts = Ghost.elm_ghosts
    for(const elm_ghost of elm_ghosts){
      const coodinate = Ghost.get_coodinate(elm_ghost)
      Frame.put(elm_ghost, coodinate)
      elm_ghost.innerHTML = this.asset
    }
  }

  set_move(){
    const elm_ghosts = Ghost.elm_ghosts
    for(const elm_ghost of elm_ghosts){
      this.move(elm_ghost)
    }
  }

  move(elm_ghost){
    if(!elm_ghost){return}
    const data       = Ghost.get_data(elm_ghost)
    const coodinate  = Ghost.get_coodinate(elm_ghost)
    const status     = Ghost.get_status(elm_ghost)
    const directions = Ghost.get_enable_directions(coodinate , data.direction , status) || Ghost.get_enable_directions(coodinate)
    const direction  = Ghost.get_direction(elm_ghost, directions)
    const next_pos   = Frame.next_pos(direction , coodinate)
    Ghost.set_direction(elm_ghost , direction)
    this.moving(elm_ghost , next_pos)
  }
  moving(elm_ghost , next_pos){
    if(!elm_ghost || !next_pos){return}
    const data = Ghost.get_data(elm_ghost)
    if(!data){return}
    if(Main.is_dead){
      return
    }

    //warp
    if(Frame.is_warp(next_pos)){
      data.coodinate = Frame.get_another_warp_pos(next_pos)
      next_pos = Frame.next_pos(data.direction , data.coodinate)
    }
    if(!next_pos){return}

    const before_pos = {
      x : data.coodinate.x * Frame.block_size,
      y : data.coodinate.y * Frame.block_size,
    }
    const after_pos = {
      x : next_pos.x * Frame.block_size,
      y : next_pos.y * Frame.block_size,
    }
    if(Pacman.is_collision(next_pos)){
      switch(elm_ghost.getAttribute('data-status')){
        case 'weak':
          Ghost.dead(elm_ghost)
          break
        case 'dead':
          break
        default:
          Ghost.crashed(elm_ghost)
          Pacman.crashed(elm_ghost)
          return
      }
    }
    data.next_pos = next_pos
    const id = 'ghost_anim'
    elm_ghost.animate(
      [
        {
          left : `${before_pos.x}px`,
          top  : `${before_pos.y}px`,
        },
        {
          left : `${after_pos.x}px`,
          top  : `${after_pos.y}px`,
        }
      ],
      {
        id : id,
        duration: Ghost.get_speed(elm_ghost)
      }
    )

    Promise.all([elm_ghost.getAnimations().find(e => e.id === id).finished])
    .then(this.moved.bind(this , elm_ghost))
  }
  moved(elm_ghost , e){
    const data = Ghost.get_data(elm_ghost)
    
    elm_ghost.style.setProperty('left' , `${data.next_pos.x * Frame.block_size}px` , '')
    elm_ghost.style.setProperty('top'  , `${data.next_pos.y * Frame.block_size}px` , '')
    
    data.coodinate = data.next_pos
    
    if(Main.is_dead){return}
    if(Pacman.is_collision(data.coodinate)){
      switch(elm_ghost.getAttribute('data-status')){
        case 'weak':
          Ghost.dead(elm_ghost)
          break
        case 'dead':
          break
        default:
          Ghost.crashed(elm_ghost)
          Pacman.crashed(elm_ghost)
          return
      }
    }

    // dead -> alive
    if(Ghost.get_status(elm_ghost) === 'dead'){
      const current_stage_item = Frame.frame_datas[Frame.get_pos2num(data.coodinate)]
      if(current_stage_item.match(/^T/i)){
        Ghost.alive(elm_ghost)
      }
    }

    if(elm_ghost.hasAttribute('data-reverse')){
      elm_ghost.removeAttribute('data-reverse')
      this.reverse_move(elm_ghost , data)
    }
    else{
      this.next_move(elm_ghost , data)
    }
  }
  reverse_move(elm_ghost , data){
    const direction = Ghost.reverse_direction(data.direction)
    Ghost.set_direction(elm_ghost , direction)
    data.direction = direction
    const next_pos = Frame.next_pos(data.direction , data.coodinate)
    this.moving(elm_ghost , next_pos)
  }
  next_move(elm_ghost , data){
    const directions = Ghost.get_enable_directions(data.coodinate , data.direction , Ghost.get_status(elm_ghost))
    const direction  = Ghost.get_direction(elm_ghost, directions)
    Ghost.set_direction(elm_ghost , direction)
    const next_pos = Frame.next_pos(data.direction , data.coodinate)
    if(Frame.is_collision(next_pos)){
      this.move(elm_ghost)
    }
    else{
      this.moving(elm_ghost , next_pos)
    }
  }

  static get_direction(elm_ghost, directions){
    if(!directions || !directions.length){return null}

    switch(Ghost.get_status(elm_ghost)){
      // dead : go to the start-area
      case 'dead':
        if(directions.length === 1){
          return directions[0]
        }
        
        const ghost_data  = Ghost.get_data(elm_ghost)
        const start_datas = Frame.ghost_start_area

        if(directions.indexOf('right') !== -1
        && ghost_data.coodinate.x > start_datas.x){
          const index = directions.findIndex(e => e === 'right')
          directions.splice(index,1)
        }
        if(directions.indexOf('left') !== -1
        && ghost_data.coodinate.x < start_datas.x){
          const index = directions.findIndex(e => e === 'left')
          directions.splice(index,1)
        }
        if(directions.indexOf('bottom') !== -1
        && ghost_data.coodinate.y > start_datas.y){
          const index = directions.findIndex(e => e === 'bottom')
          directions.splice(index,1)
        }
        if(directions.indexOf('top') !== -1
        && ghost_data.coodinate.y < start_datas.y){
          const index = directions.findIndex(e => e === 'top')
          directions.splice(index,1)
        }

        const num = Math.floor(Math.random() * directions.length)
        return directions[num] || null

      // normal
      default:
        const direction_num = Math.floor(Math.random() * directions.length)
        return directions[direction_num] || null
    }
    
  }

  // 移動可能な方向の一覧を取得する
  static get_enable_directions(pos , direction , status){
    const directions = []

    // Through（通り抜け）
    const frame_data = Frame.frame_datas[Frame.get_pos2num(pos)]
    if(frame_data.match(/^T/i)){
      return [direction]
    }

    // 右 : right
    if(pos.x + 1 < Frame.map[pos.y].length
    && !Frame.is_collision({x: pos.x + 1, y: pos.y})
    && Frame.is_through({x: pos.x + 1, y: pos.y} , 'right' , status)
    && direction !== 'left'){
      directions.push('right')
    }
    // 左 : left
    if(pos.x - 1 >= 0
    && !Frame.is_collision({x: pos.x - 1, y: pos.y})
    && Frame.is_through({x: pos.x - 1, y: pos.y} , 'left' , status)
    && direction !== 'right'){
      directions.push('left')
    }
    // 上 : up 
    if(pos.y - 1 >= 0
    && !Frame.is_collision({x: pos.x, y: pos.y - 1})
    && Frame.is_through({x: pos.x, y: pos.y - 1} , 'up' , status)
    && direction !== 'down' ){
      directions.push('up')
    }
    // 下 : down
    if(pos.y + 1 < Frame.map.length
    && !Frame.is_collision({x: pos.x, y: pos.y + 1})
    && Frame.is_through({x: pos.x, y: pos.y + 1} , 'down' , status)
    && direction !== 'up'){
      directions.push('down')
    }

    if(directions.length){
      return directions
    }
    else{
      return [Ghost.reverse_direction(direction)]
    }
  }

  static reverse_direction(direction){
    switch(direction){
      case 'right' : return 'left'
      case 'left'  : return 'right'
      case 'up'    : return 'down'
      case 'down'  : return 'up'
    }
  }

  static set_direction(elm_ghost , direction){
    const data     = Ghost.get_data(elm_ghost)
    data.direction = direction
    const head     = elm_ghost.querySelector('.head')
    if(!head){return}
    head.setAttribute('data-direction' , direction)
  }

  static power_on(){
    for(const elm of Ghost.elm_ghosts){
      if(Ghost.get_status(elm) === 'dead'){continue}
      elm.setAttribute('data-reverse' , '1')
      elm.setAttribute('data-status' , 'weak')
    }
  }
  static power_off(){
    for(const elm of Ghost.elm_ghosts){
      if(elm.getAttribute('data-status') === 'weak'){
        elm.setAttribute('data-status' , '')
      }
    }
  }
  
  static crashed(elm_ghost){
    Main.is_crash = true
    Main.is_dead = true
    const svg = elm_ghost.querySelector('.under svg')
    svg.pauseAnimations()
    const anim = elm_ghost.getAnimations()
    if(anim && anim.length){
      anim[0].pause()
    }
  }

  static hidden_all(){
    for(const elm of Ghost.elm_ghosts){
      elm.style.setProperty('display' , 'none' , '');
    }
  }

  static dead(elm_ghost){
    elm_ghost.setAttribute('data-status' , 'dead')
  }

  static alive(elm_ghost){
    elm_ghost.setAttribute('data-status' , '')
  }

  static get_status(elm_ghost){
    return elm_ghost.getAttribute('data-status')
  }

  static get_speed(elm_ghost){
    switch(Ghost.get_status(elm_ghost)){
      case 'weak':
        return Main.ghost_weak_speed
      case 'dead':
        return Main.ghost_dead_speed
      default:
        return Main.ghost_normal_speed
    }
  }
}