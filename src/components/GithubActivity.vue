<template>
  <!-- Live activity card shown in Contact section -->
  <div class="gh-activity drift from-bottom" v-if="events.length > 0">
    <div class="gha-header">
      <i class="fab fa-github"></i>
      <span>Recent Activity</span>
      <span class="gha-badge">Live</span>
    </div>
    <ul class="gha-list">
      <li v-for="(ev, i) in events" :key="i" class="gha-item">
        <span class="gha-icon" :class="ev.type">
          <i :class="ev.icon"></i>
        </span>
        <div class="gha-info">
          <span class="gha-action">{{ ev.action }}</span>
          <span class="gha-repo">{{ ev.repo }}</span>
        </div>
        <span class="gha-time">{{ ev.time }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const events = ref([]);

const EVENT_ICONS = {
  PushEvent:          { icon: 'fas fa-code-branch', label: 'Pushed to', type: 'ev-push' },
  CreateEvent:        { icon: 'fas fa-plus',          label: 'Created',   type: 'ev-create' },
  WatchEvent:         { icon: 'fas fa-star',          label: 'Starred',   type: 'ev-star' },
  ForkEvent:          { icon: 'fas fa-code-fork',     label: 'Forked',    type: 'ev-fork' },
  IssuesEvent:        { icon: 'fas fa-circle-dot',    label: 'Issue on',  type: 'ev-issue' },
  PullRequestEvent:   { icon: 'fas fa-code-pull-request', label: 'PR on', type: 'ev-pr' },
  IssueCommentEvent:  { icon: 'fas fa-comment',       label: 'Commented', type: 'ev-comment' },
  DeleteEvent:        { icon: 'fas fa-trash',         label: 'Deleted',   type: 'ev-delete' },
};

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)        return 'just now';
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000)   return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
};

onMounted(async () => {
  try {
    const res = await fetch('https://api.github.com/users/captainnhwuy/events?per_page=10');
    if (!res.ok) return;
    const data = await res.json();
    events.value = data
      .filter(e => EVENT_ICONS[e.type])
      .slice(0, 4)
      .map(e => {
        const meta = EVENT_ICONS[e.type];
        return {
          icon: meta.icon,
          action: meta.label,
          type: meta.type,
          repo: e.repo.name.replace('captainnhwuy/', ''),
          time: timeAgo(e.created_at),
        };
      });
  } catch { /* silent */ }
});
</script>

<style scoped>
.gh-activity {
  background: var(--md-surface);
  border: 1px solid var(--md-outline-var);
  border-radius: var(--md-radius-lg);
  overflow: hidden;
  grid-column: span 3;
}

.gha-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: var(--md-surface-container);
  border-bottom: 1px solid var(--md-outline-var);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--md-on-surface-var);
}

.gha-header i { color: var(--md-primary); font-size: 0.9rem; }

.gha-badge {
  margin-left: auto;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 2px 7px;
  border-radius: 100px;
  background: rgba(76, 175, 80, 0.12);
  border: 1px solid rgba(76, 175, 80, 0.3);
  color: #4caf50;
  text-transform: uppercase;
}

.gha-list {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.gha-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  border-bottom: 1px solid var(--md-outline-var);
  transition: background 0.2s;
}
.gha-item:last-child { border-bottom: none; }
.gha-item:hover { background: var(--md-surface-container); }

.gha-icon {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  flex-shrink: 0;
}

.ev-push    { background: rgba(187,134,252,0.12); color: #BB86FC; }
.ev-create  { background: rgba(76,175,80,0.12);   color: #4caf50; }
.ev-star    { background: rgba(255,193,7,0.12);   color: #ffc107; }
.ev-fork    { background: rgba(3,218,198,0.12);   color: #03DAC6; }
.ev-issue   { background: rgba(244,67,54,0.12);   color: #f44336; }
.ev-pr      { background: rgba(33,150,243,0.12);  color: #2196F3; }
.ev-comment { background: rgba(156,39,176,0.12);  color: #9c27b0; }
.ev-delete  { background: rgba(244,67,54,0.08);   color: #ef9a9a; }

.gha-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.gha-action {
  font-size: 0.75rem;
  color: var(--md-on-surface-var);
}

.gha-repo {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--md-on-surface);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gha-time {
  font-size: 0.7rem;
  color: var(--md-on-surface-var);
  white-space: nowrap;
  font-family: var(--font-mono);
  flex-shrink: 0;
}
</style>
