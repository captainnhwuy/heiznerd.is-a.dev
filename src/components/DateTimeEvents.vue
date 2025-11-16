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
          <span class="event-countdown">{{ nextHoliday.countdown }}</span>
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
const loading = ref(true);
const error = ref('');

let timeInterval;
let holidayInterval;

// Danh sách ngày lễ Việt Nam (cập nhật hàng năm)
const vietnamHolidays = {
  2025: [
    { name: 'Tết Dương lịch', date: '2025-01-01' },
    { name: 'Tết Nguyên Đán', date: '2025-02-16', endDate: '2025-02-019' },
    { name: 'Giỗ Tổ Hùng Vương', date: '2025-04-07' },
    { name: 'Ngày Chiến thắng 30/4', date: '2025-04-30' },
    { name: 'Ngày Quốc tế Lao động', date: '2025-05-01' },
    { name: 'Ngày Quốc khánh', date: '2025-09-02' }
  ],
  2026: [
    { name: 'Tết Dương lịch', date: '2026-01-01' },
    { name: 'Tết Nguyên Đán', date: '2026-02-17', endDate: '2026-02-22' },
    { name: 'Giỗ Tổ Hùng Vương', date: '2026-04-26' },
    { name: 'Ngày Chiến thắng 30/4', date: '2026-04-30' },
    { name: 'Ngày Quốc tế Lao động', date: '2026-05-01' },
    { name: 'Ngày Quốc khánh', date: '2026-09-02' }
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

const calculateDaysUntil = (targetDate) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hôm nay';
  else if (diffDays === 1) return 'Ngày mai';
  else if (diffDays > 1) return `Còn ${diffDays} ngày`;
  else return `Đã qua ${Math.abs(diffDays)} ngày`;
};

const findNextHoliday = () => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
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
        countdown: calculateDaysUntil(nextEvent.date)
      };
    } else {
      nextHoliday.value = null;
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
  
  // Cập nhật ngày lễ mỗi giờ (để cập nhật countdown)
  holidayInterval = setInterval(findNextHoliday, 3600000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
  clearInterval(holidayInterval);
});
</script>

<style scoped>
.datetime-events-box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.datetime {
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 1rem;
}

.time {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
}

.date {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.events {
  min-height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin: 0;
}

.event-name {
  font-size: 1.1rem;
  font-weight: 600;
}

.event-date {
  font-size: 0.85rem;
  opacity: 0.8;
}

.event-countdown {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
  color: #ffd700;
}

.loading,
.error,
.no-events {
  font-size: 0.9rem;
  opacity: 0.8;
}

.error {
  color: #ffcccc;
}

.no-events {
  color: #cccccc;
}

/* Animation cho sự kiện thay đổi */
.events p {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>