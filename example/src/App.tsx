import React from 'react'
import FloatingWhatsApp from 'react-floating-whatsapp'
import './App.css'
import avatar from './logo.svg'

const allowUrls = [
  "/"
]

function App() {
  return (
    <FloatingWhatsApp
      phoneNumber='+6281312117711'
      accountName='Customer Services'
      allowClickAway
      avatar={avatar}
      allowInUrls={allowUrls}
      notification
      notificationSound
      notificationDelay={30000}
      // darkMode
    />
  )
}

export default App
