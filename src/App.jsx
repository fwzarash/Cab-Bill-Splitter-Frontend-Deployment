/* 1. design web page 2. set up framework components - states in field inputs, useEffect, etc. */

import './App.css'
import { useState, useEffect, useRef } from 'react'

export default function App() {
  // State
  const [activeTab, setActiveTab] = useState('calculate')
  const [fare, setFare] = useState('24.50')
  const [tolls, setTolls] = useState('0.00')
  const [tip, setTip] = useState(2)
  const [riders, setRiders] = useState(1)
  const [rideType, setRideType] = useState('Grab 4 Seater')
  const [isCopied, setIsCopied] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  // Options
  const tipOptions = [0, 2, 3, 5]
  const rideTypes = ['Grab Meter', 'Grab 4 Seater', 'Grab 6 Seater', 'Grab Premium']


  const fareInputRef = useRef(null)

  // Calc
  const baseFare = parseFloat(fare) || 0
  const tollFee = parseFloat(tolls) || 0
  const total = baseFare + tollFee + tip
  const sharePerPerson = riders > 0 ? total / riders : 0

  // Set focus on render
  useEffect(() => {
    fareInputRef.current?.focus()
  }, [])

  // Placeholder text for sharing
  const shareText = 
`🚗 ${rideType} Ride Split:
------------------------
• Fare: $${baseFare.toFixed(2)}
• Tolls/ERP: $${tollFee.toFixed(2)}
• Tip: $${tip.toFixed(2)}
------------------------
Total: $${total.toFixed(2)} across ${riders} pax
👉 Your share: $${sharePerPerson.toFixed(2)}`

  // Use async for external APIs/Services like clipboard - wait for the status of the operation to complete before proceeding
  const handleCopy = async () => {
    setIsCopying(true)

    try {
      await navigator.clipboard.writeText(shareText)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="page">
      <main className="card-container">
        {/* Header */}
        <header className="header">
          <div className="logo-row">
            <span className="logo-icon">↗</span>
            <span className="logo-text">Cab Bill Splitter</span>
          </div>

          <nav className="nav-bar">
            <button
              type="button"
              className={`nav-button ${activeTab === 'calculate' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculate')}
            >
              Split
            </button>

            <button
              type="button"
              className={`nav-button ${activeTab === 'request' ? 'active' : ''}`}
              onClick={() => setActiveTab('request')}
            >
              Request
            </button>
          </nav>
        </header>

        {/* Calculation tab */}
        {activeTab === 'calculate' && (
          <div className="card">
            <div className="type-grid">
              {rideTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setRideType(type)}
                  className={`type-button ${rideType === type ? 'active' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="hero-section">
              <div className="subtext">Each person owes</div>
              <div className="price-row">
                <span className="currency-symbol">$</span>
                <span className="hero-amount">{sharePerPerson.toFixed(2)}</span>
              </div>
              <div className="total-pill-row">
                <span className="active-dot"></span>
                Split across {riders} pax (total ${total.toFixed(2)})
              </div>
            </div>

            <div className="input-stack">
              <div className="input-row">
                <span className="label">Trip Fare</span>
                <div className="input-wrapper">
                  <span className="prefix">$</span>
                  <input
                    ref={fareInputRef}
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="numeric-input"
                    value={fare}
                    onChange={(e) => setFare(e.target.value)}
                  />
                </div>
              </div>

              {/* Tolls / ERP */}
              <div className="input-row">
                <span className="label">Tolls / ERP</span>
                <div className="input-wrapper">
                  <span className="prefix">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="numeric-input"
                    value={tolls}
                    onChange={(e) => setTolls(e.target.value)}
                  />
                </div>
              </div>

              {/* Passenger Stepper */}
              <div className="input-row">
                <div>
                  <span className="label">Total Pax</span>
                  <span className="field-hint">Number of riders</span>
                </div>
                <div className="stepper-container">
                  <button
                    type="button"
                    className="stepper-button"
                    onClick={() => setRiders(Math.max(1, riders - 1))}
                  >
                    −
                  </button>
                  <span className="stepper-value">{riders}</span>
                  <button
                    type="button"
                    className="stepper-button"
                    onClick={() => setRiders(Math.min(8, riders + 1))}
                  >
                    +
                  </button>
                </div>
              </div>


              {/* Driver tip */}
              <div className="tip-section">
                <div className="tip-header">
                  <span className="label">Driver Tip</span>
                  <span className="field-hint">Optional</span>
                </div>
                <div className="tip-grid">
                  {tipOptions.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTip(amount)}
                      className={`tip-pill ${tip === amount ? 'active' : ''}`}
                    >
                      {amount === 0 ? 'None' : `+$${amount}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={total <= 0}
              className="primary-button"
              onClick={() => setActiveTab('request')}
            >
              Review & Request Payment →
            </button>
          </div>
        )}

        {/* Payment request tab */}
        {activeTab === 'request' && (
          <div className="card">
            <div className="request-header">
              <div className="check-circle">✓</div>
              <h2 className="request-title text-black">Payment Request Ready</h2>
              <p className="field-hint">
                Generated for {riders} pax · {rideType}
              </p>
            </div>

            <pre className="message-box">{shareText}</pre>

            <div className="action-stack">
              <button
                type="button"
                onClick={handleCopy}
                disabled={isCopying}
                className="copy-button"
              >
                {isCopying ? 'Copying...' : isCopied ? 'Copied!' : 'Copy to Clipboard'}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('calculate')}
                className="back-button"
              >
                Back to Calculator
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}