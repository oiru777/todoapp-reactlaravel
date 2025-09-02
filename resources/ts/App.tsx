import '../css/app.css'

import React from 'react'
import { ShowTodoList } from './Components/pages/ShowTodoList'
import { TagTodoList } from './Components/pages/TagTodoList'
import { HomePage } from './Components/pages/HomePage'
import { RegisterPage } from './Components/pages/RegisterPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

const App: React.FC = () => {
    const [user, setUser] = useState(null)
    const handleLogin = (user: any) => {
        console.log('ログイン成功:', user)
        setUser(user) // ログイン状態を保存
    }
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tag/:tagName" element={<TagTodoList />} />
                    <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
