'use strict'

const encrypt = (content, password) => {
  try { return CryptoJS.AES.encrypt(JSON.stringify({ content }), password).toString() }
  catch (e) { throw new Error('Data could not be encrypted.') }
}
const decrypt = (crypted, password) => {
  try { return JSON.parse(CryptoJS.AES.decrypt(crypted, password).toString(CryptoJS.enc.Utf8)).content }
  catch (e) { throw new Error('Data could not be decrypted.') }
}

// Read the content from the input and crypt/decrypt to the output
const setup = () => {
  const content = el.input.value
  el.error.innerText = ''
  if (content === '') {
    el.copyOutput.style.visibility = 'hidden'
    return
  }
  el.copyOutput.style.visibility = 'visible'

  const password = el.password.value
  const action = el.action.value

  if (action === 'encrypt') el.output.value = encrypt(content, password)
  else if (action === 'decrypt') {
    try {
      el.output.value = decrypt(content, password)
    }
    catch (err) {
      el.error.innerText = err.message
      console.error(err)
    }
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms))

const cachedActionKey = 'crypto-action'
const el = {
  action: document.getElementById('action'),
  password: document.getElementById('password'),
  input: document.getElementById('input'),
  output: document.getElementById('output'),
  copyOutput: document.getElementById('copyOutput'),
  error: document.getElementById('error')
}

// Select cached action on page load
document.addEventListener('DOMContentLoaded', () => {
  const cachedAction = localStorage.getItem(cachedActionKey)
  if (cachedAction) el.action.value = cachedAction
})

// A new action was selected
el.action.addEventListener('change', e => {
  // Cache new action
  localStorage.setItem(cachedActionKey, e.srcElement.value)
  // Empty output
  el.output.value = ''
  el.error.innerText = ''
})

// Encrypt/Decrypt on input writing
el.input.addEventListener('input', setup)

// Encrypt/Decrypt on password writing
el.password.addEventListener('input', setup)

// Set the output as read only. "readonly" attribute hides the text cursor
el.output.addEventListener('keypress', e => e.preventDefault())

// Copy the output to clipboard
el.copyOutput.addEventListener('click', () => {
  el.output.select()
  document.execCommand("copy")
  el.copyOutput.innerText = 'Copied to clipboard!'
  delay(1200).then(() => (el.copyOutput.innerText = 'Copy to clipboard'))
})
