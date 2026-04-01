import { Link, useNavigate, useParams } from 'react-router-dom'
import { useBugs } from '../context/BugContext'
import BugForm from '../components/BugForm'
import './FormPage.css'

export default function EditBug() {
  const { id } = useParams()
  const { bugs, updateBug } = useBugs()
  const navigate = useNavigate()

  const bug = bugs.find(b => b.id === id)

  if (!bug) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state" data-cy="bug-not-found">
            <div className="empty-icon">⚠️</div>
            <h3>Bug not found</h3>
            <Link to="/bugs" className="btn btn-ghost mt-16">← Back to list</Link>
          </div>
        </div>
      </div>
    )
  }

  function handleSubmit(values) {
    updateBug({ ...values, id: bug.id })
    navigate(`/bugs/${bug.id}`)
  }

  return (
    <div className="page">
      <div className="container">

        {/* Breadcrumb */}
        <div className="breadcrumb fade-in" data-cy="breadcrumb">
          <Link to="/bugs" className="breadcrumb-link">All Bugs</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to={`/bugs/${bug.id}`} className="breadcrumb-link">#{bug.id}</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Edit</span>
        </div>

        {/* Header */}
        <div className="form-page-header fade-in">
          <div>
            <h1>Edit Bug <span className="form-page-id">#{bug.id}</span></h1>
            <p className="text-secondary mt-4">Update the details for this bug report.</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card fade-in" data-cy="edit-bug-page">
          <BugForm
            initialValues={bug}
            onSubmit={handleSubmit}
            submitLabel="💾 Save Changes"
            isEdit
          />
        </div>

      </div>
    </div>
  )
}
