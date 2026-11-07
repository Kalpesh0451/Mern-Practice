const enrollmentConfirmation = (studentName, courseName) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #2563eb;">Welcome to EduSphere!</h2>

      <p>Hello ${studentName},</p>

      <p>
        Your enrollment in
        <strong>${courseName}</strong>
        has been successfully confirmed.
      </p>

      <p>We wish you success in your learning journey!</p>

      <br/>

      <p>Regards,<br/><strong>EduSphere Team</strong></p>
    </div>
  `;
};

module.exports = { enrollmentConfirmation };