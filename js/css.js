

/**
 * # options
 *   // cssの値をセットする場合
 *   set_css(selector , property , value)
 * 
 *   // cssの値を取得する場合
 *   get_css(selector , property)
 */

export class Css{
  static set_css(selector , property , value){
    const rules = Css.get_rules(selector)
    const rule = rules[rules.length-1]
    rule.style.setProperty(property , value , '')
  }

  static get_ss(selector , property){
    const styleSheets = Array.from(document.styleSheets).filter((styleSheet) => !styleSheet.href || styleSheet.href.startsWith(window.location.origin))
    let value = null
    for(const ss of styleSheets){
      if(!ss.cssRules){continue}
      for(const cssRule of ss.cssRules){
        if(!cssRule.styleSheet || !cssRule.styleSheet.cssRules){continue}
        for(const rule of cssRule.styleSheet.cssRules){
          if(rule.selectorText !== selector){continue}
          value = rule.style[property]
        }
      }
    }
    return value;
  }

  static get_css(selector , property){
    const rules = Css.get_rules(selector)
    let value = null
    for(const rule of rules){
      value = rule.style.getPropertyValue(property) || null
    }
    return value
  }

  static get_rules(selector){
    const styleSheets = Array.from(document.styleSheets).filter((styleSheet) => !styleSheet.href || styleSheet.href.startsWith(window.location.origin))
    let arr = []
    for(const ss of styleSheets){
      if(!ss.cssRules){continue}
      const res =  this.get_rule(ss.cssRules , selector)
      if(!res || !res.length){continue}
      arr = arr.concat(res)
    }
    return arr;
  }

  static get_rule(rules , selector){
    if(!rules){return}
    let arr = []
    for(const rule of rules){
      if(rule.selectorText === selector){
        arr.push(rule)
      }
      if(rule.styleSheet && rule.styleSheet.cssRules){
        const res = Css.get_rule(rule.styleSheet.cssRules , selector)
        if(!res || !res.length){continue}
        arr = arr.concat(res)
      }
    }
    return arr;
  }
}