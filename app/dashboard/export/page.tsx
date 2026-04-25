"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Clock, Scale } from "lucide-react";

export default function ExportPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const downloadFile = async (type: string) => {
    setDownloading(type);
    try {
      const response = await fetch(`/api/export?type=${type}`);
      
      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fasting-data-${type}-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file. Please try again.");
    }
    setDownloading(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Export Data</h1>
        <p className="text-gray-600">Download your fasting and weight data as Excel files</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export All */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              Complete Export
            </CardTitle>
            <CardDescription>
              Download all your data in one file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Includes:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>All fasting sessions</li>
              <li>All weight logs</li>
              <li>Weight statistics summary</li>
            </ul>
            <Button
              onClick={() => downloadFile("all")}
              disabled={downloading === "all"}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading === "all" ? "Downloading..." : "Download All Data"}
            </Button>
          </CardContent>
        </Card>

        {/* Export Fasting Only */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Fasting Data Only
            </CardTitle>
            <CardDescription>
              Export just your fasting sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Includes:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Fasting session dates</li>
              <li>Mode (OMAD/Warrior)</li>
              <li>Duration and status</li>
            </ul>
            <Button
              onClick={() => downloadFile("fasting")}
              disabled={downloading === "fasting"}
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading === "fasting" ? "Downloading..." : "Download Fasting Data"}
            </Button>
          </CardContent>
        </Card>

        {/* Export Weight Only */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-600" />
              Weight Data Only
            </CardTitle>
            <CardDescription>
              Export just your weight logs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Includes:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Daily weight entries</li>
              <li>Progress over time</li>
              <li>Statistics summary</li>
            </ul>
            <Button
              onClick={() => downloadFile("weight")}
              disabled={downloading === "weight"}
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloading === "weight" ? "Downloading..." : "Download Weight Data"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Data Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-gray-600">
          <p>
            Your data is exported in Excel format (.xlsx) which can be opened in:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Microsoft Excel</li>
            <li>Google Sheets</li>
            <li>Apple Numbers</li>
            <li>LibreOffice Calc</li>
          </ul>
          <p>
            The exported files contain all your historical data and can be used for:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Creating custom charts and reports</li>
            <li>Sharing with healthcare providers</li>
            <li>Keeping personal backups</li>
            <li>Importing into other fitness apps</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Your data is exported directly from your browser and is not stored on any server during the export process.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
