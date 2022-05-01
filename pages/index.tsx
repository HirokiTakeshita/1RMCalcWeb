import type { NextPage } from 'next'
import { useState, FormEvent } from 'react'

interface SubmitData {
  weight: number
  reps: number
}

interface SuccessData {
  one_rep_max: number
  weights: [
    {
      percentage: number
      weight: number
    }
  ]
}

interface ErrorData {
  detail: [
    {
      loc: []
      msg: string
      type: string
      ctx: {}
    }
  ]
}

const Home: NextPage = () => {
  const [isButtonClickable, setIsButtonClickable] = useState(true)
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [oneRepMax, setOneRepMax] = useState(0)
  const [weights, setWeights] = useState([{ percentage: 0, weight: 0 }])
  const [weight, setWeight] = useState(0)
  const [reps, setReps] = useState(0)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submitData: SubmitData = { weight: weight, reps: reps }
    fetchData(submitData)
  }

  const fetchData = async (submitData: SubmitData) => {
    setIsButtonClickable(false)
    const response = await fetch('https://one-rep-max-calc-api.herokuapp.com/api/v1/calc_1rm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData),
    })
    setIsButtonClickable(true)
    if (!response.ok) {
      const data: ErrorData = await response.json()
      alert(data.detail[0].msg)
      return
    }
    setIsSubmitSuccess(true)
    const data: SuccessData = await response.json()
    setOneRepMax(data.one_rep_max)
    setWeights(data.weights)
  }

  const isValidWeightValue = (weight: number) => {
    return 1 <= weight && weight <= 2000 ? true : false
  }

  const isValidRepsValue = (reps: number) => {
    return 1 <= reps && reps <= 12 ? true : false
  }

  return (
    <div>
      <h1>1RM Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="weight">Weight Lifted</label>
        <input
          required
          id="weight"
          name="weight"
          type="number"
          min="1"
          max="2000"
          step="0.1"
          enterKeyHint="next"
          aria-describedby="condition-of-weight-value"
          onChange={(e) => setWeight(e.target.valueAsNumber)}
        />
        <p id="condition-of-weight-value">
          {isValidWeightValue(weight) ? (
            'ok'
          ) : (
            <>Weight must be greater than or equal to 1 and less than or equal to 2000 (1 &le; w &le; 2000).</>
          )}
        </p>
        <label htmlFor="reps">Reps Performed</label>
        <input
          required
          id="reps"
          name="reps"
          type="number"
          min="1"
          max="12"
          enterKeyHint="send"
          aria-describedby="condition-of-reps-value"
          onChange={(e) => setReps(e.target.valueAsNumber)}
        />
        <p id="condition-of-reps-value">
          {isValidRepsValue(reps) ? (
            'ok'
          ) : (
            <>Reps must be greater than or equal to 1 and less than or equal to 12 (1 &le; r &le; 12).</>
          )}
        </p>
        <button
          id="calculate-button"
          type="submit"
          disabled={!isButtonClickable ? true : false}
          aria-label="Calculate button. Click this button to see the 1RM value and the weight at each percentage of 1RM."
        >
          Calculate
        </button>
      </form>

      <br />
      <hr />
      <br />

      <h2>
        Your 1RM: <span>{isSubmitSuccess ? oneRepMax : '?'}</span>
      </h2>
      <h2>Weights at each percentage of 1RM:</h2>
      {isSubmitSuccess ? (
        weights.map((weight, index) => {
          return (
            <ul key={index}>
              <li>
                {weight.percentage}%: {weight.weight}
              </li>
            </ul>
          )
        })
      ) : (
        <></>
      )}
    </div>
  )
}

export default Home
