function change_eye(){
  this.directions = ['right','left','top','bottom']
  this.direction = this.directions[0]
  this.change()
}
change_eye.prototype.change = function(){
  const elms = document.querySelectorAll('.ghost .eye')
  for(const elm of elms){
    const num = Math.floor(Math.random() * this.directions.length)
    elm.setAttribute('data-direction' , this.directions[num])
  }
  setTimeout(this.change.bind(this) , 2000)
}

switch(document.readyState){
  case 'complete':
  case 'interactice':
    new change_eye()
    break
  default:
    window.addEventListener('load' , (()=>{
      new change_eye()
    }))
}