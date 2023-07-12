import { Main } from './main.js'

export class Footer{
  constructor(){
    this.view()
  }
  static get area(){
    return document.querySelector(`.frame-footer`)
  }

  static get life(){
    return document.querySelector(`.life-count`)
  }

  static get life_count(){
    return Footer.life.querySelectorAll(`.pacman`).length
  }

  view(){
    for(let i=0; i<Main.life_count; i++){
      const div = document.createElement('div')
      div.className = 'pacman'
      Footer.life.appendChild(div)
    }
  }

  static delete_life(){
    const elms = Footer.life.querySelectorAll(`:scope .pacman`)
    if(!elms.length){return}
    const target_elm = elms[elms.length-1]
    target_elm.parentNode.removeChild(target_elm)
  }
}