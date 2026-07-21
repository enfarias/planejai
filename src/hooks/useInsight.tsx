import { useCallback, useEffect, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import { getInsight, type InsightData } from '@/services/aiService'

import { useSimulationStorage } from './useSimulationStorage'

export const useInsight = (id: string) => {
  const [insight, setInsight] = useState<InsightData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { getFormData } = useSimulationStorage()

  // Necessário o uso do useCallback pois temos que colocar essa função
  // Como array de dependências do useEffect
  const fetchInsight = useCallback(async () => {
    if (!id) return

    // Garantimos o estado de loading antes da chamada assíncrona
    setIsLoading(true)
    setError(null)

    try {
      const simulation = getFormData(id)

      if (!simulation) {
        setError('Simulação não encontrada.')
        setIsLoading(false)
        return
      }

      const prompt = buildAIPrompt(simulation)
      const data = await getInsight(prompt)
      setInsight(data)
    } catch {
      setError('Erro ao gerar o diagnóstico. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }, [id, getFormData])

  useEffect(() => {
    // Guard de parada simples sem dependências reativas de estado interno
    if (!id || insight) {
      return
    }

    // flag para evitar atualização de estado se o componente for desmontado
    let isMounted = true

    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const simulation = getFormData(id)

        if (!simulation) {
          if (isMounted) setError('Simulação não encontrada.')
          return
        }

        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)

        if (isMounted) {
          setInsight(data)
        }
      } catch {
        if (isMounted) {
          setError('Erro ao gerar o diagnóstico. Tente novamente.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      isMounted = false
    }
  }, [id, getFormData, insight])

  return { insight, isLoading, error, refetch: fetchInsight }
}
