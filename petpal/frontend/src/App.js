import logo from './logo.svg';
//import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/landing';
import Login from './pages/accounts/login'
import Layout from './components/layout';
import Signup from './pages/accounts/signup';
import Update from './pages/accounts/update';
import Listings from './pages/listings';
import Creation from './pages/listings/creation';
import ShelterView from './pages/listings/shelter_view';
import ListingUpdate from './pages/listings/update';
import ListingView from './pages/listings/view';
import CreateApplication from './pages/applications/create';
import Application from './pages/applications/detail';
import Shelters from './pages/accounts/shelters';
import ViewProfile from './pages/accounts/view_profile';
import NotificationsList from './pages/notifications/list';
import ModalPage from './pages/comments/chatbox';
import Review from './pages/comments/revewshetler/index'
import Make from './pages/comments/makereview/index';
import ListApplications from './pages/applications/list';
import ViewBlog from './pages/blog/shelter-blog';
import EditBlog from './pages/blog/edit-blog';
import MakePost from './pages/blog/make-post';
import EditPost from './pages/blog/edit-post';
import ApplicationUpdate from './pages/applications/update';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />}/> 
          <Route path="signup" element={<Signup />}/>
          <Route path="update" element={<Update />}/>
          <Route path="view_shelters" element={<Shelters/>}/>
          <Route path="view_profile/:userID" element={<ViewProfile/>}/>
          <Route path="listings/view/:listingID" element={<ListingView />}/>
          <Route path="listings/:listingID/applications" element={<CreateApplication />}/>
          {/* <Route path="listings" element={<Listings />}/> */}
          <Route path="listings/update/:listingID" element={<ListingUpdate />}/>
          <Route path="listings/creation" element={<Creation />}/>
          <Route path="mylistings" element={<ShelterView />}/>
          <Route path="application/:applicationID" element={<Application />}/>
          <Route path="application/:applicationID/update" element={<ApplicationUpdate />}/>
          <Route path="applications" element={<ListApplications />}/>   
          <Route path="listings" element={<Listings />}/>
          <Route path="notifications/list" element={<NotificationsList/>}/>
          <Route path="/application/:applicationID/chat/box" element={<ModalPage />} />
          <Route path="/:shelterID/shelter/review" element={<Review />} />
          <Route path="/blog/:shelterID" element={<ViewBlog />}/>
          <Route path="/blog/edit" element={<EditBlog />}/>
          <Route path="/blog/post" element={<MakePost />}/>
          <Route path="/blog/update/:postID" element={<EditPost />}/>
          <Route path="/:shelterID/shelter/review/make" element={<Make />} />
        </Route>
        <Route path="/">
        </Route>
      </Routes> 
    </BrowserRouter>
  );
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
