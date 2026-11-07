
import { useCallback, useEffect, useState } from "react";

import {
  getDashboardStats,
  getEnrollmentTrend,
} from "../../services/reportService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Doughnut, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function Reports() {
  const [stats, setStats] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all report data
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, enrollmentResponse] = await Promise.all([
        getDashboardStats(),
        getEnrollmentTrend(),
      ]);

      setStats(statsResponse.statistics);
      setEnrollmentData(enrollmentResponse.enrollmentData || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Unable to load reports. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load reports when component mounts
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Initial loading
  if (loading && !stats) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading reports...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!stats && error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">{error}</div>

        <button
          className="btn btn-primary"
          onClick={fetchReports}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  // Statistics cards
  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      color: "primary",
      icon: "bi-people-fill",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      color: "success",
      icon: "bi-book-fill",
    },
    {
      title: "Total Instructors",
      value: stats.totalInstructors,
      color: "warning",
      icon: "bi-person-badge-fill",
    },
    {
      title: "Active Courses",
      value: stats.activeCourses,
      color: "success",
      icon: "bi-check-circle-fill",
    },
    {
      title: "Inactive Courses",
      value: stats.inactiveCourses,
      color: "danger",
      icon: "bi-x-circle-fill",
    },
    {
      title: "Active Instructors",
      value: stats.activeInstructors,
      color: "primary",
      icon: "bi-person-check-fill",
    },
    {
      title: "Inactive Instructors",
      value: stats.inactiveInstructors,
      color: "secondary",
      icon: "bi-person-x-fill",
    },
  ];

  // Overall statistics bar chart
  const barData = {
    labels: ["Students", "Courses", "Instructors"],
    datasets: [
      {
        label: "Total Records",
        data: [
          stats.totalStudents,
          stats.totalCourses,
          stats.totalInstructors,
        ],
        backgroundColor: ["#0d6efd", "#198754", "#ffc107"],
        borderRadius: 8,
      },
    ],
  };

  // Course status doughnut chart
  const courseData = {
    labels: ["Active Courses", "Inactive Courses"],
    datasets: [
      {
        data: [stats.activeCourses, stats.inactiveCourses],
        backgroundColor: ["#198754", "#dc3545"],
        borderWidth: 0,
      },
    ],
  };

  // Instructor status doughnut chart
  const instructorData = {
    labels: ["Active Instructors", "Inactive Instructors"],
    datasets: [
      {
        data: [
          stats.activeInstructors,
          stats.inactiveInstructors,
        ],
        backgroundColor: ["#0d6efd", "#ffc107"],
        borderWidth: 0,
      },
    ],
  };

  // Student enrollment trend line chart
  const enrollmentChartData = {
    labels: enrollmentData.map((item) => item.month),
    datasets: [
      {
        label: "Students Registered",
        data: enrollmentData.map((item) => item.totalStudents),
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13, 110, 253, 0.15)",
        pointBackgroundColor: "#0d6efd",
        pointBorderColor: "#ffffff",
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Common chart options
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="container-fluid">

      {/* Page Heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2>Reports & Analytics</h2>
          <p className="text-muted mb-0">
            Monitor your institution's performance and statistics.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={fetchReports}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          {loading ? "Refreshing..." : "Refresh Reports"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        {cards.map((card) => (
          <div className="col-xl-3 col-md-6" key={card.title}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-2">
                    {card.title}
                  </p>

                  <h2 className="fw-bold mb-0">
                    {card.value ?? 0}
                  </h2>
                </div>

                <div
                  className={`bg-${card.color} bg-opacity-10 text-${card.color} rounded-3 p-3`}
                >
                  <i className={`${card.icon} fs-3`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Existing Charts */}
      <div className="row g-4">

        {/* Overall Statistics */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-4">Overall Statistics</h5>

              <Bar
                data={barData}
                options={{
                  ...commonChartOptions,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Status Charts */}
        <div className="col-lg-5">

          {/* Course Status */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5 className="mb-4">Course Status</h5>

              <div style={{ maxWidth: "260px", margin: "auto" }}>
                <Doughnut
                  data={courseData}
                  options={commonChartOptions}
                />
              </div>
            </div>
          </div>

          {/* Instructor Status */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-4">Instructor Status</h5>

              <div style={{ maxWidth: "260px", margin: "auto" }}>
                <Doughnut
                  data={instructorData}
                  options={commonChartOptions}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Student Enrollment Trend */}
      <div className="row mt-4 mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-4">
                Student Enrollment Trend
              </h5>

              {enrollmentData.length > 0 ? (
                <Line
                  data={enrollmentChartData}
                  options={{
                    ...commonChartOptions,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <p className="text-muted text-center py-4">
                  No enrollment data available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Reports;
