import { Frame }  from './frame.js'

export class Ghost{
  constructor(){
    this.load_asset()
  }

  static get elm_ghosts(){
    return document.querySelectorAll('.ghost')
  }

  static start_coodinates = [
    { x : 12, y : 11 },
    { x : 15, y : 11 },
    { x : 12, y : 14 },
    { x : 15, y : 14 },
  ]

  load_asset(){
    const xhr = new XMLHttpRequest()
    xhr.open('get' , `assets/ghost.html` , true)
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.onreadystatechange = ((e) => {
      if(xhr.readyState !== XMLHttpRequest.DONE){return}
      if(xhr.status === 404){return}
      if (xhr.status === 200) {
        this.asset = e.target.response
        this.ghost_set()
      }
    }).bind(this)
    xhr.send()
  }

  ghost_set(){
    const elm_ghosts = Ghost.elm_ghosts
    for(const elm_ghost of elm_ghosts){
      Frame.put(elm_ghost, Ghost.start_coodinates.shift())
      elm_ghost.innerHTML = this.asset
      this.change_eye(elm_ghost)
    }
  }

  static get directions(){
    return ['right','left','top','bottom']
  }

  change_eye(elm_ghost){
    const num = Math.floor(Math.random() * Ghost.directions.length)
    elm_ghost.querySelector('.face').setAttribute('data-direction' , Ghost.directions[num])
    setTimeout(this.change_eye.bind(this , elm_ghost) , 3000)
  }
}