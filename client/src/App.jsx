
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

import Dashboard from "./pages/dashboard/Dashboard";
import Students from "./pages/dashboard/Students";
import AddStudent from "./pages/dashboard/AddStudent";
import Courses from "./pages/dashboard/Courses";
import Instructors from "./pages/dashboard/Instructors";
import ViewStudent from "./pages/dashboard/ViewStudent";
import EditStudent from "./pages/dashboard/EditStudent";
import AddCourse from "./pages/dashboard/AddCourse";
import EditCourse from "./pages/dashboard/EditCourse";
import ViewCourse from "./pages/dashboard/ViewCourse";
import AddInstructor from "./pages/dashboard/AddInstructor";
import EditInstructor from "./pages/dashboard/EditInstructor";
import ViewInstructor from "./pages/dashboard/ViewInstructor";
import Reports from "./pages/dashboard/Reports";
import Enrollments from "./pages/dashboard/Enrollments";
import AddEnrollment from "./pages/dashboard/AddEnrollment";
import ViewEnrollment from "./pages/dashboard/ViewEnrollment";
import EditEnrollment from "./pages/dashboard/EditEnrollment";
import Users from "./pages/dashboard/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Route>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="view-student/:id" element={<ViewStudent />} />
            <Route path="edit-student/:id" element={<EditStudent />} />

            <Route path="courses" element={<Courses />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="edit-course/:id" element={<EditCourse />} />
            <Route path="view-course/:id" element={<ViewCourse />} />

            <Route path="instructors" element={<Instructors />} />
            <Route path="add-instructor" element={<AddInstructor />} />
            <Route path="edit-instructor/:id" element={<EditInstructor />} />
            <Route path="view-instructor/:id" element={<ViewInstructor />} />

            <Route path="reports" element={<Reports />} />

            <Route path="enrollments" element={<Enrollments />} />
            <Route path="enrollments/add" element={<AddEnrollment />} />
            <Route path="enrollments/:id" element={<ViewEnrollment />} />
            <Route path="enrollments/edit/:id" element={<EditEnrollment />} />

            {/* Admin-only User Management */}
<Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
  <Route path="users" element={<Users />} />
</Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
