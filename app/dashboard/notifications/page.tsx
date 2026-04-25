"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, AlertCircle, Check } from "lucide-react";
import { usePushNotifications } from "@/hooks/use-push-notifications";

export default function NotificationsPage() {
  const {
    isSupported,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubscribe = async () => {
    setProcessing(true);
    setMessage(null);
    
    const success = await subscribe();
    
    if (success) {
      setMessage({ type: "success", text: "Push notifications enabled successfully!" });
    } else {
      setMessage({ type: "error", text: "Failed to enable push notifications. Please try again." });
    }
    
    setProcessing(false);
  };

  const handleUnsubscribe = async () => {
    setProcessing(true);
    setMessage(null);
    
    const success = await unsubscribe();
    
    if (success) {
      setMessage({ type: "success", text: "Push notifications disabled." });
    } else {
      setMessage({ type: "error", text: "Failed to disable push notifications." });
    }
    
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSupported) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-600">Push notifications are not supported in your browser.</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <p>
                Please use a modern browser like Chrome, Safari, or Firefox to enable push notifications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-gray-600">Manage your push notification settings</p>
      </div>

      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <Check className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSubscribed ? (
              <Bell className="h-5 w-5 text-green-600" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            Push Notifications
          </CardTitle>
          <CardDescription>
            Get notified when your fasting sessions start and end
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Enable Push Notifications</Label>
              <p className="text-sm text-gray-600">
                {isSubscribed
                  ? "You will receive notifications on this device"
                  : "Enable to receive fasting reminders"}
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={isSubscribed}
              onCheckedChange={isSubscribed ? handleUnsubscribe : handleSubscribe}
              disabled={processing}
            />
          </div>

          {isSubscribed && (
            <div className="p-4 bg-green-50 rounded-md">
              <p className="text-sm text-green-700">
                <Check className="inline h-4 w-4 mr-1" />
                Push notifications are active. You&apos;ll receive reminders when your fasting
                sessions complete.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            What you&apos;ll be notified about
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <div>
                <p className="font-medium">Fasting Complete</p>
                <p className="text-sm text-gray-600">
                  Get notified when your fasting window ends and it&apos;s time to eat
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
              <div>
                <p className="font-medium">Fasting Started</p>
                <p className="text-sm text-gray-600">
                  Confirmation when you start a new fasting session
                </p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
