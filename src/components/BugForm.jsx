import { useState } from 'react'
import './BugForm.css'

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
  environment: '',
  assignee: '',
}

// Validation rules
function validate(values) {
  const errors = {}
  if (!values.title.trim()) {
    errors.title = 'Title is required'
  } else if (values.title.trim().length < 10) {
    errors.title = 'Title must be at least 10 characters'
  } else if (values.title.trim().length > 120) {
    errors.title = 'Title must be 120 characters or fewer'
  }
  if (!values.description.trim()) {
    errors.description = 'Description is required'
  } else if (values.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters'
  }
  if (!values.status) errors.status = 'Status is required'
  if (!values.priority) errors.priority = 'Priority is required'
  return errors
}

export default function BugForm({ initialValues = EMPTY_FORM, onSubmit, submitLabel = 'Submit', isEdit = false }) {
  const [values, setValues]     = useState({ ...EMPTY_FORM, ...initialValues })
  const [errors, setErrors]     = useState({})
  const [touched, setTouched]   = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setValues(v => ({ ...v, [name]: value }))
    // Clear error once user starts fixing it
    if (errors[name]) {
      setErrors(e => ({ ...e, [name]: undefined }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    setTouched(t => ({ ...t, [name]: true }))
    const fieldErrors = validate(values)
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // Mark all fields as touched
    const allTouched = Object.keys(EMPTY_FORM).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)

    const validationErrors = validate(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    // Simulate async (e.g. API call)
    await new Promise(r => setTimeout(r, 300))
    onSubmit(values)
    setSubmitting(false)
  }

  const showError = (field) => touched[field] && errors[field]

  return (
    <form className="bug-form" onSubmit={handleSubmit} noValidate data-cy="bug-form">

      {/* Title */}
      <div className="form-group">
        <label className="form-label" htmlFor="title">
          Title <span className="required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`form-input ${showError('title') ? 'error' : ''}`}
          placeholder="Short, descriptive summary of the bug"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          data-cy="input-title"
          maxLength={120}
        />
        {showError('title') && (
          <span className="form-error" data-cy="error-title">⚠ {errors.title}</span>
        )}
        <span className="char-count text-xs text-muted">{values.title.length}/120</span>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          className={`form-textarea ${showError('description') ? 'error' : ''}`}
          placeholder="Steps to reproduce, expected vs actual behavior, environment details..."
          value={values.description}
          onChange={handleChange}
          onBlur={handleBlur}
          data-cy="input-description"
          rows={5}
        />
        {showError('description') && (
          <span className="form-error" data-cy="error-description">⚠ {errors.description}</span>
        )}
      </div>

      {/* Status + Priority row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="status">
            Status <span className="required">*</span>
          </label>
          <select
            id="status"
            name="status"
            className={`form-select ${showError('status') ? 'error' : ''}`}
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            data-cy="input-status"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          {showError('status') && (
            <span className="form-error" data-cy="error-status">⚠ {errors.status}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="priority">
            Priority <span className="required">*</span>
          </label>
          <select
            id="priority"
            name="priority"
            className={`form-select ${showError('priority') ? 'error' : ''}`}
            value={values.priority}
            onChange={handleChange}
            onBlur={handleBlur}
            data-cy="input-priority"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {showError('priority') && (
            <span className="form-error" data-cy="error-priority">⚠ {errors.priority}</span>
          )}
        </div>
      </div>

      {/* Environment + Assignee row */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="environment">Environment</label>
          <select
            id="environment"
            name="environment"
            className="form-select"
            value={values.environment}
            onChange={handleChange}
            data-cy="input-environment"
          >
            <option value="">— Select —</option>
            <option value="Production">Production</option>
            <option value="Staging">Staging</option>
            <option value="Development">Development</option>
            <option value="QA">QA</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="assignee">Assignee</label>
          <input
            id="assignee"
            name="assignee"
            type="text"
            className="form-input"
            placeholder="Name or username"
            value={values.assignee}
            onChange={handleChange}
            data-cy="input-assignee"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          data-cy="submit-btn"
        >
          {submitting ? '⏳ Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
