const CACHE_NAME = "fasting-tracker-v2";

// Timer state for persistent notifications
let timerInterval = null;
let timerEndTime = null;
let timerMode = null;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/dashboard",
        "/dashboard/fasting",
        "/dashboard/calculator",
        "/manifest.json",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png",
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Handle messages from the main app
self.addEventListener("message", (event) => {
  const data = event.data;
  
  if (data.type === "START_TIMER") {
    startTimer(data.endTime, data.mode);
  } else if (data.type === "STOP_TIMER") {
    stopTimer();
  } else if (data.type === "GET_TIMER_STATE") {
    event.ports[0].postMessage({
      isRunning: !!timerInterval,
      endTime: timerEndTime,
      mode: timerMode,
    });
  }
});

function startTimer(endTime, mode) {
  timerEndTime = endTime;
  timerMode = mode;
  
  // Clear existing interval
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  // Update notification immediately
  updateTimerNotification();
  
  // Update every minute
  timerInterval = setInterval(() => {
    updateTimerNotification();
  }, 60000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerEndTime = null;
  timerMode = null;
  
  // Close the persistent notification
  self.registration.getNotifications({ tag: "fasting-timer" }).then((notifications) => {
    notifications.forEach((notification) => notification.close());
  });
}

function updateTimerNotification() {
  if (!timerEndTime) return;
  
  const now = Date.now();
  const end = new Date(timerEndTime).getTime();
  const remaining = end - now;
  
  if (remaining <= 0) {
    // Timer complete
    self.registration.showNotification("🎉 Fasting Complete!", {
      body: "Great job! Your fasting window has ended. Time to eat!",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
      tag: "fasting-complete",
      requireInteraction: true,
      actions: [
        { action: "open", title: "Open App" },
        { action: "dismiss", title: "Dismiss" },
      ],
      data: { url: "/dashboard/fasting" },
    });
    stopTimer();
    return;
  }
  
  // Format remaining time
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  
  // Show persistent notification with timer
  self.registration.showNotification(`⏱️ ${timeString} - ${timerMode || "Fasting"}`, {
    body: `Fasting in progress... Tap to view timer`,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: "fasting-timer",
    requireInteraction: false,
    silent: true,
    data: { url: "/dashboard/fasting" },
  });
}

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || "Fasting reminder",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: data.tag || "fasting-reminder",
    requireInteraction: data.requireInteraction !== false,
    actions: data.actions || [],
    data: data.data || { url: "/dashboard/fasting" },
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Fasting Tracker",
      options
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  const action = event.action;
  const notificationData = event.notification.data || {};
  const urlToOpen = new URL(notificationData.url || "/dashboard/fasting", self.location.origin).href;

  if (action === "dismiss") {
    return;
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync for timer updates
self.addEventListener("sync", (event) => {
  if (event.tag === "timer-update") {
    event.waitUntil(updateTimerNotification());
  }
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
