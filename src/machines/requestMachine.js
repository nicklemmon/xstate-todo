import { Machine, assign } from 'xstate'
import axios from 'axios'
import { API_BASE_URL } from 'src/constants'

// Based on: https://codesandbox.io/s/82v7625nn8

const customAxios = axios.create({
  baseUrl: API_BASE_URL,
  headers: {
    'X-Parse-Application-Id': process.env.REACT_APP_APPLICATION_ID,
    'X-Parse-JavaScript-Key': process.env.REACT_APP_JAVASCRIPT_API_KEY,
  },
})

export const requestMachine = Machine(
  {
    id: 'fetch',
    initial: 'idle',
    context: {
      url: '',
      data: undefined,
      error: undefined,
    },
    states: {
      idle: {
        on: {
          FETCH: 'loading',
        },
      },
      loading: {
        invoke: {
          src: '$fetch',
          onDone: {
            target: 'success',
            actions: ['@setData'],
          },
          onError: {
            target: 'failure',
            actions: ['@setError'],
          },
        },
      },
      success: {
        type: 'final',
      },
      failure: {
        on: {
          RETRY: 'loading',
        },
      },
    },
  },
  {
    actions: {
      '@setData': assign((_ctx, event) => {
        return {
          data: event.data,
        }
      }),
      '@setError': assign((_ctx, event) => {
        return {
          error: event.error,
        }
      }),
    },
    services: {
      $fetch: (ctx, event = {}) => {
        return customAxios({
          method: ctx.method,
          url: `${API_BASE_URL}/${ctx.url}`,
          params: event.params,
          data: event.data,
          headers: {
            ...ctx.headers,
            ...event.headers,
          },
        })
          .then(({ data: { results } }) => results)
          .then(err => err)
      },
    },
  },
)
