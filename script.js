'use strict'

const encrypt = (content, password) => {
  try { return CryptoJS.AES.encrypt(JSON.stringify({ content }), password).toString() }
  catch (e) { throw new Error('Data could not be encrypted.') }
}
const decrypt = (crypted, password) => {
  try { return JSON.parse(CryptoJS.AES.decrypt(crypted, password).toString(CryptoJS.enc.Utf8)).content }
  catch (e) { throw new Error('Data could not be decrypted.') }
}

const cachedActionKey = 'crypto-action'
const el = {
  action: document.getElementById('action'),
  password: document.getElementById('password'),
  input: document.getElementById('input'),
  output: document.getElementById('output'),
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

// Encrypt/Decrypt on writing
el.input.addEventListener('input', () => {
  const content = el.input.value
  el.error.innerText = ''
  if (content === '') return

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
})

// Set the output as read only. "readonly" attribute hides the text cursor
el.output.addEventListener('keypress', e => e.preventDefault())
