export class Frame{
  constructor(){
    return new Promise(resolve => {
      this.resolve = resolve
      Frame.stage_datas = this.stage_datas = []
      this.load_asset()
    })
  }
  static get root(){
    return document.querySelector(`.frame-area`)
  }

  get block_size(){
    return Frame.block_size
  }

  static get block_size(){
    const s5 = document.querySelector('.S5')
    return s5.offsetWidth
  }

  get cols_count(){
    return ~~(Frame.root.offsetWidth / Frame.block_size)
  }

  load_asset(){
    const xhr = new XMLHttpRequest()
    xhr.open('get' , `assets/frame.json` , true)
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.onreadystatechange = ((e) => {
      if(xhr.readyState !== XMLHttpRequest.DONE){return}
      if(xhr.status === 404){return}
      if (xhr.status === 200) {
        Frame.frame_datas =this.frame_datas = JSON.parse(e.target.response)
        this.view()
        this.set_collision()
        this.finish()
      }
    }).bind(this)
    xhr.send()
  }

  view(){
    for(let i=0; i<this.frame_datas.length; i++){
        const p = document.createElement('p')
        p.className = this.frame_datas[i]
        Frame.root.appendChild(p)
    }
  }

  finish(){
    if(this.resolve){
      this.resolve(this)
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
  set_collision(){
    const cols_count = this.cols_count
    const maps = []
    let row_count = 0
    for(const frame_data of this.frame_datas){
      maps[row_count] = maps[row_count] || []
      // 移動できる
      if(frame_data.match(/^P/i) || frame_data.toUpperCase() === 'S5'){
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
    return Frame.map[map.y][map.x]
  }
}