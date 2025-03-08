"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, GitBranch, Edit, LogOut, Settings , Newspaper} from "lucide-react";
import { Poppins, IBM_Plex_Mono } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100"],
  variable: "--font-ibm-plex-mono",
});

export default function EditorialHub() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/editorial/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return null;

  const menuItems = [
    
    {
      title: "Add Course",
      icon: <BookOpen className="h-8 w-8" />,
      href: "/editorial/add-course",
      description: "Add new courses to the curriculum",
    },
    {
      title: "Add Papers",
      icon: <Newspaper className="h-8 w-8" />,
      href: "/editorial/add-papers",
      description: "Add Exam Papers",
    },
    {
      title: "Edit Course",
      icon: <Edit className="h-8 w-8" />,
      href: "/editorial/edit-course",
      description: "Modify existing course content and settings",
    },
    {
      title: "Add Branch",
      icon: <GitBranch className="h-8 w-8" />,
      href: "/editorial/add-branch",
      description: "Create and configure new educational branches",
    },
    {
      title: "Edit Branch",
      icon: <Settings className="h-8 w-8" />,
      href: "/editorial/edit-branch",
      description: "Modify existing branch settings and structure",
    },
    
  ];

  return (
    <div
      className={`min-h-screen ${poppins.variable}`}
    >
      {/* Header with Logout */}
      <div className="backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-blue-700">
            Editorial Hub
          </h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/editorial/login");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 text-sm md:text-base"
          >
            <LogOut className="h-4 w-4 md:h-5 md:w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {menuItems.map((item) => (
            <Link href={item.href} key={item.href}>
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="bg-blue-50 p-3 md:p-4 rounded-full mb-3 md:mb-4 group-hover:bg-blue-100 transition-colors duration-300">
                    {item.icon}
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-blue-700 mb-2">
                    {item.title}
                  </h2>
                  <p className={`${ibmPlexMono.variable} text-blue-600/80 text-xs md:text-sm`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
