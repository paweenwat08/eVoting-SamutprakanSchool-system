import { seedVotes } from "../utils_deleteOneDay/seedVotes"
import '../styles/Action.css'

export default function Action() {
    const handleReset = () => {
        localStorage.removeItem("votes")
        window.location.reload()
    }

    return (
        <div className="actions">
            <button onClick={seedVotes} className="btn-generate">
                🔄 Generate
            </button>
            <button onClick={handleReset} className="btn-reset">
                🗑 Reset
            </button>
        </div>
    )
}