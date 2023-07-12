export class Frame{
  constructor(){
    Frame.stage_datas = this.stage_datas = []
    this.load_asset()
  }
  static get root(){
    return document.querySelector(`.frame-area`)
  }

  get block_size(){
    const s5 = document.querySelector('.S5')
    return s5.offsetWidth
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
      }
    }).bind(this)
    xhr.send()
  }

  view(){
    for(let i=0; i<this.frame_datas.length; i++){
        const p = document.createElement('p')
        p.className = this.frame_datas[i]
        Frame.root.appendChild(p)
        // this.stage_datas[i] = this.frame_datas[i] === 'S5' ? 1 : 0
    }
  }

}