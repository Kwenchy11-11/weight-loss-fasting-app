"use client";

import { useState, useEffect, useCallback } from "react";

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
    }
    setLoading(false);
  }, []);

  const checkSubscription = useCallback(async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      
      setIsSubscribed(!!existingSubscription);
      setSubscription(existingSubscription);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  }, [isSupported]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const subscribe = async () => {
    if (!isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        console.error("VAPID public key not configured");
        return false;
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as any,
      });

      // Send subscription to server
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubscription),
      });

      if (response.ok) {
        setIsSubscribed(true);
        setSubscription(newSubscription);
        return true;
      }

      // If server save failed, unsubscribe
      await newSubscription.unsubscribe();
      return false;
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      return false;
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return false;

    try {
      // Delete from server first
      const response = await fetch(
        `/api/push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        setSubscription(null);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      return false;
    }
  };

  return {
    isSupported,
    isSubscribed,
    subscription,
    loading,
    subscribe,
    unsubscribe,
  };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
