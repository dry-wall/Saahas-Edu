// Basic Braille map - REPLACE with your backend logic
const brailleMap = {
    a:'⠁',b:'⠃',c:'⠉',d:'⠙',e:'⠑',f:'⠋',g:'⠛',h:'⠓',i:'⠊',j:'⠚',
    k:'⠅',l:'⠇',m:'⠍',n:'⠝',o:'⠕',p:'⠏',q:'⠟',r:'⠗',s:'⠎',t:'⠞',
    u:'⠥',v:'⠧',w:'⠺',x:'⠭',y:'⠽',z:'⠵',' ':'  '
  }
  
  export function convertToBraille(text) {
    return text.toLowerCase().split('').map(c => brailleMap[c] || c).join('')
  }