$(document).ready(function () {
  // Xử lý sự kiện khi nhấn nút đăng nhập
  $("#login-btn").click(function (e) {
    e.preventDefault(); // Ngăn chặn gửi form mặc định

    // Lấy giá trị từ input
    const username = $("#username").val();
    const password = $("#password").val();

    // Kiểm tra thông tin đăng nhập (ví dụ đơn giản)
    if (username === "admin" && password === "123") {
      // Hiển thị thông báo đăng nhập thành công
      alert("Đăng nhập thành công!");

      // Ẩn form đăng nhập bằng cách thêm class
      $("#login-section").removeClass("d-flex");
      $("#login-section").addClass("d-none");

      // Hiển thị nội dung chính
      $("#main-content").removeClass("d-none");
      $("#main-content").addClass("d-flex");

      // Cập nhật thanh nav
      $("#nav-items").html(`
        <li class="nav-item"><a class="nav-link text-white" href="#route-section">Xác định lộ trình</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="#schedule-section">Lịch trình</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="#incident-section">Cảnh báo sự cố</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="#report-section">Báo cáo</a></li>
        <li class="nav-item"><a class="nav-link text-white" href="#" id="logout-btn">Đăng xuất</a></li>
      `);
    } else {
      alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
  });

  // Xử lý sự kiện khi nhấn nút đăng xuất
  $(document).on("click", "#logout-btn", function (e) {
    e.preventDefault();

    // Hiển thị lại form đăng nhập
    $("#login-section").removeClass("d-none");
    $("#login-section").addClass("d-flex");

    // Ẩn nội dung chính
    $("#main-content").removeClass("d-flex");
    $("#main-content").addClass("d-none");

    // Cập nhật thanh nav
    $("#nav-items").html(`
      <li class="nav-item"><a class="nav-link text-white" href="#login-section">Đăng nhập</a></li>
    `);

    alert("Đăng xuất thành công!");
  });

  // *********** Modal ***********
  $("#route-btn").click(function () {
    $("#routeModal").modal("show");
  });

  $("#schedule-btn").click(function () {
    $("#scheduleModal").modal("show");
  });

  $("#incident-btn").click(function () {
    $("#incidentModal").modal("show");
  });

  $("#report-btn").click(function () {
    $("#reportModal").modal("show");
  });

  // *********** Xác định lộ trình ***********
  $("#route-form").submit(function (e) {
    e.preventDefault();

    const startPoint = $("#start-point").val();
    const endPoint = $("#end-point").val();

    if (startPoint && endPoint) {
      // Hiển thị thông báo đang xử lý
      $("#route-result").html("<p>Đang xác định lộ trình...</p>");

      // Giả lập xác định lộ trình (hoặc gọi Google Maps API)
      setTimeout(() => {
        $("#route-result").html(`
          <p><strong>Lộ trình:</strong> Từ ${startPoint} đến ${endPoint}</p>
          <p>Khoảng cách: 1 km</p>
          <p>Thời gian dự kiến: 5 phút</p>
        `);
      }, 2000);
    }
  });

  let routeMap;
  let directionsService;
  let directionsRenderer;

  function initRouteMap() {
    const defaultCenter = { lat: 10.870008, lng: 106.800479 }; // Vị trí mặc định (UIT)
    routeMap = new google.maps.Map(document.getElementById("route-map"), {
      center: defaultCenter,
      zoom: 14,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
      map: routeMap,
    });
  }

  // Tìm lộ trình
  $("#find-route-btn").click(() => {
    const start = $("#start-location").val();
    const end = $("#end-location").val();
    const waypointsInput = $("#waypoints").val();
    const waypoints = waypointsInput
      ? waypointsInput.split(",").map((location) => ({
          location: location.trim(),
          stopover: true,
        }))
      : [];

    if (!start || !end) {
      alert("Vui lòng nhập cả điểm bắt đầu và điểm đến!");
      return;
    }

    const request = {
      origin: start,
      destination: end,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        alert("Không thể tìm thấy lộ trình: " + status);
      }
    });
  });

  // *********** Theo dõi lịch trình ***********
  const scheduleList = [];

  $("#schedule-form").submit(function (e) {
    e.preventDefault();

    const name = $("#schedule-name").val();
    const time = $("#schedule-time").val();

    if (name && time) {
      scheduleList.push({ name, time });
      renderScheduleList();
      $("#schedule-name").val("");
      $("#schedule-time").val("");
    }
  });

  function renderScheduleList() {
    const listHtml = scheduleList
      .map(
        (schedule, index) =>
          `<tr>
            <td>${index + 1}</td>
            <td>${schedule.name}</td>
            <td>${schedule.time}</td>
          </tr>`
      )
      .join("");
    $("#schedule-list").html(listHtml);
  }

  // *********** Cảnh báo sự cố ***********
  const incidentList = [];

  $("#incident-form").submit(function (e) {
    e.preventDefault();

    const detail = $("#incident-detail").val();

    if (detail) {
      incidentList.push(detail);
      renderIncidentList();
      $("#incident-detail").val("");
    }
  });

  function renderIncidentList() {
    const listHtml = incidentList
      .map(
        (incident, index) =>
          `<li class="list-group-item">${index + 1}. ${incident}</li>`
      )
      .join("");
    $("#incident-list").html(listHtml);
  }

  // *********** Báo cáo và thống kê ***********
  const ctx = document.getElementById("reportChart").getContext("2d");
  const reportChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
      datasets: [
        {
          label: "Số lượng sự cố",
          data: [5, 3, 8, 6, 4],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  let map; // Biến toàn cục lưu đối tượng bản đồ
  let marker; // Biến toàn cục lưu marker

  function initRealTimeMap() {
    // Lấy phần tử chứa bản đồ
    const mapElement = document.getElementById("realtime-map");

    if (mapElement) {
      // Khởi tạo bản đồ tại một vị trí mặc định
      const map = new google.maps.Map(mapElement, {
        center: { lat: 10.870008889, lng: 106.800479177 }, // Vị trí mặc định (ví dụ: TP. Hồ Chí Minh)
        zoom: 15, // Độ thu phóng
      });

      // Thêm một marker mẫu để kiểm tra
      const marker = new google.maps.Marker({
        position: { lat: 10.870008889, lng: 106.800479177 },
        map: map,
        title: "Vị trí mặc định",
      });
    } else {
      console.error("Không tìm thấy phần tử chứa bản đồ!");
    }
  }

  function updatePosition(lat, lng) {
    if (map && marker) {
      const newPosition = new google.maps.LatLng(lat, lng);
      marker.setPosition(newPosition); // Cập nhật vị trí marker
      map.setCenter(newPosition); // Cập nhật vị trí trung tâm bản đồ
    } else {
      console.error("Bản đồ hoặc marker chưa được khởi tạo.");
    }
  }

  // Giả lập cập nhật vị trí mỗi 5 giây
  setInterval(() => {
    const randomLat = 10.870008 + (Math.random() - 0.5) / 1000;
    const randomLng = 106.800479 + (Math.random() - 0.5) / 1000;
    updatePosition(randomLat, randomLng);
  }, 5000);

  function initMap() {
    const defaultCenter = { lat: 10.8700142, lng: 106.8004792 }; // Vị trí mặc định
    map = new google.maps.Map(document.getElementById("map"), {
      center: defaultCenter,
      zoom: 16,
    });

    marker = new google.maps.Marker({
      position: defaultCenter,
      map: map,
    });

    // Tìm kiếm địa điểm
    $("#search-btn").click(() => {
      const location = $("#location-input").val();
      if (location) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            alert("Tìm thấy vị trí: " + results[0].formatted_address);
          } else {
            alert("Không tìm thấy vị trí: " + status);
          }
        });
      } else {
        alert("Vui lòng nhập vị trí!");
      }
    });
  }

  initMap();

  // *********** Giám sát thời gian thực ***********
  let realtimeMap;
  let realtimeMarker;
  let watchId;

  // Hàm để khởi tạo bản đồ Google Maps
  function initRealTimeMap() {
    // Tọa độ trung tâm của bản đồ (có thể thay đổi theo ý muốn)
    const mapCenter = { lat: 10.87, lng: 106.8004 };

    // Tạo bản đồ trong phần tử có ID "realtime-map"
    const map = new google.maps.Map(document.getElementById("realtime-map"), {
      center: mapCenter,
      zoom: 15, // Độ phóng to bản đồ
    });

    // Tạo marker (chỉ dẫn) trên bản đồ
    const marker = new google.maps.Marker({
      position: mapCenter, // Vị trí ban đầu của marker
      map: map,
      title: "Real-Time Position", // Tooltip khi hover vào marker
    });

    // Mô phỏng vị trí thay đổi trong thời gian thực (chỉ để demo)
    setInterval(() => {
      // Tạo vị trí ngẫu nhiên gần vị trí ban đầu
      const newLat = mapCenter.lat + (Math.random() - 0.5) / 1000;
      const newLng = mapCenter.lng + (Math.random() - 0.5) / 1000;

      // Cập nhật vị trí của marker
      marker.setPosition({ lat: newLat, lng: newLng });

      // Di chuyển bản đồ đến vị trí mới
      map.setCenter({ lat: newLat, lng: newLng });
    }, 2000); // Cập nhật vị trí mỗi 2 giây
  }

  initRealTimeMap();

  $("#track-btn").click(() => {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          realtimeMap.setCenter(userLocation);
          realtimeMarker.setPosition(userLocation);
        },
        (error) => {
          alert("Lỗi khi lấy vị trí: " + error.message);
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ Geolocation API.");
    }
  });

  // Dừng theo dõi
  $("#stop-btn").click(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      alert("Đã dừng theo dõi.");
    }
  });
});
