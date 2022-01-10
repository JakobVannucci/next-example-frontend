import { AxiosError } from 'axios'
import { FORM_ERROR } from 'final-form'

const formError = (err: AxiosError) => {
  const status = err?.response?.status

  if (status === 422) {
    return {
      ...err.response.data.errors,
      [FORM_ERROR]: err.response.data.message,
    }
  }

  if (status) {
    return {
      [FORM_ERROR]: err.response.data.message,
    }
  }
}

export default formError
