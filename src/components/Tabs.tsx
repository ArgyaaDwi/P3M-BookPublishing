"use client";
import { useState } from "react";

interface TabItem {
  title: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div>
      <div className="text-sm font-medium px-5 text-center text-gray-400 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab, index) => (
            <li className="me-2" key={index}>
              <button
                onClick={() => setActiveTab(index)}
                className={`inline-block p-4 border-b-2 text-sm font-semibold rounded-t-lg ${
                  activeTab === index
                    ? "text-primary border-primary"
                    : "text-gray-400 border-transparent hover:text-primary hover:border-primary"
                }`}
              >
                {tab.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">{tabs[activeTab].content}</div>
    </div>
  );
};
export default Tabs;
