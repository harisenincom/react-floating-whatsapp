import React, { useReducer, useEffect, useCallback, useRef, useMemo } from 'react'
import { WhatsappSVG, CloseSVG, CheckSVG, SendSVG } from './Icons'
import css from '../styles.module.scss'

import darkBG from './assets/bg-chat-tile-light.png'
import lightBG from './assets/bg-chat-tile-dark.png'
import dummyAvatar from './assets/logo.svg'
import SoundBeep from './assets/whatsapp-notification.mp3'

interface FloatingWhatsAppProps {
  phoneNumber: string
  accountName: string
  height?: number
  avatar?: string
  statusMessage?: string
  chatMessage?: string
  darkMode?: boolean
  allowClickAway?: boolean
  allowEsc?: boolean
  allowInUrls?: Array<any>
  styles?: React.CSSProperties
  className?: string
  placeholder?: string
  notification?: boolean
  notificationDelay?: number
  notificationSound?: boolean
}

type State = {
  isOpen: boolean
  isDelay: boolean
  isHide: boolean
  isNotification: boolean
  message: string
}

type Action =
  | { type: 'open' }
  | { type: 'close' }
  | { type: 'hide' }
  | { type: 'delay' }
  | { type: 'notification' }
  | { type: 'message'; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        isOpen: true,
        isNotification: false
      }
    case 'close':
      return {
        ...state,
        isOpen: false
      }

    case 'hide':
      return {
        ...state,
        isHide: true
      }

    case 'delay':
      return {
        ...state,
        isDelay: false
      }
    case 'notification':
      return {
        ...state,
        isNotification: true
      }
    case 'message':
      return {
        ...state,
        message: action.payload
      }
    default:
      return state
  }
}

const isArabic = (string: string) => /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(string)

export default function FloatingWhatsApp({
                                           phoneNumber = '6285311011013',
                                           accountName = 'Customer Services',
                                           height = 400,
                                           avatar = dummyAvatar,
                                           statusMessage = 'Typically replies instantly',
                                           chatMessage = 'Selamat datang, Risers! 🤝 \n\nYuk tanya - tanya tentang produk harisenin.com',
                                           darkMode = false,
                                           allowClickAway = false,
                                           allowEsc = false,
                                           allowInUrls = [],
                                           styles = {},
                                           className = 'custom-class',
                                           placeholder = 'Type a message..',
                                           notification = false,
                                           notificationDelay = 180000, // 3 minutes
                                           notificationSound = false
                                         }: FloatingWhatsAppProps) {
  const [{ isOpen, isDelay, isHide, isNotification, message }, dispatch] = useReducer(reducer, {
    isOpen: false,
    isHide: false,
    isDelay: true,
    isNotification: false,
    message: ''
  })

  if (notificationDelay < 30000) throw new Error('notificationDelay prop value must be at least 30 seconds (30000 ms)')

  const soundRef = useRef<HTMLAudioElement | null>(null)
  const notificationInterval = useRef(0)
  const time = useMemo(() => new Date().toTimeString().split(`:`).slice(0, 2).join(`:`), [])

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    if (isOpen) return

    dispatch({ type: 'open' })

    setTimeout(() => dispatch({ type: 'delay' }), 2000)

    window.clearInterval(notificationInterval.current)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'message', payload: event.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message) return

    window.open(`https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${message}`)
    dispatch({ type: 'message', payload: '' })
  }

  const onNotification = useCallback(() => {
    if (!notification) return

    notificationInterval.current = window.setInterval(() => {
      if (notificationSound) {
        if (soundRef.current) {
          soundRef.current.currentTime = 0
          soundRef.current.play()
        }
      }
      dispatch({ type: 'notification' })
    }, notificationDelay)
  }, [notification, notificationDelay, notificationSound])

  const onClickOutside = useCallback(() => {
    if (!allowClickAway || !isOpen) return

    dispatch({ type: 'close' })
  }, [allowClickAway, isOpen])

  const onEscKey = useCallback(
    (event: KeyboardEvent) => {
      if (!allowEsc || !isOpen) return

      if (event.key === 'Escape') dispatch({ type: 'close' })
    },
    [allowEsc, isOpen]
  )

  const onLoad = useCallback(() => {
    if (!isHide && allowInUrls.length === 0) return
    if (!allowInUrls.includes(window.location.pathname)) dispatch({ type: 'hide' })
  }, [allowInUrls, isHide])

  // useEffect(() => {
  //   onLoad()
  // }, [onLoad])

  useEffect(() => {
    onNotification()
  }, [onNotification])

  useEffect(() => {
    document.addEventListener('click', onClickOutside, false)

    return () => document.removeEventListener('click', onClickOutside)
  }, [onClickOutside])

  useEffect(() => {
    document.addEventListener('keydown', onEscKey, false)

    return () => document.removeEventListener('keydown', onEscKey)
  }, [onEscKey])

  return !isHide ? (
    <div className={`${css.floatingWhatsapp} ${darkMode ? `${css.dark} ` : ''}${className}`} onLoad={onLoad}>
      <div className={css.whatsappButton} onClick={(event) => handleOpen(event)} style={styles} aria-hidden='true'>
        <WhatsappSVG />
        {isNotification && <span className={css.notificationIndicator}>1</span>}
      </div>
      <div
        className={`${css.whatsappChatBox} ${isOpen ? css.open : css.close}`}
        onClick={(event) => event.stopPropagation()}
        aria-hidden='true'
        style={{ height: isOpen ? height : 0 }}
      >
        <header className={css.chatHeader}>
          <div className={css.avatar}>
            <img src={avatar} width='60' height='60' alt='whatsapp-avatar' />
          </div>
          <div className={css.status}>
            <span className={css.statusTitle}>{accountName}</span>
            <span className={css.statusSubtitle}>{statusMessage}</span>
          </div>
          <div className={css.close} onClick={() => dispatch({ type: 'close' })} aria-hidden='true'>
            <CloseSVG />
          </div>
        </header>

        <div className={css.chatBody} style={{ backgroundImage: `url(${darkMode ? darkBG : lightBG})` }}>
          {isDelay ? (
            <div className={css.chatBubble}>
              <div className={css.typing}>
                <div className={css.dot} />
                <div className={css.dot} />
                <div className={css.dot} />
              </div>
            </div>
          ) : (
            <div className={css.message}>
              <span className={css.triangle} />
              <span className={css.accountName}>{accountName}</span>
              <p className={css.messageBody}>{chatMessage}</p>
              <span className={css.messageTime}>
                {time}
                <span style={{ marginLeft: 5 }}>
                  <CheckSVG />
                </span>
              </span>
            </div>
          )}
        </div>

        <footer className={css.chatFooter}>
          <form onSubmit={handleSubmit}>
            <input
              className={`${css.input} ${isArabic(message) ? css.arabic : ''}`}
              placeholder={placeholder}
              onChange={handleChange}
              value={message}
              dir='auto'
            />
            <button type='submit' className={css.buttonSend} disabled={message === ''}>
              <SendSVG />
            </button>
          </form>
        </footer>
      </div>
      {notificationSound && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio ref={soundRef} hidden src={SoundBeep} />
      )}
    </div>
  ) : <></>

}
