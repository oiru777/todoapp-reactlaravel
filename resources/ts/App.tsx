import '../css/app.css'

import React from 'react'
import { ShowTodoList } from './Components/pages/ShowTodoList'
import { TagTodoList } from './Components/pages/TagTodoList'
import { HomePage } from './Components/pages/HomePage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tag/:tagName" element={<TagTodoList />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
