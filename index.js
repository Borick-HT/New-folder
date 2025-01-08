$(document).ready(function () {
  $(
    "#route-section, #schedule-section, #incident-section, #report-section, #gis-search-section, #register-section"
  ).hide(); // Ẩn các tính năng

  // *********** Đăng nhập ***********
  $("#login-form").on("submit", function (e) {
    e.preventDefault();

    const email = $("#email").val();
    const password = $("#password").val();

    if (email === "admin" && password === "123") {
      alert("Đăng nhập thành công!");
      $("#login-section").hide(); // Ẩn form đăng nhập
      $(
        "#route-section, #schedule-section, #incident-section, #report-section, #gis-search-section, #register-section"
      ).show(); // Hiển thị các tính năng
      $("#nav-menu").html(`
        <li><a href="#route-section">Xác định lộ trình</a></li>
        <li><a href="#schedule-section">Lịch trình</a></li>
        <li><a href="#incident-section">Cảnh báo sự cố</a></li>
        <li><a href="#report-section">Báo cáo</a></li>
        <li><a href="#" id="logout-btn">Đăng xuất</a></li>
        `); // Đổi nút Đăng nhập thành Đăng xuất
    } else {
      alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  });

  // *********** Đăng xuất ***********
  $(document).on("click", "#logout-btn", function (e) {
    e.preventDefault();

    alert("Đăng xuất thành công!");
    $("#login-section").show(); // Hiển thị lại form đăng nhập
    $(
      "#route-section, #schedule-section, #incident-section, #report-section, #gis-search-section, #register-section"
    ).hide(); // Ẩn các tính năng
    $("#nav-menu").html('<li><a href="#login-section">Đăng nhập</a></li>'); // Đổi nút Đăng xuất thành Đăng nhập
  });

  // *********** Xác định lộ trình ***********
  $("#btn_FindRoute").on("click", function () {
    const start = $("#start-location").val();
    const end = $("#end-location").val();

    if (start && end) {
      const result = `
        <p><strong>Lộ trình:</strong> Từ <em>${start}</em> đến <em>${end}</em>.</p>
        <p>Khoảng cách: 2 km</p>
        <p>Thời gian dự kiến: 10 phút</p>
      `;
      $("#route-result").html(result);
    } else {
      alert("Vui lòng nhập đầy đủ thông tin.");
    }
  });

  // *********** Theo dõi lịch trình ***********
  const schedules = [
    { time: "08:00 AM", activity: "Đi học môn Toán tại phòng A101" },
    { time: "10:00 AM", activity: "Tham gia seminar tại hội trường lớn" },
    { time: "01:00 PM", activity: "Họp nhóm tại thư viện" },
  ];

  schedules.forEach((schedule) => {
    const scheduleItem = `<p><strong>${schedule.time}</strong>: ${schedule.activity}</p>`;
    $("#schedule-list").append(scheduleItem);
  });

  // *********** Cảnh báo sự cố ***********
  const incidents = [
    { time: "08:30 AM", description: "Kẹt xe tại cổng chính" },
    { time: "09:15 AM", description: "Mất điện tại khu vực A" },
  ];

  incidents.forEach((incident) => {
    const incidentItem = `<p><strong>${incident.time}</strong>: ${incident.description}</p>`;
    $("#incident-list").append(incidentItem);
  });

  // *********** Báo cáo và thống kê ***********
  const reportData = {
    routesCompleted: 10,
    incidentsReported: 2,
  };

  $(".report-statistics").append(`
    <p>Tổng số lộ trình được thực hiện hôm nay: ${reportData.routesCompleted}</p>
    <p>Số sự cố báo cáo: ${reportData.incidentsReported}</p>
  `);
});
