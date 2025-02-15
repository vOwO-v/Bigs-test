import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Member/Login';
import Join from './pages/Member/Join';
import List from './pages/Board/list';
import Write from './pages/Board/write';
import Read from './pages/Board/read';
import Edit from './pages/Board/edit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/join" element={<Join/>} />
        <Route path="/list/" element={<List/>} />
        <Route path="/write" element={<Write/>} />
        <Route path="/read/:id" element={<Read/>} />
        <Route path="/edit/:id" element={<Edit/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
