import {
  onChatBotImageUpdate,
  onCreateFilterQuestions,
  onCreateHelpDeskQuestion,
  onCreateNewDomainProduct,
  onDeleteUserDomain,
  onGetAllFilterQuestions,
  onGetAllHelpDeskQuestions,
  onUpdateDomain,
  onUpdatePassword,
  onUpdateWelcomeMessage,
} from '@/actions/settings'
import { useToast } from '@/components/ui/use-toast'
import {
  ChangePasswordProps,
  ChangePasswordSchema,
} from '@/schemas/auth.schema'
import {
  AddProductProps,
  AddProductSchema,
  DomainSettingsProps,
  DomainSettingsSchema,
  FilterQuestionsProps,
  FilterQuestionsSchema,
  HelpDeskQuestionsProps,
  HelpDeskQuestionsSchema,
} from '@/schemas/settings.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadClient } from '@uploadcare/upload-client'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const upload = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY as string,
})

export const useThemeMode = () => {
  const { setTheme, theme } = useTheme()
  return {
    setTheme,
    theme,
  }
}

export const useChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordProps>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: 'onChange',
  })
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  const onChangePassword = handleSubmit(async (values) => {
    try {
      setLoading(true)
      const updated = await onUpdatePassword(values.password)
      if (updated) {
        reset()
        setLoading(false)
        toast({ title: 'Success', description: updated.message })
      }
    } catch (error) {
      console.log(error)
    }
  })
  return {
    register,
    errors,
    onChangePassword,
    loading,
  }
}

export const useSettings = (id: string) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DomainSettingsProps>({
    resolver: zodResolver(DomainSettingsSchema),
  })
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  const onUpdateSettings = handleSubmit(async (values) => {
    setLoading(true)
    if (values.domain) {
      const domain = await onUpdateDomain(id, values.domain)
      if (domain) {
        toast({
          title: 'Success',
          description: domain.message,
        })
      }
    }
    if (values.image[0]) {
      const uploaded = await upload.uploadFile(values.image[0])
      const image = await onChatBotImageUpdate(id, uploaded.uuid)
      if (image) {
        toast({
          title: image.status == 200 ? 'Success' : 'Error',
          description: image.message,
        })
        setLoading(false)
      }
    }
    if (values.welcomeMessage) {
      const message = await onUpdateWelcomeMessage(values.welcomeMessage, id)
      if (message) {
        toast({
          title: 'Success',
          description: message.message,
        })
      }
    }
    reset()
    router.refresh()
    setLoading(false)
  })

  const onDeleteDomain = async () => {
    setDeleting(true)
    const deleted = await onDeleteUserDomain(id)
    if (deleted) {
      toast({
        title: 'Success',
        description: deleted.message,
      })
      setDeleting(false)
      router.refresh()
    }
  }
  return {
    register,
    onUpdateSettings,
    errors,
    loading,
    onDeleteDomain,
    deleting,
  }
}

export const useHelpDesk = (id: string) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<HelpDeskQuestionsProps>({
    resolver: zodResolver(HelpDeskQuestionsSchema),
  })
  const { toast } = useToast()

  const [loading, setLoading] = useState<boolean>(false)
  const [isQuestions, setIsQuestions] = useState<
    { id: string; question: string; answer: string }[]
  >([])
  const onSubmitQuestion = handleSubmit(async (values) => {
    setLoading(true)
    const question = await onCreateHelpDeskQuestion(
      id,
      values.question,
      values.answer
    )
    if (question) {
      setIsQuestions(question.questions!)
      toast({
        title: question.status == 200 ? 'Success' : 'Error',
        description: question.message,
      })
      setLoading(false)
      reset()
    }
  })

  const onGetQuestions = async () => {
    setLoading(true)
    const questions = await onGetAllHelpDeskQuestions(id)
    if (questions) {
      setIsQuestions(questions.questions)
      setLoading(false)
    }
  }

  useEffect(() => {
    onGetQuestions()
  }, [])

  return {
    register,
    onSubmitQuestion,
    errors,
    isQuestions,
    loading,
  }
}

export const useFilterQuestions = (id: string) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FilterQuestionsProps>({
    resolver: zodResolver(FilterQuestionsSchema),
  })
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const [isQuestions, setIsQuestions] = useState<
    { id: string; question: string }[]
  >([])

  const onAddFilterQuestions = handleSubmit(async (values) => {
    setLoading(true)
    const questions = await onCreateFilterQuestions(id, values.question)
    if (questions) {
      setIsQuestions(questions.questions!)
      toast({
        title: questions.status == 200 ? 'Success' : 'Error',
        description: questions.message,
      })
      reset()
      setLoading(false)
    }
  })

  const onGetQuestions = async () => {
    setLoading(true)
    const questions = await onGetAllFilterQuestions(id)
    if (questions) {
      setIsQuestions(questions.questions)
      setLoading(false)
    }
  }

  useEffect(() => {
    onGetQuestions()
  }, [])

  return {
    loading,
    onAddFilterQuestions,
    register,
    errors,
    isQuestions,
  }
}

export const useProducts = (domainId: string) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<AddProductProps>({
    resolver: zodResolver(AddProductSchema),
  })

  const onCreateNewProduct = handleSubmit(async (values) => {
    try {
      setLoading(true)
      const uploaded = await upload.uploadFile(values.image[0])
      const product = await onCreateNewDomainProduct(
        domainId,
        values.name,
        uploaded.uuid,
        values.price
      )
      if (product) {
        reset()
        toast({
          title: 'Success',
          description: product.message,
        })
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  })

  return { onCreateNewProduct, register, errors, loading }
}
