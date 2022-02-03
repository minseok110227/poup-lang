let STOP = false

const codeElem   = document.getElementsByName('code')[0]
const outputElem = document.getElementsByName('output')[0]
const dumpsElem  = document.getElementsByName('dumps')[0]

const runElem   = document.getElementsByName('run')[0]
const stopElem  = document.getElementsByName('stop')[0]
// const stepElem  = document.getElementsByName('step')[0]
const clearElem = document.getElementsByName('clear')[0]
const resetElem = document.getElementsByName('reset')[0]

const speedElem = document.getElementsByName('speed')[0]
const splabelElem = document.getElementsByName('splabel')[0]

splabelElem.innerText = '실행 속도: ' + speedElem.value + 'ms당 1스텝'


runElem.onclick   = () => run(codeElem.value)
stopElem.onclick  = () => STOP = true
clearElem.onclick = () => { outputElem.value = ''; dumpsElem.value = '' }
resetElem.onclick = () => codeElem.value = ''
speedElem.oninput = () => splabelElem.innerText = '실행 속도: ' + speedElem.value + 'ms당 1스텝'

function run (code) {
  STOP = false
  outputElem.value = ''
  runElem.disabled = true
  speedElem.disabled = true
  outputElem.style.borderColor = ''

  const statements = code.trim().split(code.includes('~') ? '~' : '\n').map(line => line.trim())

  if (statements[0] !== '풉ㅋ' || !statements.slice(-1)[0].startsWith('팝ㅋ')) {
    runElem.disabled = false
    speedElem.disabled = false
    outputElem.style.borderColor = 'red'
    return outputElem.value = '이것도 풉랭이라고 쓴거임?'
  }
 
  const variables = []
  let pointer = 0

  function execute (statement) {
    if (statement.includes('ㅋㅋ') && statement.includes('?')) { // IF GOTO
      const condition = evaluate(statement.substring(2, statement.lastIndexOf('?') + 1))
      if (condition === 0) return execute(statement.substr(statement.lastIndexOf('?') + 1))
      return
    }
    
    if (statement.includes('풉')) {
      const variablePointer = statement.split('풉')[0].split('ㅋ').length
      const setteeValue = evaluate(statement.split('풉')[1])
      variables[variablePointer] = setteeValue
    }
  
    if (statement.includes('ㅋ') && statement[statement.length - 1] === '!') {      
      printOut(String(evaluate(statement.slice(1, -1))))
    }
  
    if (statement.includes('캌') && statement[statement.length - 1] === 'ㅋ') {
      if (statement === '캌ㅋ') printOut('\n')
      printOut(stringify(evaluate(statement.slice(1, -1))))
    }
  
    if (statement.includes('푸웁')) {
      pointer = evaluate(statement.split('푸웁')[1]) - 1
    }
  
    if (statement.indexOf('팝') === 0) {
      return evaluate(statement.split('팝')[1])
    }
  }
 
  const interval = setInterval(() => {
    if (statements[pointer].startsWith('팝ㅋ')) stop()
    if (STOP) { STOP = false; stop() }
  
    const statement = statements[pointer++]
    const evaluated = execute(statement)
    dumpsElem.value =
      'Variables:\n' + variables.reduce((prev, curr, i) => prev + (i++ + '. ' + curr) + '\n', '') +
      '\n\nStatement: (' + pointer + '/' + statements.length + ')\n' + (statements[pointer] || '') +
      (evaluated ? '\n\nReturned: ' + evaluated : '')
    if (evaluated) stop()
  }, speedElem.value)

  // --- utilities

  function printOut (str) {
    outputElem.value += str
    outputElem.scrollTo(0, 9999)
  }

  function stop () {
    runElem.disabled = false
    speedElem.disabled = false
    clearInterval(interval)
  }

  function evaluate (x) {
    let n = 0
    if (x.includes(' ')) return x.split(' ').map(evaluate).reduce((a, b) => a * b)
    if (x.includes('ㅋ?')) {
      const answer = prompt();
      x = x.replace('ㅋ?', '.'.repeat(Number(answer)))
    }
    if (x.includes('ㅋ')) n += variables[x.split('ㅋ').length - 1]
    if (x.includes('.')) n += x.split('.').length - 1
    if (x.includes(',')) n -= x.split(',').length - 1
    return n
  }
}

function stringify (unicode) {
  const char = String.fromCharCode(unicode)
  return char.match(/[\x00-\x1F]/) ? '' : char
}