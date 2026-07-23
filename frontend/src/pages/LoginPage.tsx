import { useState, useRef, useEffect } from "react"
import { login } from "../services/auth.ts"
import '../styles/LoginPage.css'

type Props = {
  setUser: React.Dispatch<React.SetStateAction<number | null>>
  goVote: () => void
  goAlready: () => void
}

export default function LoginPage({ setUser, goVote, goAlready }: Props) {
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [message, setMessage] = useState("")

  const fnameRef = useRef<HTMLInputElement>(null)
  const lnameRef = useRef<HTMLInputElement>(null)

  // เข้าหน้าล้อกอินแล้วจะโฟกัสไปที่ชื่ออัตโนมัติ
  useEffect(() => {
    fnameRef.current?.focus()
  }, [])

  const handleLogin = () => {
    const result = login(fname, lname);

    if (!result.success) {
      if (result.message === "already") {
        goAlready();
        return;
      }

      setMessage(result.message ?? "");
      return;
    }

    setMessage("");

    if (!result.user) return;
    setUser(result.user.id);
    
    goVote();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin()
  }

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>เข้าสู่ระบบ</h2>

        {message && (<div className="alert-box" title={message}>{message}</div>)}

        {/* ชื่อ */}
        <div className="input-field">
          <label>
            <p>ชื่อ</p>
            <input
              ref={fnameRef}
              type="text"
              placeholder="ระบุชื่อ"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
          </label>
        </div>

        {/* นามสกุล */}
        <div className="input-field">
          <label>
            <p>นามสกุล</p>
            <input
              ref={lnameRef}
              type="text"
              placeholder="ระบุนามสกุล"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </label>
        </div>

        {/* ปุ่มเข้าสู่ระบบ */}
        <button type="submit" className="btn-login">
          เข้าสู่ระบบ
        </button>

      </form>
    </div>
  )
}