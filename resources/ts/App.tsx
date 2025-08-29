import '../css/app.css'

import React from 'react'
import ShowTodoList from './Components/ShowTodoList'
import TagTodoList from './Components/TagTodoList'
import { LoginPage } from './Components/pages/LoginPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<ShowTodoList />} />
                    <Route path="/tag/:tagName" element={<TagTodoList />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
