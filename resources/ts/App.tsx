import '../css/app.css'

import React from 'react'
import ShowTodoList from './Components/ShowTodoList'
import TagTodoList from './Components/TagTodoList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<ShowTodoList />} />
                    <Route path="/tag/:tagName" element={<TagTodoList />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
