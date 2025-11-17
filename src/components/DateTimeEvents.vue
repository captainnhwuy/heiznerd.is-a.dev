<template>
  <div class="datetime-events-box">
    <div class="datetime">
      <div class="time">{{ time }}</div>
      <div class="date">{{ solarDate }} / {{ lunarDate }}</div>
    </div>
    <div class="events">
      <div v-if="loading" class="loading">
        <span>Đang tải ngày lễ...</span>
      </div>
      <div v-else-if="error" class="error">
        <span>{{ error }}</span>
      </div>
      <div v-else-if="nextHoliday">
        <p class="event-info">
          <span class="event-name">{{ nextHoliday.name }}</span>
          <span class="event-date">{{ nextHoliday.date }}</span>
          <span class="event-countdown">{{ countdown }}</span>
        </p>
      </div>
      <div v-else class="no-events">
        <span>Không có ngày lễ sắp tới trong năm nay</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const time = ref('');
const solarDate = ref('');
const lunarDate = ref('');
const nextHoliday = ref(null);
const countdown = ref('');
const loading = ref(true);
const error = ref('');

let timeInterval;
let countdownInterval;

// Danh sách ngày lễ Việt Nam (cập nhật hàng năm)
const vietnamHolidays = {
  2025: [
    { name: 'Tết Nguyên Đán', date: '2025-01-29', endDate: '2025-02-02' },
    { name: 'Lễ Tình Nhân (Valentine)', date: '2025-02-14' },
    { name: 'Ngày Quốc tế Phụ nữ 8/3', date: '2025-03-08' },
    { name: 'Giỗ Tổ Hùng Vương', date: '2025-04-06' },
    { name: 'Ngày Giải phóng miền Nam 30/4', date: '2025-04-30' },
    { name: 'Ngày Quốc tế Lao động 1/5', date: '2025-05-01' },
    { name: 'Tết Đoan Ngọ', date: '2025-05-31' },
    { name: 'Ngày Gia đình Việt Nam', date: '2025-06-28' },
    { name: 'Tết Trung Thu', date: '2025-09-07' },
    { name: 'Ngày Quốc khánh 2/9', date: '2025-09-02' },
    { name: 'Ngày Phụ nữ Việt Nam 20/10', date: '2025-10-20' },
    { name: 'Ngày Nhà giáo Việt Nam 20/11', date: '2025-11-20' },
    { name: 'Giáng Sinh (Noel)', date: '2025-12-24' },
    { name: 'Tết Dương lịch', date: '2025-12-31' }
  ],
  2026: [
    { name: 'Tết Dương lịch', date: '2026-01-01' },
    { name: 'Tết Nguyên Đán', date: '2026-02-17', endDate: '2026-02-22' },
    { name: 'Lễ Tình Nhân (Valentine)', date: '2026-02-14' },
    { name: 'Ngày Quốc tế Phụ nữ 8/3', date: '2026-03-08' },
    { name: 'Giỗ Tổ Hùng Vương', date: '2026-04-26' },
    { name: 'Ngày Giải phóng miền Nam 30/4', date: '2026-04-30' },
    { name: 'Ngày Quốc tế Lao động 1/5', date: '2026-05-01' },
    { name: 'Tết Đoan Ngọ', date: '2026-06-19' },
    { name: 'Ngày Gia đình Việt Nam', date: '2026-06-28' },
    { name: 'Ngày Quốc khánh 2/9', date: '2026-09-02' },
    { name: 'Tết Trung Thu', date: '2026-09-25' },
    { name: 'Ngày Phụ nữ Việt Nam 20/10', date: '2026-10-20' },
    { name: 'Ngày Nhà giáo Việt Nam 20/11', date: '2026-11-20' },
    { name: 'Giáng Sinh (Noel)', date: '2026-12-24' },
    { name: 'Tết Dương lịch', date: '2026-12-31' }
  ]
};

const updateDateTime = async () => {
  const now = new Date();
  
  // Cập nhật giờ
  time.value = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // Cập nhật ngày dương lịch
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  solarDate.value = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

  // Lấy lịch âm từ open.oapi.vn
  try {
    const response = await fetch('https://open.oapi.vn/date/convert-to-lunar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ day, month, year })
    });
    
    if (!response.ok) throw new Error('API không phản hồi');
    
    const result = await response.json();
    
    if (result && result.code === 'success' && result.data) {
      const lunarDay = result.data.day.toString().padStart(2, '0');
      const lunarMonth = result.data.month.toString().padStart(2, '0');
      const lunarYear = result.data.year;
      lunarDate.value = `${lunarDay}/${lunarMonth}/${lunarYear}`;
    } else {
      lunarDate.value = 'Không xác định';
    }
  } catch (err) {
    console.error('Lỗi khi lấy lịch âm:', err);
    lunarDate.value = 'Không khả dụng';
  }
};

