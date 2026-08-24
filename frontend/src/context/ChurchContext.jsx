import { createContext, useContext } from 'react'
import { useApi } from '../hooks/useApi'
import { fetchChurch } from '../api/services'

const ChurchContext = createContext({ church: null, loading: true, error: null })

export function ChurchProvider({ children }) {
  const { data, loading, error } = useApi('/church/')
  return (
    <ChurchContext.Provider value={{ church: data, loading, error }}>
      {children}
    </ChurchContext.Provider>
  )
}

export function useChurch() {
  return useContext(ChurchContext)
}
