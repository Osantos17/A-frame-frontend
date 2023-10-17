import { Header } from "./Header"
import { Content } from "./Content"
import { BrowserRouter} from "react-router-dom";

 function App() {
  return (
    <div>
      <BrowserRouter>
        <Header />
        <Content />
      </BrowserRouter>
    </div>
  )
}

export default App;