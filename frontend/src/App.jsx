import { useState } from 'react'
import './index.css'

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleClassify = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Use environment variable for API URL, fallback to localhost for safety
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to classify text')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Budget Classifier</h1>
      <p className="subtitle">AI-powered expense categorization</p>

      <div className="card">
        <div className="input-group">
          <textarea
            placeholder="Enter budget entry (e.g., 'Groceries at Walmart $50')"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={handleClassify}
            disabled={loading || !text.trim()}
          >
            {loading ? 'Classifying...' : 'Classify Entry'}
          </button>
        </div>

        {error && <p style={{ color: '#ef4444' }}>{error}</p>}

        {result && result.items && (
          <div className="result-area">
            <span className="category-badge">Categorized Results</span>
            <div className="expense-table-container">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item, index) => (
                    <tr key={index}>
                      <td className="td-date">{item.date}</td>
                      <td className="td-category">
                        <span className="category-tag">{item.category}</span>
                      </td>
                      <td className={`td-cost ${item.cost < 0 ? 'cost-highlight' : ''}`}>
                        {item.cost < 0 ? '+' : ''}${Math.abs(item.cost).toFixed(2)}
                      </td>
                      <td>{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
