import { Link, useNavigate } from 'react-router-dom'
import { useBugs } from '../context/BugContext'
import BugForm from '../components/BugForm'
import './FormPage.css'

export default function NewBug() {
  const { addBug } = useBugs()
  const navigate = useNavigate()

  function handleSubmit(values) {
    addBug(values)
    navigate('/bugs')
  }

  return (
    <div className="page">
      <div className="container">

        {/* Breadcrumb */}
        <div className="breadcrumb fade-in" data-cy="breadcrumb">
          <Link to="/bugs" className="breadcrumb-link">All Bugs</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">New Bug</span>
        </div>

        {/* Header */}
        <div className="form-page-header fade-in">
          <div>
            <h1>Report a Bug</h1>
            <p className="text-secondary mt-4">
              Document the issue clearly so it can be triaged and resolved quickly.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card fade-in" data-cy="new-bug-page">
          <BugForm
            onSubmit={handleSubmit}
            submitLabel="🐛 Submit Bug"
          />
        </div>

      </div>
    </div>
  )
}
