
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
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [courseDistribution, setCourseDistribution] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, enrollmentResponse] = await Promise.all([
        getDashboardStats(),
        getEnrollmentTrend(),
      ]);

      // Match the actual backend response properties
      setStats(statsResponse.stats);
      setRecentEnrollments(statsResponse.recentEnrollments || []);
      setCourseDistribution(statsResponse.courseDistribution || []);
      setEnrollmentData(enrollmentResponse.enrollmentTrend || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load reports. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  if (loading && !stats) {
    return (
      <div className="container-fluid p-4 text-center">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading reports...</p>
      </div>
    );
  }

  if (!stats && error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={fetchReports}>
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: "bi-people-fill",
      color: "primary",
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: "bi-book-fill",
      color: "success",
    },
    {
      title: "Total Enrollments",
      value: stats.totalEnrollments,
      icon: "bi-journal-check",
      color: "info",
    },
    {
      title: "Active Courses",
      value: stats.activeCourses,
      icon: "bi-check-circle-fill",
      color: "success",
    },
    {
      title: "Active Enrollments",
      value: stats.activeEnrollments,
      icon: "bi-person-check-fill",
      color: "primary",
    },
    {
      title: "Completed Enrollments",
      value: stats.completedEnrollments,
      icon: "bi-patch-check-fill",
      color: "warning",
    },
    {
      title: "Cancelled Enrollments",
      value: stats.cancelledEnrollments,
      icon: "bi-x-circle-fill",
      color: "danger",
    },
  ];

  const overallData = {
    labels: ["Students", "Courses", "Enrollments"],
    datasets: [
      {
        label: "Total Records",
        data: [
          stats.totalStudents,
          stats.totalCourses,
          stats.totalEnrollments,
        ],
        backgroundColor: ["#0d6efd", "#198754", "#ffc107"],
        borderRadius: 8,
      },
    ],
  };

  const courseStatusData = {
    labels: ["Active Courses", "Inactive Courses"],
    datasets: [
      {
        data: [
          stats.activeCourses,
          Math.max(0, stats.totalCourses - stats.activeCourses),
        ],
        backgroundColor: ["#198754", "#dc3545"],
        borderWidth: 0,
      },
    ],
  };

  const enrollmentStatusData = {
    labels: ["Active", "Completed", "Cancelled"],
    datasets: [
      {
        data: [
          stats.activeEnrollments,
          stats.completedEnrollments,
          stats.cancelledEnrollments,
        ],
        backgroundColor: ["#0d6efd", "#198754", "#dc3545"],
        borderWidth: 0,
      },
    ],
  };

  const enrollmentChartData = {
    labels: enrollmentData.map((item) => `${item.month} ${item.year}`),
    datasets: [
      {
        label: "Enrollments",
        data: enrollmentData.map((item) => item.enrollments),
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13, 110, 253, 0.15)",
        pointBackgroundColor: "#0d6efd",
        pointRadius: 5,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const courseDistributionData = {
    labels: courseDistribution.map((item) => item.courseName),
    datasets: [
      {
        label: "Enrollments",
        data: courseDistribution.map((item) => item.enrollmentCount),
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
          "#6f42c1",
          "#20c997",
          "#fd7e14",
        ],
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="container-fluid">
      {/* Heading */}
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

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        {cards.map((card) => (
          <div className="col-xl-3 col-md-6" key={card.title}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-2">{card.title}</p>
                  <h2 className="fw-bold mb-0">{card.value ?? 0}</h2>
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

      {/* Overall Statistics and Status Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-4">Overall Statistics</h5>
              <Bar
                data={overallData}
                options={{
                  ...chartOptions,
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5 className="mb-4">Course Status</h5>
              <div style={{ maxWidth: "260px", margin: "auto" }}>
                <Doughnut data={courseStatusData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-4">Enrollment Status</h5>
              <div style={{ maxWidth: "260px", margin: "auto" }}>
                <Doughnut
                  data={enrollmentStatusData}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Trend */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="mb-4">Monthly Enrollment Trend</h5>

          {enrollmentData.length > 0 ? (
            <Line
              data={enrollmentChartData}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
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

      {/* Course-wise Distribution */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="mb-4">Course-wise Enrollment Distribution</h5>

          {courseDistribution.length > 0 ? (
            <Bar
              data={courseDistributionData}
              options={{
                ...chartOptions,
                indexAxis: "y",
                scales: {
                  x: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                  },
                },
              }}
            />
          ) : (
            <p className="text-muted text-center py-4">
              No course distribution data available.
            </p>
          )}
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="mb-4">Recent Enrollments</h5>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentEnrollments.length > 0 ? (
                  recentEnrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td>
                        {enrollment.student?.fullName || "Student unavailable"}
                      </td>
                      <td>
                        {enrollment.course?.courseName || "Course unavailable"}
                      </td>
                      <td>
                        {enrollment.enrollmentDate
                          ? new Date(
                              enrollment.enrollmentDate
                            ).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            enrollment.status === "Active"
                              ? "bg-success"
                              : enrollment.status === "Completed"
                              ? "bg-primary"
                              : "bg-danger"
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No recent enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
