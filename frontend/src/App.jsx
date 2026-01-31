import { useState } from 'react'
import './index.css'

const CATEGORIES = [
  "Books",
  "Charity",
  "Clothes",
  "Digital Services",
  "Dining Out",
  "Dry Cleaning",
  "Fun",
  "Groceries",
  "Haircut",
  "Health/Med",
  "Laundry Card",
  "Metrocard",
  "Random",
  "Rent",
  "Supplies",
  "Travel",
  "Uber/Cabs",
]

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
      const apiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
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
      setError(`Error connecting to backend: ${err.message}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadCSV = () => {
    if (!result || !result.items) return

    // Define headers
    const headers = ['Date', 'Category', 'Amount', 'Description']

    // Convert items to CSV rows
    // We escape quotes in descriptions if necessary
    const rows = result.items.map(item => [
      item.date,
      item.category,
      item.cost,
      // escape double quotes and wrap in quotes to handle commas in description
      `"${item.desc.replace(/"/g, '""')}"`
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n')

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'budget_results.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCategoryChange = (index, newCategory) => {
    const newItems = result.items.map((item, i) =>
      i === index ? { ...item, category: newCategory } : item
    )
    setResult({ ...result, items: newItems })
  }

  const handleClear = () => {
    setText('')
    setResult(null)
    setError(null)
  }

  return (
    <div className="container">
      <h1>Budget Classifier</h1>
      <p className="subtitle">AI-powered expense categorization</p>

      <div className="card">
        <div className="input-group">
          <textarea
            placeholder="Enter one or more budget entries like: '- 1/19 $21.27 groceries'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={handleClassify}
            disabled={loading || !text.trim()}
          >
            {loading ? 'Classifying...' : 'Classify Entries'}
          </button>
        </div>

        {error && <p style={{ color: '#ef4444' }}>{error}</p>}

        {result && result.items && (
          <div className="result-area">
            <div className="results-header">
              <span className="category-badge">Categorized Results</span>
              <button className="download-btn" onClick={handleDownloadCSV}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
                Download CSV
              </button>
            </div>
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
                      <td className="td-date" data-label="Date">{item.date}</td>
                      <td className="td-category" data-label="Category">
                        <select
                          className="category-tag"
                          value={item.category}
                          onChange={(e) => handleCategoryChange(index, e.target.value)}
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </td>
                      <td className={`td-cost ${item.cost < 0 ? 'cost-highlight' : ''}`} data-label="Amount">
                        {item.cost < 0 ? '+' : ''}${Math.abs(item.cost).toFixed(2)}
                      </td>
                      <td className="td-desc" data-label="Description">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="result-footer">
              <button className="clear-btn" onClick={handleClear}>
                Clear Entries
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
