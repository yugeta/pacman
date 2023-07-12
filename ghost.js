function change_eye(){
  this.directions = ['right','left','top','bottom']
  this.direction = this.directions[0]
  this.change()
}
change_eye.prototype.change = function(){
  const num = Math.floor(Math.random() * this.directions.length)
  document.querySelector('.ghost .eye').setAttribute('data-direction' , this.directions[num])
  setTimeout(this.change.bind(this) , 3000)
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