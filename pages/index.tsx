import type { NextPage } from 'next'
import Head from 'next/head'
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
    <div className="mx-auto px-5 md:px-8 md:max-w-screen-lg">
      <Head>
        <title>1RM Calculator</title>
        <meta name="description" content="A simple website to calculate 1RM." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="my-12 md:my-16">
        <h1 className="font-bold text-2xl md:text-4xl">1RM Calculator</h1>
      </header>
      <main className="mb-12 md:mb-16 min-h-screen flex flex-col">
        <form onSubmit={handleSubmit} className="p-8 border rounded-xl">
          <div className="mb-8">
            <div className="mb-4">
              <label htmlFor="weight" className="font-bold text-xl md:text-2xl">
                Weight Lifted
              </label>
            </div>
            <div className="mb-4">
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
                className="p-4 w-full border rounded"
              />
            </div>
            <p id="condition-of-weight-value" className="mx-4">
              {isValidWeightValue(weight) ? (
                <span className="font-bold text-emerald-700">ok</span>
              ) : (
                <>Weight must be greater than or equal to 1 and less than or equal to 2000 (1 &le; w &le; 2000).</>
              )}
            </p>
          </div>
          <div className="mb-8">
            <div className="mb-4">
              <label htmlFor="reps" className="font-bold text-xl md:text-2xl">
                Reps Performed
              </label>
            </div>
            <div className="mb-4">
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
                className="p-4 w-full border rounded"
              />
            </div>
            <p id="condition-of-reps-value" className="mx-4">
              {isValidRepsValue(reps) ? (
                <span className="font-bold text-emerald-700">ok</span>
              ) : (
                <>Reps must be greater than or equal to 1 and less than or equal to 12 (1 &le; r &le; 12).</>
              )}
            </p>
          </div>
          <div>
            <button
              id="calculate-button"
              type="submit"
              disabled={!isButtonClickable ? true : false}
              aria-label="Calculate button. Click this button to see the 1RM value and the weight at each percentage of 1RM."
              className="py-3 px-4 font-bold text-white bg-black rounded hover:opacity-60 disabled:bg-gray-500"
            >
              Calculate
            </button>
            {!isButtonClickable ? <p className="mt-4">Calculating...</p> : <></>}
          </div>
        </form>
        <hr className="my-16 md:my-20" />
        <h2 className="mb-12 md:mb-16 font-bold text-2xl md:text-3xl">
          Your 1RM:<span className="ml-4">{isSubmitSuccess ? oneRepMax : '?'}</span>
        </h2>
        <div className="p-4 md:p-8 text-center border rounded-xl">
          <h3 className="mb-8 font-bold text-xl md:text-2xl">Weights at each percentage of 1RM</h3>
          <table className="mx-auto px-4 w-full md:text-lg border">
            <thead className="md:text-xl border-b">
              <tr>
                <th className="py-4 px-2 w-1/2">Percentage of 1RM</th>
                <th className="px-2">Weight</th>
              </tr>
            </thead>
            <tbody>
              {isSubmitSuccess ? (
                weights.map((weight, index) => {
                  return (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-2 w-1/2">{weight.percentage}%</td>
                      <td className="px-2">{weight.weight}</td>
                    </tr>
                  )
                })
              ) : (
                <tr className="border-b">
                  <td className="py-4 px-2 w-1/2">...</td>
                  <td className="px-2">...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="py-4 flex justify-center border-t">&copy; 2022 Hiroki Takeshita</footer>
    </div>
  )
}

export default Home
