import PropTypes from 'prop-types'

export function BugPreview({ bug }) {
    return (
        <article>
            <h4>Title: {bug.title || 'No Title'}</h4>
            <h1>🐛</h1>
            <p>Severity: <span>{bug.severity}</span></p>
            <button disabled="none">{bug.labels}</button>
        </article>
    )
}

BugPreview.propTypes = {
    bug: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string, // Make title optional
        severity: PropTypes.number.isRequired,
        labels: PropTypes.string,
    }).isRequired,
}
