document.querySelector('#submit').addEventListener('click', async () => {
  const name = document.querySelector('#name').value
  const password = document.querySelector('#password').value
  const save = document.querySelector('#save').value

  if (save == 'on') {
    localStorage.setItem('name', name)
    localStorage.setItem('password', password)
  } else {
    localStorage.removeItem('name')
    localStorage.removeItem('password')
  }

  if (!name || !password) return

  document.querySelector('#response').innerHTML = 'Waiting for itslearning...'
  if ((await preload.checkLoginToItslearning(name, password)) != 'Success') {
    return (document.querySelector('#response').innerHTML =
      '<a color="red">Error occurred!</a>')
  }

  const arr = await preload.getTasksFromItslearning(name, password)
  document.querySelector('#response').innerHTML = '<br>Tasks:<br>'
  arr.forEach((el) => {
    const btn = document.createElement('button')
    btn.setAttribute('onclick', `preload.openInBrowser('${el[0]}')`)
    btn.innerHTML = el[1]
    btn.style.margin = '0 0 10px 10px'
    document.querySelector('#response').appendChild(btn)
    document.querySelector('#response').innerHTML += '<br>'
  })
})

if (localStorage.getItem('name') && localStorage.getItem('password')) {
  document.querySelector('#name').value = localStorage.getItem('name')
  document.querySelector('#password').value = localStorage.getItem('password')

  document.querySelector('#submit').click()
}
