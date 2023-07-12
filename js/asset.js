import { Frame } from './frame.js'
import { Ghost } from './ghost.js'

export class Asset{
  constructor(options){
    this.options = options || {}
    return new Promise(resolve => {
      this.resolve = resolve
      this.loads()
    })
  }

  loads(){
    for(const data of this.options.files){
      const xhr = new XMLHttpRequest()
      xhr.open('get' , data.file , true)
      xhr.setRequestHeader('Content-Type', 'text/json');
      xhr.onload = this.loaded.bind(this , data)
      xhr.send()
    }
  }

  loaded(data , e){
    data.finished = true
    switch(data.target){
      case 'frame':
        Frame[data.name] = this.get_type(data.type, e.target.response)
        break
      case 'ghost':
        Ghost[data.name] = this.get_type(data.type, e.target.response)
        break
    }
    this.check()
  }
  
  get_type(type , data){
    switch(type){
      case 'json':
        return JSON.parse(data)
      case 'html':
      default:
        return data
    }
  }

  check(){
    for(const data of this.options.files){
      if(data.finished !== true){return}
    }
    this.finish()
  }

  finish(){
    if(!this.resolve){return}
    this.resolve()
  }

}