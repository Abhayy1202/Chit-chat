import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, MessageSquare } from "lucide-react";

export const MobileHeader = ({
  setSidebarOpen,
  setChatOpen,
  sidebarOpen,
  chatOpen,
}) => (
  <div className="flex justify-between items-center z-20 p-4 bg-gray-900 text-white lg:hidden">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      <Menu className="h-6 w-6" />
    </Button>
    <h1 className="text-xl font-bold">PDF Viewer</h1>
    <Button variant="ghost" size="icon" onClick={() => setChatOpen(!chatOpen)}>
      <MessageSquare className="h-6 w-6" />
    </Button>
  </div>
);
