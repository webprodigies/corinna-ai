import { onAiChatBotAssistant, onGetCurrentChatBot } from '@/actions/bot'
import { postToParent, pusherClient } from '@/lib/utils'
import {
  ChatBotMessageProps,
  ChatBotMessageSchema,
} from '@/schemas/conversation.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { UploadClient } from '@uploadcare/upload-client'

import { useForm } from 'react-hook-form'

const upload = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
})

export const useChatBot = () => {

  const { register, handleSubmit, reset } = useForm<ChatBotMessageProps>({
    resolver: zodResolver(ChatBotMessageSchema),
  })
  const [currentBot, setCurrentBot] = useState<
    | {
        name: string
        chatBot: {
          id: string
          icon: string | null
          welcomeMessage: string | null
          background: string | null
          textColor: string | null
          helpdesk: boolean
        } | null
        helpdesk: {
          id: string
          question: string
          answer: string
          domainId: string | null
        }[]
      }
    | undefined
  >()
  const messageWindowRef = useRef<HTMLDivElement | null>(null)
  const [botOpened, setBotOpened] = useState<boolean>(false)
  const onOpenChatBot = () => setBotOpened((prev) => !prev)
  const [loading, setLoading] = useState<boolean>(true)
  const [onChats, setOnChats] = useState<
    { role: 'assistant' | 'user'; content: string; link?: string }[]
  >([])
  const [onAiTyping, setOnAiTyping] = useState<boolean>(false)
  const [currentBotId, setCurrentBotId] = useState<string>()
  const [onRealTime, setOnRealTime] = useState<
    { chatroom: string; mode: boolean } | undefined
  >(undefined)

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    onScrollToBottom()
  }, [onChats, messageWindowRef])

  useEffect(() => {
    postToParent(
      JSON.stringify({
        width: botOpened ? 550 : 80,
        height: botOpened ? 800 : 80,
      })
    )
  }, [botOpened])

  let limitRequest = 0

  const onGetDomainChatBot = async (id: string) => {
    setCurrentBotId(id)
    const chatbot = await onGetCurrentChatBot(id)
    if (chatbot) {
      setOnChats((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: chatbot.chatBot?.welcomeMessage!,
        },
      ])
      setCurrentBot(chatbot)
      setLoading(false)
    }
  }

  useEffect(() => {
    window.addEventListener('message', (e) => {
      console.log(e.data)
      const botid = e.data
      if (limitRequest < 1 && typeof botid == 'string') {
        onGetDomainChatBot(botid)
        limitRequest++
      }
    })
  }, [])

  const onStartChatting = handleSubmit(async (values) => {
    reset()
    if (values.image.length) {
      const uploaded = await upload.uploadFile(values.image[0])
      setOnChats((prev: any) => [
        ...prev,
        {
          role: 'user',
          content: uploaded.uuid,
        },
      ])
      setOnAiTyping(true)
      const response = await onAiChatBotAssistant(
        currentBotId!,
        onChats,
        'user',
        uploaded.uuid
      )

      if (response) {
        setOnAiTyping(false)
        if (response.live) {
          setOnRealTime((prev) => ({
            ...prev,
            chatroom: response.chatRoom,
            mode: response.live,
          }))
        } else {
          setOnChats((prev: any) => [...prev, response.response])
        }
      }
    }

    if (values.content) {
      setOnChats((prev: any) => [
        ...prev,
        {
          role: 'user',
          content: values.content,
        },
      ])
      setOnAiTyping(true)

      const response = await onAiChatBotAssistant(
        currentBotId!,
        onChats,
        'user',
        values.content
      )

      if (response) {
        setOnAiTyping(false)
        if (response.live) {
          setOnRealTime((prev) => ({
            ...prev,
            chatroom: response.chatRoom,
            mode: response.live,
          }))
        } else {
          setOnChats((prev: any) => [...prev, response.response])
        }
      }
    }
  })

  return {
    botOpened,
    onOpenChatBot,
    onStartChatting,
    onChats,
    register,
    onAiTyping,
    messageWindowRef,
    currentBot,
    loading,
    setOnChats,
    onRealTime,
  }
}

export const useRealTime = (
  chatRoom: string,
  setChats: React.Dispatch<
    React.SetStateAction<
      {
        role: 'user' | 'assistant'
        content: string
        link?: string | undefined
      }[]
    >
  >
) => {
  useEffect(() => {
    pusherClient.subscribe(chatRoom)
    pusherClient.bind('realtime-mode', (data: any) => {
      setChats((prev: any) => [
        ...prev,
        {
          role: data.chat.role,
          content: data.chat.message,
        },
      ])
    })
    return () => pusherClient.unsubscribe('realtime-mode')
  }, [])
}
