import React from "react";
import { Button } from "@/components/ui/button";
import { NewChatButton } from "./NewChatBtn";
import {
  X,
  Plus,
  Folder,
  FileText,
  Home,
  User,
  Cpu,
  HelpCircle,
} from "lucide-react";

export const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  sidebarWidth,
  setFile,
  file,
  handlePDF
}) => (
  <div
    className={`${
      sidebarOpen ? "block" : "hidden"
    } flex flex-col lg:block bg-gray-900 text-white p-2 h-full sm:h-[100%] top-0 left-0 z-50 overflow-y-auto transition-all duration-300 ease-in-out font-mono`}
    style={{ width: `${sidebarWidth}px` }}
  >
    <div className="flex justify-between items-center lg:hidden mb-4">
      <h2 className="text-xl font-bold">Menu</h2>
      <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
        <X className="h-6 w-6" />
      </Button>
    </div>
    <div className="flex flex-col h-full">
      <div className="flex-grow">
        <NewChatButton setFile={setFile} handlePDF={handlePDF}/>
        <div className="flex space-x-2 mb-4">
          {/* <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-gray-800 hover:bg-gray-700"
          >
            <Plus className="mr-2 h-4 w-4" /> Upgrade to Plus
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-gray-800 hover:bg-gray-700"
          >
            <Folder className="mr-2 h-4 w-4" /> New Folder
          </Button> */}
        </div>
        <div className="flex-auto">
          {file && (
            <Button variant="ghost" className="w-full justify-start mb-1">
              <FileText className="mr-2 h-4 w-4" /> {file.name}
            </Button>
          )}
          
        </div>
      </div>
      <div className="mt-auto">
        <div
          className="box-border rounded-md border-[1px] border-[#385781] border-solid w-full text-[14px] text-[#ffffffa6] inline-block"
          role="alert"
        >
          <div className="box-border min-w-0 p-2">
            <a className="text-center p-1 underline underline-offset-4" href="">
              Sign in
            </a>
            to save your chat history
          </div>
        </div>
        <div className="text-[14px] my-2 mx-3 flex flex-wrap gap-[7px] whitespace-nowrap">
          <a href="/">Home</a>
          <a href="/">Account</a>
          <a href="/">FAQ</a>
          <a href="/">Feedback</a>
        </div>
      </div>
    </div>
  </div>
);