const calculateDetailedCountdown = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);
  
  // Tính toán chênh lệch thời gian
  let diffMs = target - now;
  
  if (diffMs <= 0) {
    return 'Đã đến';
  }
  
  // Tính số giây, phút, giờ
  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  
  // Tính số ngày còn lại
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Tính số tháng và ngày còn lại
  let months = 0;
  let weeks = 0;
  let days = totalDays;
  
  // Tính số tháng (giả sử mỗi tháng 30 ngày)
  if (days >= 30) {
    months = Math.floor(days / 30);
    days = days % 30;
  }
  
  // Tính số tuần
  if (days >= 7) {
    weeks = Math.floor(days / 7);
    days = days % 7;
  }
  
  // Tạo chuỗi countdown
  let countdownStr = '';
  
  if (months > 0) {
    countdownStr += `${months} tháng `;
  }
  if (weeks > 0) {
    countdownStr += `${weeks} tuần `;
  }
  if (days > 0) {
    countdownStr += `${days} ngày `;
  }
  
  // Thêm giờ:phút:giây
  countdownStr += `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return countdownStr + ' left';
};

const updateCountdown = () => {
  if (nextHoliday.value && nextHoliday.value.targetDate) {
    countdown.value = calculateDetailedCountdown(nextHoliday.value.targetDate);
    
    // Kiểm tra nếu sự kiện đã đến, tìm sự kiện tiếp theo
    if (countdown.value === 'Đã đến') {
      findNextHoliday();
    }
  }
};

const findNextHoliday = () => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Lấy danh sách ngày lễ của năm hiện tại và năm sau
    const holidays = [
      ...(vietnamHolidays[currentYear] || []),
      ...(vietnamHolidays[currentYear + 1] || [])
    ];
    
    // Tìm ngày lễ tiếp theo
    const upcomingHolidays = holidays
      .filter(holiday => {
        const holidayDate = new Date(holiday.date);
        return holidayDate >= now;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (upcomingHolidays.length > 0) {
      const nextEvent = upcomingHolidays[0];
      const eventDate = new Date(nextEvent.date);
      const formattedDate = eventDate.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      nextHoliday.value = {
        name: nextEvent.name,
        date: formattedDate,
        targetDate: nextEvent.date
      };
      
      // Cập nhật countdown ngay lập tức
      updateCountdown();
    } else {
      nextHoliday.value = null;
      countdown.value = '';
    }
    
    loading.value = false;
    error.value = '';
  } catch (err) {
    console.error('Lỗi khi tìm ngày lễ:', err);
    loading.value = false;
    error.value = 'Không thể tải ngày lễ';
  }
};

onMounted(async () => {
  // Khởi tạo
  await updateDateTime();
  findNextHoliday();

  // Cập nhật thời gian mỗi giây
  timeInterval = setInterval(updateDateTime, 1000);
  
  // Cập nhật countdown mỗi giây
  countdownInterval = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
  clearInterval(countdownInterval);
});
</script>

<style scoped>
.datetime-events-box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.datetime {
  margin-bottom: 1.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 1.5rem;
}

.time {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  letter-spacing: 3px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.date {
  font-size: 1.1rem;
  opacity: 0.95;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.events {
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
}

.event-name {
  font-size: 1.3rem;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.event-date {
  font-size: 0.9rem;
  opacity: 0.85;
  font-weight: 400;
}

.event-countdown {
  font-size: 1.1rem;
  opacity: 1;
  font-weight: 600;
  color: #ffd700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  letter-spacing: 1px;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-top: 0.3rem;
}

.loading,
.error,
.no-events {
  font-size: 1rem;
  opacity: 0.85;
}

.error {
  color: #ffcccc;
}

.no-events {
  color: #e0e0e0;
}

/* Animation cho sự kiện thay đổi */
.events p {
  animation: fadeIn 0.6s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .time {
    font-size: 2.2rem;
  }
  
  .event-name {
    font-size: 1.1rem;
  }
  
  .event-countdown {
    font-size: 0.95rem;
  }
}
</style>