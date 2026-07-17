import { simulationFormSteps } from '@/data/simulation'

import { FormStep } from './FormStep'
import { StepProgress } from './Progress'

export const SimulationForm = () => {
  const currentStep = simulationFormSteps[5]

  return (
    <>
      <StepProgress currentStep={6} totalSteps={10} />
      <FormStep key={currentStep.id} {...currentStep} />
    </>
  )
}
